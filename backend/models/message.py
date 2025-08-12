from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Participants
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Message content
    subject = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    
    # Context (optional - related to job/application)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    
    # Status
    is_read = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")
    job = relationship("Job", back_populates="messages")
    application = relationship("Application", back_populates="messages")