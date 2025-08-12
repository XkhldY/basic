from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class JobStatus(enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"

class EmploymentType(enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"

class LocationType(enum.Enum):
    REMOTE = "remote"
    ON_SITE = "on_site"
    HYBRID = "hybrid"

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)
    
    # Employer info
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(200), nullable=False)
    
    # Job details
    location = Column(String(200), nullable=True)
    location_type = Column(Enum(LocationType), nullable=False, default=LocationType.ON_SITE)
    employment_type = Column(Enum(EmploymentType), nullable=False, default=EmploymentType.FULL_TIME)
    
    # Salary
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    salary_currency = Column(String(3), nullable=True, default="USD")
    
    # Skills and experience
    required_skills = Column(Text, nullable=True)  # JSON array of skills
    experience_level = Column(String(50), nullable=True)  # entry, mid, senior, executive
    
    # Application details
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    application_email = Column(String(255), nullable=True)
    application_url = Column(String(500), nullable=True)
    
    # Status and metadata
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    employer = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="job", cascade="all, delete-orphan")