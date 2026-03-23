"""
Comment routes for reports
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app. core.database import get_db
from app.api.deps import get_current_user  # ← DOĞRU IMPORT! ✅
from app.models. user import User
from app.models.comment import Comment
from app. models.report import Report
from app.schemas.comment import CommentCreate, CommentUpdate, Comment as CommentSchema

router = APIRouter()


@router.post("/reports/{report_id}/comments", response_model=CommentSchema, status_code=status.HTTP_201_CREATED)
def create_comment(
    report_id: UUID,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new comment on a report"""
    # Check if report exists
    report = db. query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Create comment
    new_comment = Comment(
        report_id=report_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return new_comment


@router.get("/reports/{report_id}/comments", response_model=List[CommentSchema])
def get_comments(
    report_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all comments for a report"""
    # Check if report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Get comments
    comments = db.query(Comment).filter(
        Comment.report_id == report_id
    ).offset(skip).limit(limit).all()
    
    return comments


@router.patch("/comments/{comment_id}", response_model=CommentSchema)
def update_comment(
    comment_id: UUID,
    comment_data: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update your own comment"""
    # Find comment
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check ownership
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    # Update comment
    comment.content = comment_data.content
    
    db.commit()
    db.refresh(comment)
    
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete your own comment"""
    # Find comment
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check ownership
    if comment.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status. HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    db.delete(comment)
    db.commit()
    
    return None