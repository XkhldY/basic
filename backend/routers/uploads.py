from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserType
from auth.dependencies import get_current_active_user
from utils.s3_service import s3_service
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/uploads", tags=["file uploads"])

ALLOWED_FILE_TYPES = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload a resume for the current candidate user"""
    
    # Require candidate role
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload resumes"
        )
    
    # Validate file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_FILE_TYPES.values())}"
        )
    
    try:
        # Read file content and validate size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024 * 1024)}MB"
            )
        
        # Note: We don't delete old resume from S3 to preserve file history
        # The old file will remain in S3 but won't be accessible to the user
        
        # Upload new resume to S3
        upload_result = s3_service.upload_file(
            file_content, 
            file.filename, 
            file.content_type, 
            current_user.id
        )
        
        if not upload_result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload file"
            )
        
        # Update user record with resume information
        current_user.resume_url = upload_result['file_key']
        current_user.resume_file_name = upload_result['file_name']
        current_user.resume_uploaded_at = upload_result['uploaded_at']
        current_user.resume_file_size = upload_result['file_size']
        
        db.commit()
        
        logger.info(f"Resume uploaded successfully for user {current_user.id}: {file.filename}")
        
        return {
            "message": "Resume uploaded successfully",
            "file_name": upload_result['file_name'],
            "file_size": upload_result['file_size'],
            "uploaded_at": upload_result['uploaded_at'].isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading resume for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during upload"
        )

@router.delete("/resume")
async def delete_resume(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete the current user's resume"""
    
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can delete resumes"
        )
    
    if not current_user.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found"
        )
    
    try:
        # Store the S3 key for potential future reference (but don't delete from S3)
        s3_key = current_user.resume_url
        
        # Remove resume information from user profile (soft delete)
        current_user.resume_url = None
        current_user.resume_file_name = None
        current_user.resume_uploaded_at = None
        current_user.resume_file_size = None
        db.commit()
        
        logger.info(f"Resume removed from user profile {current_user.id} (S3 file preserved: {s3_key})")
        return {"message": "Resume deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting resume for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during deletion"
        )

@router.get("/resume")
async def get_resume_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's resume information"""
    
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access resume information"
        )
    
    if not current_user.resume_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume found"
        )
    
    # Generate fresh download URL
    download_url = s3_service.generate_download_url(current_user.resume_url)
    
    return {
        "file_name": current_user.resume_file_name,
        "file_size": current_user.resume_file_size,
        "uploaded_at": current_user.resume_uploaded_at.isoformat() if current_user.resume_uploaded_at else None,
        "download_url": download_url
    }



