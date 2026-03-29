"""
Report endpoints - CRUD operations for reports
"""
from fastapi import APIRouter,Depends,HTTPException,status , File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import func

from app.models.municipality import Municipality

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.report import Report as ReportModel
from app.schemas.report import Report, ReportCreate, ReportUpdate, Report as ReportSchema

from typing import List
import os
import shutil
from pathlib import Path




router = APIRouter()


@router.get(
    "/",
    summary="📋 Tüm İhbarları Listele",
    response_model=List[ReportSchema],
    response_description="İhbarlar başarıyla listelendi"
)
def get_reports(
    skip:  int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    municipality_id: Optional[UUID] = None,
    search: Optional[str] = None,
    created_after: Optional[datetime] = None,
    created_before: Optional[datetime] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[float] = None,
    sort_by: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all reports with advanced filtering"""
    
    # Base query
    query = db.query(ReportModel)
    
    # FILTER: Category
    if category:
        query = query.filter(ReportModel.category == category)
    
    # FILTER: Status
    if status: 
        query = query.filter(ReportModel.status == status)
    
    # FILTER: Priority
    if priority: 
        query = query.filter(ReportModel.priority == priority)
    
    # FILTER:  Municipality
    if municipality_id: 
        query = query.filter(ReportModel.municipality_id == municipality_id)
    
    # FILTER: Search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (ReportModel.title. ilike(search_term)) |
            (ReportModel.description.ilike(search_term))
        )
    
    # FILTER: Date range
    if created_after:
        query = query.filter(ReportModel. created_at >= created_after)
    
    if created_before:
        query = query.filter(ReportModel.created_at <= created_before)
    
    # FILTER: Location-based (nearby)
    if latitude is not None and longitude is not None and radius is not None:
        lat_rad = func.radians(ReportModel.latitude)
        lon_rad = func.radians(ReportModel.longitude)
        user_lat_rad = func.radians(latitude)
        user_lon_rad = func. radians(longitude)
        
        distance = 6371 * func.acos(
            func.cos(user_lat_rad) * 
            func.cos(lat_rad) * 
            func.cos(lon_rad - user_lon_rad) + 
            func.sin(user_lat_rad) * 
            func.sin(lat_rad)
        )
        
        query = query.filter(distance <= radius)
    
    # SORTING
    if sort_by == "created_at":
        sort_column = ReportModel.created_at
    elif sort_by == "upvotes":
        sort_column = ReportModel. upvotes
    elif sort_by == "downvotes": 
        sort_column = ReportModel.downvotes
    elif sort_by == "updated_at": 
        sort_column = ReportModel.updated_at
    else:
        sort_column = ReportModel.created_at
    
    if order == "desc": 
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())
    
    # Pagination
    reports = query.offset(skip).limit(limit).all()
    
    return reports


@router.get(
    "/{report_id}",
    summary="🔍 İhbar Detayı Getir",
    description="ID'ye göre tek bir ihbarın detayını getirir",
    response_model=Report,
    response_description="İhbar detayı başarıyla getirildi"
)
async def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get single report by ID"""
    report = db.query(ReportModel).filter(ReportModel. id == report_id).first()
    
    if not report: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report


@router.post(
    "/",
    summary="➕ Yeni İhbar Oluştur",
    description="""
    Yeni ihbar oluşturur. 
    
    **Gerekli Alanlar:**
    - `title`: İhbar başlığı
    - `description`: Detaylı açıklama
    - `category`: Kategori (pothole, lighting, cleaning, park, water, road, other)
    
    **Opsiyonel:**
    - `latitude`: Enlem
    - `longitude`: Boylam
    - `address`: Adres
    - `priority`: Öncelik (low, medium, high, urgent)
    - `is_anonymous`: Anonim mi?  (varsayılan: false)
    
    **Varsayılan Değerler:**
    - `status`: pending
    - `priority`: medium (belirtilmezse)
    - `user_id`: Giriş yapan kullanıcı
    
    **Örnek:**
    ```json
    {
      "title": "Cadde ortasında büyük çukur",
      "description": "Atatürk Caddesi üzerinde tehlikeli çukur var",
      "category": "pothole",
      "latitude": 40.9889,
      "longitude": 29.0277,
      "address": "Atatürk Cad. No:45 Kadıköy/İstanbul"
    }
    ```
    """,
    response_model=Report,
    status_code=status.HTTP_201_CREATED,
    response_description="İhbar başarıyla oluşturuldu"
)
async def create_report(
    report_data: ReportCreate,  # ← İSİM DEĞİŞTİR!  
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new report"""
    try:
        # Municipality ID
        municipality_id = report_data.municipality_id  # ← report_data
        if not municipality_id: 
            first_muni = db. query(Municipality).first()
            if first_muni:
                municipality_id = first_muni.id
        
        # Create report
        new_report = ReportModel(  # ← ReportModel (Model, Schema değil!)
            id=uuid4(),
            user_id=current_user.id,
            municipality_id=municipality_id,
            title=report_data.title,
            description=report_data.description,
            category=report_data.category,
            status="pending",
            priority=report_data.priority or "medium",
            latitude=report_data. latitude,
            longitude=report_data.longitude,
            address=report_data.address,
            is_anonymous=report_data. is_anonymous,
            upvotes=0,
            downvotes=0,
            image_urls=[],
            created_at=datetime.utcnow()
        )
        
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        return new_report
        
    except Exception as e:
        db.rollback()
        print(f"ERROR creating report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{report_id}", response_model=ReportSchema)
async def update_report(
    report_id: UUID,
    report_in: ReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update report (owner or admin/staff)"""
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permissions
    is_admin = current_user.role == "ADMIN"
    is_staff = current_user.role == "MUNICIPALITY_STAFF"
    is_owner = report.user_id == current_user.id
    
    # Admin/Staff can update status and priority
    # Owner can only update title, description, etc.
    if not (is_admin or is_staff or is_owner):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this report"
        )
    
    # If not admin/staff, can't change status
    if report_in.status and not (is_admin or is_staff):
        raise HTTPException(
            status_code=status. HTTP_403_FORBIDDEN,
            detail="Only admin/staff can change report status"
        )
    
    # Update fields
    update_data = report_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(report, key, value)
    
    report.updated_at = datetime.utcnow()
    
    # If status changed to resolved
    if report_in.status == "resolved" and report.status != "resolved":
        report.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete report (owner or admin only)"""
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    
    if not report: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check ownership
    if report.user_id != current_user.id and current_user.role != 'ADMIN':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this report"
    )
    
    db.delete(report)
    db.commit()
    
    return None



@router.post("/{report_id}/vote", response_model=ReportSchema)
async def vote_report(
    report_id: UUID,
    vote_type: str,  # "upvote" or "downvote"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Vote on a report (upvote or downvote)"""
    
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Update votes
    if vote_type == "upvote":
        report. upvotes += 1
    elif vote_type == "downvote":
        report.downvotes += 1
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vote type.  Use 'upvote' or 'downvote'"
        )
    
    report.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return report

# Static files directory
UPLOAD_DIR = Path("uploads/reports")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/{report_id}/upload-images", response_model=ReportSchema)
async def upload_report_images(
    report_id: UUID,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload images for a report"""
    
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check ownership or admin
    if report.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status. HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    # Limit to 5 images
    if len(files) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 5 images allowed"
        )
    
    # Save files
    uploaded_urls = []
    for file in files:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {file.filename} is not an image"
            )
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{report_id}_{uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file. file, buffer)
        
        # Create URL
        file_url = f"/uploads/reports/{unique_filename}"
        uploaded_urls.append(file_url)
    
    # Update report - FIX:  Properly handle array
    current_urls = list(report.image_urls) if report.image_urls else []
    current_urls.extend(uploaded_urls)
    
    # Explicitly set the new value
    report.image_urls = current_urls
    report.updated_at = datetime.utcnow()
    
    # Force update
    db.add(report)
    db.commit()
    db.refresh(report)
    
    print(f"✅ Uploaded {len(uploaded_urls)} images to report {report_id}")
    print(f"✅ Total images: {len(report.image_urls)}")
    
    return report