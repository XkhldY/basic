from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_
from database import get_db
from models.application import Application, ApplicationStatus
from models.job import Job
from models.user import User, UserType
from schemas.job import ApplicationResponse, ApplicationUpdate
from auth.dependencies import get_current_user
from typing import List, Optional

router = APIRouter(prefix="/api/applications", tags=["applications"])

# Candidate endpoints
@router.get("/my-applications", response_model=List[ApplicationResponse])
async def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None)
):
    """Get applications submitted by current candidate"""
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )
    
    query = db.query(Application).options(
        joinedload(Application.job),
        joinedload(Application.candidate)
    ).filter(Application.candidate_id == current_user.id)
    
    if status_filter:
        query = query.filter(Application.status == status_filter)
    
    applications = query.order_by(desc(Application.created_at)).all()
    
    # Add job and candidate info
    for app in applications:
        app.job_title = app.job.title
        app.company_name = app.job.company_name
        app.candidate_name = app.candidate.name
        app.candidate_email = app.candidate.email
    
    return applications

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application_detail(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get application details"""
    application = db.query(Application).options(
        joinedload(Application.job),
        joinedload(Application.candidate)
    ).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check permissions
    if current_user.user_type == UserType.CANDIDATE:
        if application.candidate_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own applications"
            )
    elif current_user.user_type == UserType.EMPLOYER:
        if application.job.employer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view applications for your jobs"
            )
    else:
        # Admin can view all
        pass
    
    # Add related info
    application.job_title = application.job.title
    application.company_name = application.job.company_name
    application.candidate_name = application.candidate.name
    application.candidate_email = application.candidate.email
    
    return application

# Employer endpoints
@router.put("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    status_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update application status (employer only)"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can update application status"
        )
    
    application = db.query(Application).options(
        joinedload(Application.job),
        joinedload(Application.candidate)
    ).filter(Application.id == application_id).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check if employer owns the job
    if application.job.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update applications for your jobs"
        )
    
    # Update fields
    update_data = status_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == 'status':
            # Set reviewed timestamp when status changes from pending
            if application.status == ApplicationStatus.PENDING and value != ApplicationStatus.PENDING:
                from datetime import datetime
                application.reviewed_at = datetime.utcnow()
        setattr(application, field, value)
    
    db.commit()
    db.refresh(application)
    
    # Add related info
    application.job_title = application.job.title
    application.company_name = application.job.company_name
    application.candidate_name = application.candidate.name
    application.candidate_email = application.candidate.email
    
    return application

@router.get("/employer/all", response_model=List[ApplicationResponse])
async def get_employer_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    job_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200)
):
    """Get all applications for employer's jobs"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access this endpoint"
        )
    
    # Base query for applications on employer's jobs
    query = db.query(Application).options(
        joinedload(Application.job),
        joinedload(Application.candidate)
    ).join(Job).filter(Job.employer_id == current_user.id)
    
    # Apply filters
    if job_id:
        query = query.filter(Application.job_id == job_id)
    
    if status_filter:
        query = query.filter(Application.status == status_filter)
    
    # Order by newest first and apply pagination
    applications = query.order_by(desc(Application.created_at)).offset(skip).limit(limit).all()
    
    # Add related info
    for app in applications:
        app.job_title = app.job.title
        app.company_name = app.job.company_name
        app.candidate_name = app.candidate.name
        app.candidate_email = app.candidate.email
    
    return applications

@router.get("/employer/stats")
async def get_employer_application_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get application statistics for employer"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access this endpoint"
        )
    
    # Get stats for all applications on employer's jobs
    base_query = db.query(Application).join(Job).filter(Job.employer_id == current_user.id)
    
    total_applications = base_query.count()
    pending_applications = base_query.filter(Application.status == ApplicationStatus.PENDING).count()
    reviewed_applications = base_query.filter(Application.status == ApplicationStatus.REVIEWED).count()
    shortlisted_applications = base_query.filter(Application.status == ApplicationStatus.SHORTLISTED).count()
    interviewed_applications = base_query.filter(
        Application.status.in_([ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.INTERVIEWED])
    ).count()
    offered_applications = base_query.filter(Application.status == ApplicationStatus.OFFERED).count()
    
    return {
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "reviewed_applications": reviewed_applications,
        "shortlisted_applications": shortlisted_applications,
        "interviewed_applications": interviewed_applications,
        "offered_applications": offered_applications
    }

# Bulk operations
@router.post("/bulk-update")
async def bulk_update_applications(
    application_ids: List[int],
    status_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bulk update application statuses"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can bulk update applications"
        )
    
    # Get applications and verify ownership
    applications = db.query(Application).join(Job).filter(
        and_(
            Application.id.in_(application_ids),
            Job.employer_id == current_user.id
        )
    ).all()
    
    if len(applications) != len(application_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Some applications not found or not owned by you"
        )
    
    # Update all applications
    update_data = status_update.dict(exclude_unset=True)
    updated_count = 0
    
    for application in applications:
        for field, value in update_data.items():
            if field == 'status':
                # Set reviewed timestamp when status changes from pending
                if application.status == ApplicationStatus.PENDING and value != ApplicationStatus.PENDING:
                    from datetime import datetime
                    application.reviewed_at = datetime.utcnow()
            setattr(application, field, value)
        updated_count += 1
    
    db.commit()
    
    return {"message": f"Successfully updated {updated_count} applications"}