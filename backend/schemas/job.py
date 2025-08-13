from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums for frontend
class JobStatusEnum(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"

class EmploymentTypeEnum(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"

class LocationTypeEnum(str, Enum):
    REMOTE = "remote"
    ON_SITE = "on_site"
    HYBRID = "hybrid"

class ApplicationStatusEnum(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEWED = "interviewed"
    OFFERED = "offered"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

# Job schemas
class JobBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    location: Optional[str] = None
    location_type: LocationTypeEnum = LocationTypeEnum.ON_SITE
    employment_type: EmploymentTypeEnum = EmploymentTypeEnum.FULL_TIME
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    salary_currency: str = "USD"
    required_skills: Optional[str] = None  # JSON string
    experience_level: Optional[str] = None
    application_deadline: Optional[datetime] = None
    application_email: Optional[str] = None
    application_url: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    location: Optional[str] = None
    location_type: Optional[LocationTypeEnum] = None
    employment_type: Optional[EmploymentTypeEnum] = None
    salary_min: Optional[float] = Field(None, ge=0)
    salary_max: Optional[float] = Field(None, ge=0)
    salary_currency: Optional[str] = None
    required_skills: Optional[str] = None
    experience_level: Optional[str] = None
    application_deadline: Optional[datetime] = None
    application_email: Optional[str] = None
    application_url: Optional[str] = None
    status: Optional[JobStatusEnum] = None

class JobResponse(JobBase):
    id: int
    employer_id: int
    company_name: str
    status: JobStatusEnum
    is_featured: bool
    views_count: int
    applications_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class JobListItem(BaseModel):
    id: int
    title: str
    company_name: str
    location: Optional[str] = None
    location_type: LocationTypeEnum
    employment_type: EmploymentTypeEnum
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    salary_currency: str
    status: JobStatusEnum
    created_at: datetime
    views_count: int
    applications_count: int
    
    class Config:
        from_attributes = True

# Application schemas
class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None
    additional_notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    job_id: int

class ApplicationUpdate(BaseModel):
    cover_letter: Optional[str] = None
    additional_notes: Optional[str] = None
    status: Optional[ApplicationStatusEnum] = None
    employer_notes: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    job_id: int
    candidate_id: int
    status: ApplicationStatusEnum
    employer_notes: Optional[str] = None
    resume_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    reviewed_at: Optional[datetime] = None
    
    # Nested job and candidate info
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    
    class Config:
        from_attributes = True