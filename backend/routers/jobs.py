from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, and_
from database import get_db
from models.job import Job, JobStatus, EmploymentType, LocationType
from models.application import Application, ApplicationStatus
from models.user import User, UserType
from schemas.job import (
    JobCreate, JobUpdate, JobResponse, JobListItem, 
    ApplicationCreate, ApplicationResponse, ApplicationUpdate,
    JobStatusEnum, EmploymentTypeEnum, LocationTypeEnum
)
from auth.dependencies import get_current_user
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

# Public job endpoints
@router.get("", response_model=List[JobListItem])
async def get_jobs(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    employment_type: Optional[EmploymentTypeEnum] = Query(None),
    location_type: Optional[LocationTypeEnum] = Query(None),
    experience_level: Optional[str] = Query(None),
    salary_min: Optional[float] = Query(None, ge=0),
    company: Optional[str] = Query(None)
):
    """Get all active jobs with filtering and search"""
    query = db.query(Job).filter(Job.status == JobStatus.ACTIVE)
    
    # Apply filters
    if search:
        query = query.filter(
            or_(
                Job.title.ilike(f"%{search}%"),
                Job.description.ilike(f"%{search}%"),
                Job.required_skills.ilike(f"%{search}%")
            )
        )
    
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    
    if employment_type:
        query = query.filter(Job.employment_type == employment_type)
        
    if location_type:
        query = query.filter(Job.location_type == location_type)
        
    if experience_level:
        query = query.filter(Job.experience_level.ilike(f"%{experience_level}%"))
        
    if salary_min:
        query = query.filter(Job.salary_min >= salary_min)
        
    if company:
        query = query.filter(Job.company_name.ilike(f"%{company}%"))
    
    # Order by newest first
    query = query.order_by(desc(Job.created_at))
    
    # Apply pagination
    jobs = query.offset(skip).limit(limit).all()
    
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get job details by ID"""
    job = db.query(Job).filter(Job.id == job_id, Job.status == JobStatus.ACTIVE).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Increment view count
    job.views_count += 1
    db.commit()
    
    return job

# Employer job management endpoints
@router.get("/employer/my-jobs", response_model=List[JobListItem])
async def get_employer_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[JobStatusEnum] = Query(None)
):
    """Get jobs posted by current employer"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access this endpoint"
        )
    
    query = db.query(Job).filter(Job.employer_id == current_user.id)
    
    if status_filter:
        query = query.filter(Job.status == status_filter)
    
    jobs = query.order_by(desc(Job.created_at)).all()
    return jobs

@router.post("", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new job posting"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can create job postings"
        )
    
    job = Job(
        **job_data.dict(),
        employer_id=current_user.id,
        company_name=current_user.company_name or "Unknown Company"
    )
    
    db.add(job)
    db.commit()
    db.refresh(job)
    
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a job posting"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own job postings"
        )
    
    # Update fields
    update_data = job_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    # Set published date when status changes to active
    if job_data.status == JobStatusEnum.ACTIVE and job.published_at is None:
        job.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(job)
    
    return job

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a job posting"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    if job.employer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own job postings"
        )
    
    db.delete(job)
    db.commit()
    
    return {"message": "Job deleted successfully"}

# Job application endpoints
@router.post("/{job_id}/apply", response_model=ApplicationResponse)
async def apply_to_job(
    job_id: int,
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Apply to a job"""
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can apply to jobs"
        )
    
    # Check if job exists and is active
    job = db.query(Job).filter(Job.id == job_id, Job.status == JobStatus.ACTIVE).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or no longer active"
        )
    
    # Check if already applied
    existing_application = db.query(Application).filter(
        Application.job_id == job_id,
        Application.candidate_id == current_user.id
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    # Create application
    application = Application(
        job_id=job_id,
        candidate_id=current_user.id,
        cover_letter=application_data.cover_letter,
        additional_notes=application_data.additional_notes
    )
    
    db.add(application)
    
    # Increment application count
    job.applications_count += 1
    
    db.commit()
    db.refresh(application)
    
    return application

@router.get("/{job_id}/applications", response_model=List[ApplicationResponse])
async def get_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get applications for a job (employer only)"""
    if current_user.user_type != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can view job applications"
        )
    
    # Check if job belongs to current employer
    job = db.query(Job).filter(Job.id == job_id, Job.employer_id == current_user.id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    
    # Add candidate and job info to applications
    for app in applications:
        app.job_title = job.title
        app.company_name = job.company_name
        app.candidate_name = app.candidate.name
        app.candidate_email = app.candidate.email
    
    return applications