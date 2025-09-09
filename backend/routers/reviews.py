from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.review import Review
from models.user import User, UserType
from schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from auth.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/api", tags=["reviews"])

@router.post("/companies/{company_id}/reviews", response_model=ReviewResponse)
async def create_review(
    company_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new review for a company."""
    if current_user.user_type != UserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can write reviews."
        )

    company = db.query(User).filter(User.id == company_id, User.user_type == UserType.EMPLOYER).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found."
        )

    # Optional: Check if the candidate has applied to the company before allowing a review
    # This logic can be added later.

    review = Review(
        **review_data.dict(),
        company_id=company_id,
        candidate_id=current_user.id
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.get("/companies/{company_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews_for_company(company_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific company."""
    reviews = db.query(Review).filter(Review.company_id == company_id).options(joinedload(Review.candidate)).all()

    # Anonymize candidate info if needed
    for review in reviews:
        if review.is_anonymous:
            review.candidate = None
        else:
            # Ensure we only expose limited info
            review.candidate = {
                "id": review.candidate.id,
                "name": review.candidate.name
            }

    return reviews

@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get a single review by its ID."""
    review = db.query(Review).filter(Review.id == review_id).options(joinedload(Review.candidate)).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found."
        )

    if review.is_anonymous:
        review.candidate = None
    else:
        review.candidate = {
            "id": review.candidate.id,
            "name": review.candidate.name
        }

    return review

@router.put("/reviews/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found."
        )

    if review.candidate_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own reviews."
        )

    update_data = review_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(review, field, value)

    db.commit()
    db.refresh(review)
    return review

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found."
        )

    if review.candidate_id != current_user.id and current_user.user_type != UserType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews."
        )

    db.delete(review)
    db.commit()
    return
