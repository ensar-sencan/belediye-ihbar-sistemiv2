"""
Dependencies for API endpoints
"""
from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi. security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from uuid import UUID

from app.core.database import SessionLocal
from app.core.config import settings
from app.models. user import User


# HTTP Bearer token scheme
security = HTTPBearer()


def get_db() -> Generator:
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,  # ✅ JWT_SECRET_KEY kullan! 
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id_str:  str = payload.get("user_id")
        if user_id_str is None:
            raise credentials_exception
            
    except JWTError as e:
        print(f"❌ JWT Error: {e}")  # Debug
        raise credentials_exception
    
    # Get user from database
    try:
        user_id = UUID(user_id_str)
        user = db.query(User).filter(User.id == user_id).first()
    except ValueError:
        raise credentials_exception
    
    if user is None:
        raise credentials_exception
    
    if not user. is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user. is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_current_admin(
    current_user:  User = Depends(get_current_user)
) -> User:
    """Get current admin user (ADMIN or MUNICIPALITY_ADMIN)"""
    if current_user.role not in ["ADMIN", "MUNICIPALITY_ADMIN"]: 
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify current user is ADMIN (super admin)"""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_current_super_admin(
    current_user:  User = Depends(get_current_user)
) -> User:
    """Get current super admin user (only ADMIN role)"""
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin privileges required"
        )
    return current_user


async def get_current_municipality_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current municipality admin"""
    if current_user.role != "MUNICIPALITY_ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Municipality admin privileges required"
        )
    
    if not current_user.municipality_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not assigned to any municipality"
        )
    
    return current_user