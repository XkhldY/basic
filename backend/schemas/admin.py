from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Admin Role Types
ADMIN_ROLES = {
    "super_admin": "Full system access",
    "user_manager": "User account management", 
    "content_moderator": "Content review and moderation",
    "analyst": "Read-only analytics access"
}

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    admin_id: int
    action: str
    target_type: str
    target_id: Optional[int] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuditLogCreate(BaseModel):
    action: str
    target_type: str
    target_id: Optional[int] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

# System Settings Schemas
class SystemSettingsResponse(BaseModel):
    id: int
    key: str
    value: Optional[str] = None
    description: Optional[str] = None
    is_public: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class SystemSettingsCreate(BaseModel):
    key: str
    value: Optional[str] = None
    description: Optional[str] = None
    is_public: bool = False

class SystemSettingsUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

# Admin Analytics Schemas
class UserStatistics(BaseModel):
    total_users: int
    active_users: int
    employers: int
    candidates: int
    admins: int
    verified_users: int
    new_users_today: int
    new_users_this_week: int
    new_users_this_month: int

class PlatformAnalytics(BaseModel):
    user_stats: UserStatistics
    # Future: job_stats, application_stats, etc.

# User Management Schemas
class UserListItem(BaseModel):
    id: int
    name: str
    email: str
    user_type: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    admin_role: Optional[str] = None
    department: Optional[str] = None