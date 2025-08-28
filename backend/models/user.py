from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum, Date, JSON
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
    
    # NEW EMPLOYER FIELDS
    company_website = Column(String(500), nullable=True)
    company_logo_url = Column(String(500), nullable=True)
    founded_year = Column(Integer, nullable=True)
    company_type = Column(String(100), nullable=True)  # startup, enterprise, agency, etc.
    revenue_range = Column(String(100), nullable=True)  # $1M-$10M, $10M-$100M, etc.
    employee_count = Column(Integer, nullable=True)
    contact_person = Column(String(100), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    company_address = Column(Text, nullable=True)
    company_city = Column(String(100), nullable=True)
    company_state = Column(String(100), nullable=True)
    company_country = Column(String(100), nullable=True)
    company_postal_code = Column(String(20), nullable=True)
    tax_id = Column(String(100), nullable=True)
    registration_number = Column(String(100), nullable=True)
    business_license = Column(String(100), nullable=True)
    hiring_frequency = Column(String(50), nullable=True)  # monthly, quarterly, as needed
    typical_contract_length = Column(String(50), nullable=True)  # permanent, 6 months, 1 year
    remote_policy = Column(String(100), nullable=True)  # fully remote, hybrid, on-site only
    benefits_offered = Column(JSON, nullable=True)  # JSON array of benefits
    company_verified = Column(Boolean, default=False)
    verification_documents = Column(JSON, nullable=True)  # JSON array of document URLs
    trust_score = Column(Integer, default=0)
    
    # Candidate specific fields
    professional_title = Column(String(150), nullable=True)
    experience_level = Column(String(50), nullable=True)
    skills = Column(Text, nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    
    # NEW CANDIDATE FIELDS
    phone_number = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    location = Column(String(200), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    education_level = Column(String(100), nullable=True)  # Bachelor's, Master's, PhD, etc.
    years_of_experience = Column(Integer, nullable=True)
    current_salary = Column(Integer, nullable=True)  # Annual salary in USD
    expected_salary = Column(Integer, nullable=True)
    preferred_work_type = Column(String(50), nullable=True)  # remote, hybrid, on-site
    willing_to_relocate = Column(Boolean, default=False)
    notice_period = Column(String(50), nullable=True)  # 2 weeks, 1 month, etc.
    technical_skills = Column(JSON, nullable=True)  # JSON array of technical skills
    soft_skills = Column(JSON, nullable=True)  # JSON array of soft skills
    certifications = Column(JSON, nullable=True)  # JSON array of certifications
    languages = Column(JSON, nullable=True)  # JSON array of languages with proficiency
    desired_industries = Column(JSON, nullable=True)  # JSON array
    work_schedule_preference = Column(String(50), nullable=True)  # full-time, part-time, contract
    remote_work_preference = Column(String(50), nullable=True)  # fully remote, hybrid, occasional
    travel_willingness = Column(String(50), nullable=True)  # none, occasional, frequent
    profile_completion_percentage = Column(Integer, default=0)
    last_profile_update = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Resume fields
    resume_url = Column(String(500), nullable=True)
    resume_file_name = Column(String(255), nullable=True)
    resume_uploaded_at = Column(DateTime(timezone=True), nullable=True)
    resume_file_size = Column(Integer, nullable=True)
    
    # Admin specific fields
    admin_role = Column(String(50), nullable=True)  # super_admin, user_manager, content_moderator, analyst
    permissions = Column(Text, nullable=True)  # JSON string of permissions
    department = Column(String(100), nullable=True)
    
    # Relationships
    jobs = relationship("Job", back_populates="employer", cascade="all, delete-orphan")
    applications = relationship("Application", foreign_keys="Application.candidate_id", back_populates="candidate", cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender", cascade="all, delete-orphan")
    received_messages = relationship("Message", foreign_keys="Message.recipient_id", back_populates="recipient", cascade="all, delete-orphan")