"""
Image upload routes for reports
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os
import shutil
from pathlib import Path
import uuid

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app. models.report import Report as ReportModel

router = APIRouter()

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_IMAGES_PER_REPORT = 5


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image"""
    # Check file extension
    file_ext = os.path.splitext(file. filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )


@router.post("/reports/{report_id}/images", status_code=status.HTTP_201_CREATED)
async def upload_report_images(
    report_id: UUID,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload images to a report
    
    - Max 5 images per report
    - Allowed formats: JPG, JPEG, PNG, GIF, WEBP
    - Max file size: 5MB
    """
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check ownership
    if report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload images to this report"
        )
    
    # Check current image count
    current_images = report.image_urls if report.image_urls else []
    if len(current_images) + len(files) > MAX_IMAGES_PER_REPORT: 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {MAX_IMAGES_PER_REPORT} images per report.  Currently: {len(current_images)}"
        )
    
    uploaded_files = []
    
    try:
        for file in files: 
            # Validate
            validate_image(file)
            
            # Generate unique filename
            file_ext = os.path.splitext(file.filename)[1].lower()
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file. file, buffer)
            
            # Add to list
            uploaded_files.append(unique_filename)
        
        # Update report image_urls
        updated_images = current_images + uploaded_files
        report.image_urls = updated_images
        db.commit()
        db.refresh(report)
        
        return {
            "message": f"Successfully uploaded {len(uploaded_files)} image(s)",
            "uploaded_files": uploaded_files,
            "total_images": len(updated_images)
        }
    
    except Exception as e: 
        # Cleanup uploaded files on error
        for filename in uploaded_files:
            file_path = UPLOAD_DIR / filename
            if file_path. exists():
                file_path. unlink()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload images: {str(e)}"
        )


@router.delete("/reports/{report_id}/images/{image_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report_image(
    report_id: UUID,
    image_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an image from a report"""
    # Get report
    report = db. query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status. HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check ownership
    if report. user_id != current_user. id:
        raise HTTPException(
            status_code=status. HTTP_403_FORBIDDEN,
            detail="Not authorized to delete images from this report"
        )
    
    # Check if image exists in report
    if image_name not in report.image_urls:
        raise HTTPException(
            status_code=status. HTTP_404_NOT_FOUND,
            detail="Image not found in this report"
        )
    
    # Delete file from filesystem
    file_path = UPLOAD_DIR / image_name
    if file_path.exists():
        file_path.unlink()
    
    # Update report image_urls
    updated_images = [img for img in report.image_urls if img != image_name]
    report.image_urls = updated_images
    db.commit()
    
    return None