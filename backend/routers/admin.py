from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database import get_db
from models.user import User, UserType
from models.audit_log import AuditLog
from models.system_settings import SystemSettings
from schemas.admin import (
    UserStatistics, PlatformAnalytics, UserListItem, UserUpdateRequest,
    AuditLogResponse, SystemSettingsResponse, SystemSettingsCreate, SystemSettingsUpdate
)
from schemas.user import UserResponse
from auth.admin_permissions import (
    get_current_admin, get_admin_with_user_write_permission, 
    get_admin_with_analytics_permission, get_super_admin, log_admin_action
)
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/admin", tags=["admin"])

# User Management Endpoints
@router.get("/users", response_model=List[UserListItem])
async def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_type: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get all users with filtering and pagination"""
    query = db.query(User)
    
    # Apply filters
    if user_type:
        query = query.filter(User.user_type == user_type)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    if search:
        query = query.filter(
            (User.name.ilike(f"%{search}%")) | 
            (User.email.ilike(f"%{search}%"))
        )
    
    # Order by creation date (newest first)
    query = query.order_by(desc(User.created_at))
    
    # Apply pagination
    users = query.offset(skip).limit(limit).all()
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_id=current_admin.id,
        action="users_list_accessed",
        target_type="user",
        details={"filters": {"user_type": user_type, "is_active": is_active, "search": search}}
    )
    
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get detailed information about a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_id=current_admin.id,
        action="user_details_accessed",
        target_type="user",
        target_id=user_id
    )
    
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_with_user_write_permission)
):
    """Update user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Store original values for audit log
    original_values = {
        "name": user.name,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "admin_role": user.admin_role,
        "department": user.department
    }
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_id=current_admin.id,
        action="user_updated",
        target_type="user",
        target_id=user_id,
        details={"original": original_values, "updated": update_data}
    )
    
    return user

@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_with_user_write_permission)
):
    """Toggle user active status"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow deactivating other admins unless super admin
    if user.user_type == UserType.ADMIN and current_admin.admin_role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admin can modify other admin accounts"
        )
    
    original_status = user.is_active
    user.is_active = not user.is_active
    db.commit()
    
    # Log admin action
    action = "user_activated" if user.is_active else "user_deactivated"
    log_admin_action(
        db=db,
        admin_id=current_admin.id,
        action=action,
        target_type="user",
        target_id=user_id,
        details={"previous_status": original_status, "new_status": user.is_active}
    )
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'} successfully"}

# Analytics Endpoints
@router.get("/analytics", response_model=PlatformAnalytics)
async def get_platform_analytics(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_with_analytics_permission)
):
    """Get platform analytics and statistics"""
    now = datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=7)
    month_start = today_start - timedelta(days=30)
    
    # Get user statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    employers = db.query(User).filter(User.user_type == UserType.EMPLOYER).count()
    candidates = db.query(User).filter(User.user_type == UserType.CANDIDATE).count()
    admins = db.query(User).filter(User.user_type == UserType.ADMIN).count()
    verified_users = db.query(User).filter(User.is_verified == True).count()
    
    new_users_today = db.query(User).filter(User.created_at >= today_start).count()
    new_users_this_week = db.query(User).filter(User.created_at >= week_start).count()
    new_users_this_month = db.query(User).filter(User.created_at >= month_start).count()
    
    user_stats = UserStatistics(
        total_users=total_users,
        active_users=active_users,
        employers=employers,
        candidates=candidates,
        admins=admins,
        verified_users=verified_users,
        new_users_today=new_users_today,
        new_users_this_week=new_users_this_week,
        new_users_this_month=new_users_this_month
    )
    
    # Log admin action
    log_admin_action(
        db=db,
        admin_id=current_admin.id,
        action="analytics_accessed",
        target_type="analytics"
    )
    
    return PlatformAnalytics(user_stats=user_stats)

# Audit Log Endpoints
@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    action: Optional[str] = Query(None),
    target_type: Optional[str] = Query(None)
):
    """Get audit logs (super admin only)"""
    query = db.query(AuditLog)
    
    # Apply filters
    if action:
        query = query.filter(AuditLog.action == action)
    if target_type:
        query = query.filter(AuditLog.target_type == target_type)
    
    # Order by creation date (newest first)
    query = query.order_by(desc(AuditLog.created_at))
    
    # Apply pagination
    logs = query.offset(skip).limit(limit).all()
    
    return logs