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
    ProfileUpdateRequest,
    AdvancedCandidateProfileUpdate,
    AdvancedEmployerProfileUpdate,
    ProfileCompletionResponse
)
from auth.security import hash_password, verify_password, create_access_token, create_refresh_token
from auth.dependencies import get_current_active_user, get_current_user
from typing import List
import json

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
        portfolio_url=user_data.portfolio_url,
        profile_completion_percentage=0  # Will be calculated after creation
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Calculate initial profile completion
    db_user.profile_completion_percentage = calculate_candidate_profile_completion(db_user)
    db.commit()
    
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
        company_description=user_data.company_description,
        profile_completion_percentage=0  # Will be calculated after creation
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Calculate initial profile completion
    db_user.profile_completion_percentage = calculate_employer_profile_completion(db_user)
    db.commit()
    
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
        if value is not None:
            # Handle type conversions
            if field in ['current_salary', 'expected_salary', 'years_of_experience']:
                try:
                    if isinstance(value, str) and value.strip():
                        setattr(current_user, field, int(value))
                    elif isinstance(value, (int, float)):
                        setattr(current_user, field, int(value))
                    else:
                        setattr(current_user, field, None)
                except (ValueError, TypeError):
                    # If conversion fails, set to None
                    setattr(current_user, field, None)
            elif field == 'date_of_birth':
                if isinstance(value, str) and value.strip():
                    try:
                        from datetime import datetime
                        parsed_date = datetime.strptime(value, '%Y-%m-%d').date()
                        setattr(current_user, field, parsed_date)
                    except ValueError:
                        # If date parsing fails, set to None
                        setattr(current_user, field, None)
                else:
                    # Empty string or None, set to None
                    setattr(current_user, field, None)
            elif field in ['technical_skills', 'soft_skills', 'certifications', 'languages', 'desired_industries']:
                # Handle JSON array fields - accept both list and string formats
                if isinstance(value, str):
                    if value.strip() == '[]' or value.strip() == '':
                        setattr(current_user, field, [])
                    else:
                        try:
                            import json
                            parsed_value = json.loads(value)
                            if isinstance(parsed_value, list):
                                # Ensure all items are strings and not empty
                                clean_list = [str(item).strip() for item in parsed_value if str(item).strip()]
                                setattr(current_user, field, clean_list)
                            else:
                                setattr(current_user, field, [])
                        except (ValueError, TypeError):
                            # If JSON parsing fails, treat as comma-separated string
                            items = [item.strip() for item in value.split(',') if item.strip()]
                            setattr(current_user, field, items)
                elif isinstance(value, list):
                    # Already a list, clean and validate items
                    clean_list = [str(item).strip() for item in value if str(item).strip()]
                    setattr(current_user, field, clean_list)
                else:
                    # Fallback to empty list
                    setattr(current_user, field, [])
            else:
                # For other string fields, convert empty strings to None
                if isinstance(value, str) and not value.strip():
                    setattr(current_user, field, None)
                else:
                    setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.put("/profile/advanced/candidate", response_model=UserResponse)
async def update_advanced_candidate_profile(
    profile_data: AdvancedCandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update advanced candidate profile fields"""
    if current_user.user_type != ModelUserType.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only for candidates"
        )
    
    # Update user fields with proper type conversions
    update_data = profile_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            # Handle type conversions
            if field in ['current_salary', 'expected_salary', 'years_of_experience']:
                try:
                    if isinstance(value, str) and value.strip():
                        setattr(current_user, field, int(value))
                    elif isinstance(value, (int, float)):
                        setattr(current_user, field, int(value))
                    else:
                        setattr(current_user, field, None)
                except (ValueError, TypeError):
                    # If conversion fails, set to None
                    setattr(current_user, field, None)
            elif field == 'date_of_birth':
                if isinstance(value, str) and value.strip():
                    try:
                        from datetime import datetime
                        parsed_date = datetime.strptime(value, '%Y-%m-%d').date()
                        setattr(current_user, field, parsed_date)
                    except ValueError:
                        # If date parsing fails, set to None
                        setattr(current_user, field, None)
                else:
                    # Empty string or None, set to None
                    setattr(current_user, field, None)
            elif field in ['technical_skills', 'soft_skills', 'certifications', 'languages', 'desired_industries']:
                # Handle JSON array fields - accept both list and string formats
                if isinstance(value, str):
                    if value.strip() == '[]' or value.strip() == '':
                        setattr(current_user, field, [])
                    else:
                        try:
                            import json
                            parsed_value = json.loads(value)
                            if isinstance(parsed_value, list):
                                # Ensure all items are strings and not empty
                                clean_list = [str(item).strip() for item in parsed_value if str(item).strip()]
                                setattr(current_user, field, clean_list)
                            else:
                                setattr(current_user, field, [])
                        except (ValueError, TypeError):
                            # If JSON parsing fails, treat as comma-separated string
                            items = [item.strip() for item in value.split(',') if item.strip()]
                            setattr(current_user, field, items)
                elif isinstance(value, list):
                    # Already a list, clean and validate items
                    clean_list = [str(item).strip() for item in value if str(item).strip()]
                    setattr(current_user, field, clean_list)
                else:
                    # Fallback to empty list
                    setattr(current_user, field, [])
            else:
                # For other string fields, convert empty strings to None
                if isinstance(value, str) and not value.strip():
                    setattr(current_user, field, None)
                else:
                    setattr(current_user, field, value)
    
    # Update profile completion percentage
    current_user.profile_completion_percentage = calculate_candidate_profile_completion(current_user)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.put("/profile/advanced/employer", response_model=UserResponse)
async def update_advanced_employer_profile(
    profile_data: AdvancedEmployerProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update advanced employer profile fields"""
    if current_user.user_type != ModelUserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only for employers"
        )
    
    # Update user fields
    update_data = profile_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    # Update profile completion percentage
    current_user.profile_completion_percentage = calculate_employer_profile_completion(current_user)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/profile/completion", response_model=ProfileCompletionResponse)
