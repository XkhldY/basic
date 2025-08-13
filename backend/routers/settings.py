from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.system_settings import SystemSettings
from models.user import User
from schemas.admin import SystemSettingsCreate, SystemSettingsUpdate, SystemSettingsResponse
from auth.admin_permissions import get_super_admin, get_current_admin
from typing import List, Optional
import json

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=List[SystemSettingsResponse])
async def get_system_settings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
    category: Optional[str] = None
):
    """Get system settings"""
    query = db.query(SystemSettings)
    
    if category:
        query = query.filter(SystemSettings.category == category)
    
    settings = query.order_by(SystemSettings.category, SystemSettings.key).all()
    return settings

@router.get("/public")
async def get_public_settings(db: Session = Depends(get_db)):
    """Get public system settings (no auth required)"""
    settings = db.query(SystemSettings).filter(SystemSettings.is_public == True).all()
    return {setting.key: setting.value for setting in settings}

@router.post("", response_model=SystemSettingsResponse)
async def create_setting(
    setting_data: SystemSettingsCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin)
):
    """Create a new system setting (super admin only)"""
    # Check if setting key already exists
    existing = db.query(SystemSettings).filter(SystemSettings.key == setting_data.key).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Setting with key '{setting_data.key}' already exists"
        )
    
    setting = SystemSettings(**setting_data.dict())
    db.add(setting)
    db.commit()
    db.refresh(setting)
    
    return setting

@router.put("/{setting_key}", response_model=SystemSettingsResponse)
async def update_setting(
    setting_key: str,
    setting_data: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin)
):
    """Update a system setting (super admin only)"""
    setting = db.query(SystemSettings).filter(SystemSettings.key == setting_key).first()
    if not setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Setting not found"
        )
    
    update_data = setting_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)
    
    db.commit()
    db.refresh(setting)
    
    return setting

@router.delete("/{setting_key}")
async def delete_setting(
    setting_key: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin)
):
    """Delete a system setting (super admin only)"""
    setting = db.query(SystemSettings).filter(SystemSettings.key == setting_key).first()
    if not setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Setting not found"
        )
    
    db.delete(setting)
    db.commit()
    
    return {"message": f"Setting '{setting_key}' deleted successfully"}

@router.post("/bulk")
async def bulk_update_settings(
    settings: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin)
):
    """Bulk update multiple settings"""
    updated_settings = []
    
    for key, value in settings.items():
        setting = db.query(SystemSettings).filter(SystemSettings.key == key).first()
        if setting:
            setting.value = str(value) if value is not None else None
            updated_settings.append(setting)
        else:
            # Create new setting if it doesn't exist
            new_setting = SystemSettings(
                key=key,
                value=str(value) if value is not None else None,
                category="general"
            )
            db.add(new_setting)
            updated_settings.append(new_setting)
    
    db.commit()
    
    return {"message": f"Updated {len(updated_settings)} settings", "updated_keys": list(settings.keys())}

# Initialize default settings
@router.post("/initialize")
async def initialize_default_settings(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_super_admin)
):
    """Initialize default system settings"""
    default_settings = [
        # Platform settings
        {"key": "platform.name", "value": "Job Platform", "category": "platform", "description": "Platform name"},
        {"key": "platform.description", "value": "A modern job platform connecting employers and candidates", "category": "platform", "description": "Platform description"},
        {"key": "platform.allow_registration", "value": "true", "category": "platform", "description": "Allow new user registration", "data_type": "boolean"},
        {"key": "platform.maintenance_mode", "value": "false", "category": "platform", "description": "Enable maintenance mode", "data_type": "boolean"},
        
        # Email settings
        {"key": "email.smtp_host", "value": "", "category": "email", "description": "SMTP server host"},
        {"key": "email.smtp_port", "value": "587", "category": "email", "description": "SMTP server port", "data_type": "integer"},
        {"key": "email.from_email", "value": "noreply@jobplatform.com", "category": "email", "description": "From email address"},
        {"key": "email.notifications_enabled", "value": "true", "category": "email", "description": "Enable email notifications", "data_type": "boolean"},
        
        # Security settings
        {"key": "security.password_min_length", "value": "8", "category": "security", "description": "Minimum password length", "data_type": "integer"},
        {"key": "security.require_email_verification", "value": "false", "category": "security", "description": "Require email verification", "data_type": "boolean"},
        {"key": "security.session_timeout", "value": "24", "category": "security", "description": "Session timeout in hours", "data_type": "integer"},
        
        # UI settings
        {"key": "ui.theme", "value": "light", "category": "ui", "description": "Default theme"},
        {"key": "ui.brand_color", "value": "#3B82F6", "category": "ui", "description": "Brand primary color"},
        {"key": "ui.logo_url", "value": "", "category": "ui", "description": "Platform logo URL"},
    ]
    
    created_count = 0
    for setting_data in default_settings:
        existing = db.query(SystemSettings).filter(SystemSettings.key == setting_data["key"]).first()
        if not existing:
            setting = SystemSettings(**setting_data)
            db.add(setting)
            created_count += 1
    
    db.commit()
    
    return {"message": f"Initialized {created_count} default settings"}