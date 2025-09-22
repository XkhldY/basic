from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Union
from datetime import datetime, date
from enum import Enum


class UserType(str, Enum):
    CANDIDATE = "candidate"
    EMPLOYER = "employer"
    ADMIN = "admin"


# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    user_type: UserType


# Registration schemas
class CandidateRegistrationRequest(UserBase):
    password: str
    user_type: UserType = UserType.CANDIDATE
    professional_title: str
    experience_level: str
    skills: str
    portfolio_url: Optional[str] = None


class EmployerRegistrationRequest(UserBase):
    password: str
    user_type: UserType = UserType.EMPLOYER
    company_name: str
    company_size: str
    industry: str
    company_description: Optional[str] = None


class AdminRegistrationRequest(UserBase):
    password: str
    user_type: UserType = UserType.ADMIN
    admin_role: str = "user_manager"  # default role
    department: Optional[str] = None


# Login schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


# User response schemas
class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Optional fields based on user type
    company_name: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    company_description: Optional[str] = None
    professional_title: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[str] = None
    portfolio_url: Optional[str] = None
    admin_role: Optional[str] = None
    permissions: Optional[str] = None
    department: Optional[str] = None

    # NEW EMPLOYER FIELDS
    company_website: Optional[str] = None
    company_logo_url: Optional[str] = None
    founded_year: Optional[int] = None
    company_type: Optional[str] = None
    revenue_range: Optional[str] = None
    employee_count: Optional[int] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_city: Optional[str] = None
    company_state: Optional[str] = None
    company_country: Optional[str] = None
    company_postal_code: Optional[str] = None
    tax_id: Optional[str] = None
    registration_number: Optional[str] = None
    business_license: Optional[str] = None
    hiring_frequency: Optional[str] = None
    typical_contract_length: Optional[str] = None
    remote_policy: Optional[str] = None
    benefits_offered: Optional[List[str]] = None
    company_verified: Optional[bool] = None
    verification_documents: Optional[List[Dict[str, str]]] = None
    trust_score: Optional[int] = None

    # NEW CANDIDATE FIELDS
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    education_level: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_salary: Optional[int] = None
    expected_salary: Optional[int] = None
    preferred_work_type: Optional[str] = None
    willing_to_relocate: Optional[bool] = None
    notice_period: Optional[str] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    desired_industries: Optional[List[str]] = None
    work_schedule_preference: Optional[str] = None
    remote_work_preference: Optional[str] = None
    travel_willingness: Optional[str] = None
    profile_completion_percentage: Optional[int] = None
    last_profile_update: Optional[datetime] = None

    # Resume fields
    resume_url: Optional[str] = None
    resume_file_name: Optional[str] = None
    resume_uploaded_at: Optional[datetime] = None
    resume_file_size: Optional[int] = None

    class Config:
        from_attributes = True


# Profile update schemas
class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    company_description: Optional[str] = None
    professional_title: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[str] = None
    portfolio_url: Optional[str] = None


# NEW ADVANCED PROFILE UPDATE SCHEMAS
class AdvancedCandidateProfileUpdate(BaseModel):
    # Basic Profile Fields
    name: Optional[str] = None
    professional_title: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[str] = None
    portfolio_url: Optional[str] = None

    # Personal & Contact
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

    # Professional Details
    education_level: Optional[str] = None
    years_of_experience: Optional[str] = None
    current_salary: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_work_type: Optional[str] = None
    willing_to_relocate: Optional[bool] = None
    notice_period: Optional[str] = None

    # Skills & Expertise
    technical_skills: Optional[Union[List[str], str]] = (
        None  # Accept both list and string
    )
    soft_skills: Optional[Union[List[str], str]] = None
    certifications: Optional[Union[List[str], str]] = (
        None  # Accept both list and string
    )
    languages: Optional[Union[List[str], str]] = None

    # Work Preferences
    desired_industries: Optional[Union[List[str], str]] = (
        None  # Accept both list and string
    )
    work_schedule_preference: Optional[str] = None
    remote_work_preference: Optional[str] = None
    travel_willingness: Optional[str] = None


class AdvancedEmployerProfileUpdate(BaseModel):
    # Company & Business Details
    company_website: Optional[str] = None
    company_logo_url: Optional[str] = None
    founded_year: Optional[str] = None
    company_type: Optional[str] = None
    revenue_range: Optional[str] = None
    employee_count: Optional[str] = None

    # Contact & Location
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_city: Optional[str] = None
    company_state: Optional[str] = None
    company_country: Optional[str] = None
    company_postal_code: Optional[str] = None

    # Business Details
    tax_id: Optional[str] = None
    registration_number: Optional[str] = None
    business_license: Optional[str] = None

    # Hiring Preferences
    hiring_frequency: Optional[str] = None
    typical_contract_length: Optional[str] = None
    remote_policy: Optional[str] = None
    benefits_offered: Optional[List[str]] = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


# NEW SCHEMAS FOR PROFILE COMPLETION
class ProfileCompletionResponse(BaseModel):
    completion_percentage: int
    missing_fields: List[str]
    completed_sections: List[str]
    total_sections: int


class DocumentUploadRequest(BaseModel):
    document_type: str
    file_url: str
    file_name: str
    file_size: int
    uploaded_at: datetime
