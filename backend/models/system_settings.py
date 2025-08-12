from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)  # JSON string or plain text
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="general")  # general, security, email, ui, platform
    is_public = Column(Boolean, default=False)  # Whether setting is visible to non-admins
    data_type = Column(String(20), default="string")  # string, boolean, integer, json
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())