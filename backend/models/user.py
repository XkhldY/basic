from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserType(enum.Enum):
    CANDIDATE = "candidate"
    EMPLOYER = "employer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Employer specific fields
    company_name = Column(String(200), nullable=True)
    company_size = Column(String(50), nullable=True)
    industry = Column(String(100), nullable=True)
    company_description = Column(Text, nullable=True)
    
    # Candidate specific fields
    professional_title = Column(String(150), nullable=True)
    experience_level = Column(String(50), nullable=True)
    skills = Column(Text, nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    
    # Admin specific fields
    admin_role = Column(String(50), nullable=True)  # super_admin, user_manager, content_moderator, analyst
    permissions = Column(Text, nullable=True)  # JSON string of permissions
    department = Column(String(100), nullable=True)
    
    # Relationships
    jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")
    applications = relationship("Application", foreign_keys="Application.candidate_id", back_populates="candidate", cascade="all, delete-orphan")