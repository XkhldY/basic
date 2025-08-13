from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserType
from models.audit_log import AuditLog
from auth.dependencies import get_current_user
from schemas.admin import AuditLogCreate
from typing import List
import json

# Admin role permissions
ROLE_PERMISSIONS = {
    "super_admin": [
        "user.read", "user.write", "user.delete",
        "admin.read", "admin.write", "admin.delete", 
        "analytics.read", "system.write", "audit.read"
    ],
    "user_manager": [
        "user.read", "user.write", "analytics.read"
    ],
    "content_moderator": [
        "user.read", "content.read", "content.write", "content.delete"
    ],
    "analyst": [
        "user.read", "analytics.read", "audit.read"
    ]
}

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Get current user and verify they are an admin"""
    if current_user.user_type != UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_permission(permission: str):
    """Decorator to require specific permission for admin endpoints"""
    def permission_checker(current_admin: User = Depends(get_current_admin)):
        if not has_permission(current_admin, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        return current_admin
    return permission_checker

def has_permission(admin: User, permission: str) -> bool:
    """Check if admin has specific permission"""
    if not admin.admin_role:
        return False
    
    role_perms = ROLE_PERMISSIONS.get(admin.admin_role, [])
    return permission in role_perms

def log_admin_action(
    db: Session,
    admin_id: int,
    action: str,
    target_type: str,
    target_id: int = None,
    details: dict = None,
    ip_address: str = None,
    user_agent: str = None
):
    """Log admin action for audit trail"""
    audit_log = AuditLog(
        admin_id=admin_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=json.dumps(details) if details else None,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(audit_log)
    db.commit()

def get_admin_with_user_write_permission(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_permission("user.write"))
) -> User:
    """Dependency to get admin with user write permission"""
    return current_admin

def get_admin_with_analytics_permission(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_permission("analytics.read"))
) -> User:
    """Dependency to get admin with analytics read permission"""
    return current_admin

def get_super_admin(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
) -> User:
    """Dependency to get super admin only"""
    if current_admin.admin_role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_admin