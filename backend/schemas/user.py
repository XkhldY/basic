from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
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

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str