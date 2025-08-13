from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, UserType as ModelUserType
from schemas.user import (
    CandidateRegistrationRequest, 
    EmployerRegistrationRequest,
    AdminRegistrationRequest,
    LoginRequest, 
    TokenResponse,
    UserResponse,
    ProfileUpdateRequest
)
from auth.security import hash_password, verify_password, create_access_token, create_refresh_token
from auth.dependencies import get_current_active_user, get_current_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register/candidate", response_model=dict)
async def register_candidate(
    user_data: CandidateRegistrationRequest,
    db: Session = Depends(get_db)
):
    """Register a new candidate"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new candidate user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=ModelUserType.CANDIDATE,
        professional_title=user_data.professional_title,
        experience_level=user_data.experience_level,
        skills=user_data.skills,
        portfolio_url=user_data.portfolio_url
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Candidate registered successfully", "user_id": db_user.id}

@router.post("/register/employer", response_model=dict)
async def register_employer(
    user_data: EmployerRegistrationRequest,
    db: Session = Depends(get_db)
):
    """Register a new employer"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new employer user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=ModelUserType.EMPLOYER,
        company_name=user_data.company_name,
        company_size=user_data.company_size,
        industry=user_data.industry,
        company_description=user_data.company_description
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Employer registered successfully", "user_id": db_user.id}

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user and return JWT tokens"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800  # 30 minutes
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return current_user

@router.post("/register/admin", response_model=dict)
async def register_admin(
    user_data: AdminRegistrationRequest,
    db: Session = Depends(get_db)
):
    """Register a new admin (typically restricted in production)"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=ModelUserType.ADMIN,
        admin_role=user_data.admin_role,
        department=user_data.department
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Admin registered successfully", "user_id": db_user.id}

@router.post("/logout")
async def logout():
    """Logout user (token blacklisting would be implemented here in production)"""
    return {"message": "Successfully logged out"}

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user profile"""
    # Update user fields
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user