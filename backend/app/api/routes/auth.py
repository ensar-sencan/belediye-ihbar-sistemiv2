"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserCreate, User
from app.models.user import User as UserModel
from app.core.security import create_access_token
from uuid import UUID
from app.schemas.user import UserLogin

router = APIRouter()

@router.post("/test-login")
async def test_login(
    credentials: UserLogin,  # ✅ Pydantic schema
    db: Session = Depends(get_db)
):
    """
    Test login endpoint - returns JWT token for testing
    NO REAL AUTHENTICATION - ONLY FOR DEVELOPMENT
    """
    # Find user by email
    user = db.query(UserModel).filter(UserModel.email == credentials.email).first()
    
    if not user: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email [{credentials.email}] not found"
        )
    
    # Create access token
    access_token = create_access_token(data={"user_id": str(user. id)})
    
    return {
        "access_token":  access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user:  User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db:  Session = Depends(get_db)
):
    """
    Register a new user (placeholder - Firebase Auth will be added later)
    """
    # Check if user already exists
    existing_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if existing_user: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = UserModel(**user_in.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login")
async def login(email: str, password: str):
    """
    Login endpoint (placeholder - Firebase Auth will be added later)
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Use /test-login for development.  Firebase Auth coming soon."
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint (placeholder)
    """
    return {"message": "Logout successful"}