async def get_profile_completion(current_user: User = Depends(get_current_user)):
    """Get profile completion percentage and missing fields"""
    if current_user.user_type == ModelUserType.CANDIDATE:
        completion_data = calculate_candidate_profile_completion(current_user, return_details=True)
    elif current_user.user_type == ModelUserType.EMPLOYER:
        completion_data = calculate_employer_profile_completion(current_user, return_details=True)
    else:
        completion_data = {"completion_percentage": 100, "missing_fields": [], "completed_sections": ["all"], "total_sections": 1}
    
    return ProfileCompletionResponse(**completion_data)

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

# Helper functions for profile completion calculation
def calculate_candidate_profile_completion(user: User, return_details: bool = False):
    """Calculate profile completion percentage for candidates"""
    required_fields = [
        'name', 'email', 'professional_title', 'experience_level', 'skills',
        'phone_number', 'location', 'education_level', 'years_of_experience',
        'technical_skills', 'soft_skills'
    ]
    
    optional_fields = [
        'portfolio_url', 'linkedin_url', 'github_url', 'current_salary',
        'expected_salary', 'preferred_work_type', 'willing_to_relocate',
        'notice_period', 'certifications', 'languages', 'desired_industries',
        'work_schedule_preference', 'remote_work_preference', 'travel_willingness'
    ]
    
    total_fields = len(required_fields) + len(optional_fields)
    completed_fields = 0
    missing_fields = []
    completed_sections = []
    
    # Check required fields (weight: 2x)
    for field in required_fields:
        value = getattr(user, field, None)
        if value and (isinstance(value, str) and value.strip() or 
                     isinstance(value, (list, dict)) and len(value) > 0 or
                     isinstance(value, (int, bool)) and value is not None):
            completed_fields += 2
        else:
            missing_fields.append(field)
    
    # Check optional fields (weight: 1x)
    for field in optional_fields:
        value = getattr(user, field, None)
        if value and (isinstance(value, str) and value.strip() or 
                     isinstance(value, (list, dict)) and len(value) > 0 or
                     isinstance(value, (int, bool)) and value is not None):
            completed_fields += 1
    
    # Calculate percentage
    max_score = len(required_fields) * 2 + len(optional_fields)
    percentage = min(100, int((completed_fields / max_score) * 100))
    
    # Determine completed sections
    if getattr(user, 'name') and getattr(user, 'email'):
        completed_sections.append("Basic Information")
    if getattr(user, 'professional_title') and getattr(user, 'experience_level'):
        completed_sections.append("Professional Details")
    if getattr(user, 'technical_skills') or getattr(user, 'skills'):
        completed_sections.append("Skills & Expertise")
    if getattr(user, 'location') and getattr(user, 'phone_number'):
        completed_sections.append("Contact Information")
    
    if return_details:
        return {
            "completion_percentage": percentage,
            "missing_fields": missing_fields,
            "completed_sections": completed_sections,
            "total_sections": 4
        }
    
    return percentage

def calculate_employer_profile_completion(user: User, return_details: bool = False):
    """Calculate profile completion percentage for employers"""
    required_fields = [
        'name', 'email', 'company_name', 'company_size', 'industry',
        'company_description', 'contact_person', 'company_address'
    ]
    
    optional_fields = [
        'company_website', 'company_logo_url', 'founded_year', 'company_type',
        'revenue_range', 'employee_count', 'contact_phone', 'company_city',
        'company_state', 'company_country', 'hiring_frequency', 'remote_policy',
        'benefits_offered'
    ]
    
    total_fields = len(required_fields) + len(optional_fields)
    completed_fields = 0
    missing_fields = []
    completed_sections = []
    
    # Check required fields (weight: 2x)
    for field in required_fields:
        value = getattr(user, field, None)
        if value and (isinstance(value, str) and value.strip() or 
                     isinstance(value, (list, dict)) and len(value) > 0 or
                     isinstance(value, (int, bool)) and value is not None):
            completed_fields += 2
        else:
            missing_fields.append(field)
    
    # Check optional fields (weight: 1x)
    for field in optional_fields:
        value = getattr(user, field, None)
        if value and (isinstance(value, str) and value.strip() or 
                     isinstance(value, (list, dict)) and len(value) > 0 or
                     isinstance(value, (int, bool)) and value is not None):
            completed_fields += 1
    
    # Calculate percentage
    max_score = len(required_fields) * 2 + len(optional_fields)
    percentage = min(100, int((completed_fields / max_score) * 100))
    
    # Determine completed sections
    if getattr(user, 'name') and getattr(user, 'email'):
        completed_sections.append("Basic Information")
    if getattr(user, 'company_name') and getattr(user, 'industry'):
        completed_sections.append("Company Details")
    if getattr(user, 'company_description'):
        completed_sections.append("Company Description")
    if getattr(user, 'contact_person') and getattr(user, 'company_address'):
        completed_sections.append("Contact Information")
    
    if return_details:
        return {
            "completion_percentage": percentage,
            "missing_fields": missing_fields,
            "completed_sections": completed_sections,
            "total_sections": 4
        }
    
    return percentage