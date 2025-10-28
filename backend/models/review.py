from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign Keys
    company_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Review content
    rating = Column(Integer, nullable=False) # e.g., 1-5 stars
    title = Column(String(150), nullable=False)
    comment = Column(Text, nullable=True)

    # Anonymity
    is_anonymous = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    company = relationship("User", foreign_keys=[company_id], back_populates="reviews_received")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="reviews_written")
