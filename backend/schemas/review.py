from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    rating: int
    title: str
    comment: Optional[str] = None
    is_anonymous: bool = True

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    title: Optional[str] = None
    comment: Optional[str] = None
    is_anonymous: Optional[bool] = None

class Reviewer(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class ReviewResponse(ReviewBase):
    id: int
    candidate_id: int
    company_id: int
    created_at: datetime
    candidate: Optional[Reviewer] = None

    class Config:
        orm_mode = True
