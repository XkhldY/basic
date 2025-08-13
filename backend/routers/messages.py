from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import List, Optional
from database import get_db
from models.message import Message
from models.user import User
from models.job import Job
from models.application import Application
from auth.dependencies import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/messages", tags=["messages"])

class MessageCreate(BaseModel):
    recipient_id: int
    subject: str
    content: str
    job_id: Optional[int] = None
    application_id: Optional[int] = None

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    sender_name: str
    recipient_name: str
    subject: str
    content: str
    is_read: bool
    job_id: Optional[int]
    application_id: Optional[int]
    job_title: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    participant_id: int
    participant_name: str
    latest_message: MessageResponse
    unread_count: int
    
    class Config:
        from_attributes = True

@router.post("/send", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify recipient exists
    recipient = db.query(User).filter(User.id == message_data.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Verify job exists if job_id provided
    job = None
    if message_data.job_id:
        job = db.query(Job).filter(Job.id == message_data.job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
    
    # Verify application exists if application_id provided
    application = None
    if message_data.application_id:
        application = db.query(Application).filter(Application.id == message_data.application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Ensure user has access to this application
        if (current_user.user_type == "candidate" and application.candidate_id != current_user.id) or \
           (current_user.user_type == "employer" and application.job.employer_id != current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
    
    # Create message
    message = Message(
        sender_id=current_user.id,
        recipient_id=message_data.recipient_id,
        subject=message_data.subject,
        content=message_data.content,
        job_id=message_data.job_id,
        application_id=message_data.application_id
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Return message with sender/recipient names
    return MessageResponse(
        id=message.id,
        sender_id=message.sender_id,
        recipient_id=message.recipient_id,
        sender_name=current_user.full_name,
        recipient_name=recipient.full_name,
        subject=message.subject,
        content=message.content,
        is_read=message.is_read,
        job_id=message.job_id,
        application_id=message.application_id,
        job_title=job.title if job else None,
        created_at=message.created_at
    )

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all conversations (grouped by participant)
    conversations = []
    
    # Get unique conversation partners
    partners_query = db.query(
        User.id,
        User.full_name
    ).join(
        Message, 
        or_(
            and_(Message.sender_id == User.id, Message.recipient_id == current_user.id),
            and_(Message.recipient_id == User.id, Message.sender_id == current_user.id)
        )
    ).filter(
        User.id != current_user.id
    ).distinct()
    
    for partner_id, partner_name in partners_query:
        # Get latest message in conversation
        latest_message = db.query(Message).join(User, Message.sender_id == User.id).filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.recipient_id == partner_id),
                and_(Message.sender_id == partner_id, Message.recipient_id == current_user.id)
            )
        ).order_by(desc(Message.created_at)).first()
        
        if latest_message:
            # Count unread messages from this partner
            unread_count = db.query(Message).filter(
                and_(
                    Message.sender_id == partner_id,
                    Message.recipient_id == current_user.id,
                    Message.is_read == False
                )
            ).count()
            
            # Get job title if applicable
            job_title = None
            if latest_message.job_id:
                job = db.query(Job).filter(Job.id == latest_message.job_id).first()
                job_title = job.title if job else None
            
            conversations.append(ConversationResponse(
                participant_id=partner_id,
                participant_name=partner_name,
                latest_message=MessageResponse(
                    id=latest_message.id,
                    sender_id=latest_message.sender_id,
                    recipient_id=latest_message.recipient_id,
                    sender_name=latest_message.sender.full_name,
                    recipient_name=latest_message.recipient.full_name,
                    subject=latest_message.subject,
                    content=latest_message.content,
                    is_read=latest_message.is_read,
                    job_id=latest_message.job_id,
                    application_id=latest_message.application_id,
                    job_title=job_title,
                    created_at=latest_message.created_at
                ),
                unread_count=unread_count
            ))
    
    # Sort by latest message timestamp
    conversations.sort(key=lambda x: x.latest_message.created_at, reverse=True)
    return conversations

@router.get("/conversation/{participant_id}", response_model=List[MessageResponse])
def get_conversation_messages(
    participant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=100)
):
    # Verify participant exists
    participant = db.query(User).filter(User.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    
    # Get messages in conversation
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.id, Message.recipient_id == participant_id),
            and_(Message.sender_id == participant_id, Message.recipient_id == current_user.id)
        )
    ).order_by(desc(Message.created_at)).limit(limit).all()
    
    # Mark messages from participant as read
    db.query(Message).filter(
        and_(
            Message.sender_id == participant_id,
            Message.recipient_id == current_user.id,
            Message.is_read == False
        )
    ).update({Message.is_read: True})
    db.commit()
    
    # Convert to response format
    response_messages = []
    for message in messages:
        job_title = None
        if message.job_id:
            job = db.query(Job).filter(Job.id == message.job_id).first()
            job_title = job.title if job else None
        
        response_messages.append(MessageResponse(
            id=message.id,
            sender_id=message.sender_id,
            recipient_id=message.recipient_id,
            sender_name=message.sender.full_name,
            recipient_name=message.recipient.full_name,
            subject=message.subject,
            content=message.content,
            is_read=message.is_read,
            job_id=message.job_id,
            application_id=message.application_id,
            job_title=job_title,
            created_at=message.created_at
        ))
    
    return list(reversed(response_messages))  # Return in chronological order

@router.get("/unread-count")
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    count = db.query(Message).filter(
        and_(
            Message.recipient_id == current_user.id,
            Message.is_read == False
        )
    ).count()
    
    return {"unread_count": count}

@router.put("/{message_id}/read")
def mark_message_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.recipient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    message.is_read = True
    db.commit()
    
    return {"message": "Message marked as read"}