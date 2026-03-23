"""
Vote routes for reports
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_user  # ← DOĞRU IMPORT!  ✅
from app.models.user import User
from app.models. vote import Vote
from app.models.report import Report
from app.schemas.vote import VoteCreate, Vote as VoteSchema, VoteStats

router = APIRouter()


@router.post("/reports/{report_id}/vote", response_model=VoteSchema, status_code=status.HTTP_201_CREATED)
def vote_on_report(
    report_id: UUID,
    vote_data: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vote on a report (upvote or downvote).
    If user already voted, update the vote.
    """
    # Check if report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check if user already voted
    existing_vote = db.query(Vote).filter(
        Vote.report_id == report_id,
        Vote.user_id == current_user.id
    ).first()
    
    if existing_vote:
        # Update existing vote
        old_vote_type = existing_vote.vote_type
        existing_vote.vote_type = vote_data.vote_type
        
        # Update report counts
        if old_vote_type != vote_data.vote_type:
            if old_vote_type == "upvote":
                report.upvotes = max(0, report.upvotes - 1)
                report.downvotes += 1
            else: 
                report.downvotes = max(0, report.downvotes - 1)
                report.upvotes += 1
        
        db.commit()
        db.refresh(existing_vote)
        return existing_vote
    
    # Create new vote
    new_vote = Vote(
        user_id=current_user.id,
        report_id=report_id,
        vote_type=vote_data.vote_type
    )
    
    # Update report counts
    if vote_data.vote_type == "upvote":
        report.upvotes += 1
    else:
        report.downvotes += 1
    
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)
    
    return new_vote


@router.delete("/reports/{report_id}/vote", status_code=status.HTTP_204_NO_CONTENT)
def remove_vote(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove your vote from a report"""
    # Check if report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Find user's vote
    vote = db.query(Vote).filter(
        Vote.report_id == report_id,
        Vote. user_id == current_user. id
    ).first()
    
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vote not found"
        )
    
    # Update report counts
    if vote.vote_type == "upvote": 
        report.upvotes = max(0, report.upvotes - 1)
    else:
        report.downvotes = max(0, report. downvotes - 1)
    
    db.delete(vote)
    db.commit()
    
    return None


@router.get("/reports/{report_id}/votes/stats", response_model=VoteStats)
def get_vote_stats(
    report_id:  UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get vote statistics for a report"""
    # Check if report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Get user's vote
    user_vote = db.query(Vote).filter(
        Vote.report_id == report_id,
        Vote.user_id == current_user.id
    ).first()
    
    return VoteStats(
        report_id=report_id,
        upvotes=report.upvotes,
        downvotes=report.downvotes,
        total=report.upvotes + report.downvotes,
        user_vote=user_vote. vote_type if user_vote else None
    )