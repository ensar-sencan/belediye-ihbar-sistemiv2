"""
User endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import get_db, get_current_user
from app.schemas.user import User, UserUpdate
from app.models.user import User as UserModel
from app.models.report import Report as ReportModel  # ← EKLE

router = APIRouter()


@router.get("/me", response_model=User)
async def get_current_user_profile(
    current_user: UserModel = Depends(get_current_user)
):
    """
    Get current authenticated user's profile
    """
    return current_user


@router.get("/me/reports")  # ← YENİ! 
async def get_my_reports(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's reports"""
    reports = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id
    ).order_by(ReportModel.created_at.desc()).all()
    
    return reports


@router.get("/me/stats")  # ← YENİ!
async def get_my_stats(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's statistics"""
    
    # Total reports
    total = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id
    ).count()
    
    # By status
    pending = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id,
        ReportModel.status == "pending"
    ).count()
    
    in_progress = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id,
        ReportModel.status == "in_progress"
    ).count()
    
    resolved = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id,
        ReportModel.status == "resolved"
    ).count()
    
    rejected = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id,
        ReportModel.status == "rejected"
    ).count()
    
    # Total votes
    reports = db.query(ReportModel).filter(
        ReportModel.user_id == current_user.id
    ).all()
    
    total_upvotes = sum(r.upvotes for r in reports)
    total_downvotes = sum(r.downvotes for r in reports)
    
    return {
        "total_reports": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "rejected": rejected,
        "total_upvotes": total_upvotes,
        "total_downvotes": total_downvotes
    }


@router.patch("/me", response_model=User)
async def update_current_user(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Update current user's profile
    """
    # Update fields
    for key, value in user_in.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id:  UUID,
    db: Session = Depends(get_db)
):
    """
    Get user by ID (public profile)
    """
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user