"""
Admin panel endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from uuid import UUID

from app.core.database import get_db
from app. api.deps import get_current_admin, get_current_super_admin
from app.models. user import User
from app.models. report import Report as ReportModel
from app.models.municipality import Municipality
from app.models. comment import Comment
from app.models.vote import Vote
from app. models.enums import ReportStatus, ReportPriority, ReportCategory, UserRole

from app.schemas.user import User as UserSchema
from typing import List

from app.api.deps import get_current_user, get_current_admin_user

router = APIRouter()


@router.get(
    "/dashboard/stats",
    summary="📊 Dashboard İstatistikleri",
    description="""
    Admin panel için özet istatistikleri getirir.
    
    **Admin:** Tüm sistem istatistikleri
    **Municipality Admin:** Sadece kendi belediyesinin istatistikleri
    
    ### Dönen Veriler:  
    - Toplam ihbar sayısı
    - Bugünkü ihbarlar
    - Durum dağılımı (pending, in_progress, resolved, rejected)
    - Kategori dağılımı
    - Öncelik dağılımı
    - Ortalama çözüm süresi (saat)
    - Kullanıcı ve belediye sayıları (sadece super admin)
    
    ### Roller:
    - **ADMIN**:  Tüm istatistikleri görür
    - **MUNICIPALITY_ADMIN**: Sadece kendi belediyesinin istatistiklerini görür
    """,
    response_description="Dashboard istatistikleri başarıyla getirildi"
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
) -> Dict[str, Any]: 
    """
    Get dashboard statistics
    
    - Total reports
    - Reports by status
    - Reports by category
    - Total users
    - Total municipalities
    - Recent activity
    """
    
    # Base query - filter by municipality if municipality_admin
    base_query = db. query(ReportModel)
    if current_user.role == "MUNICIPALITY_ADMIN":
        base_query = base_query. filter(ReportModel.municipality_id == current_user.municipality_id)
    
    # Total reports
    total_reports = base_query.count()
    
    # Reports by status
    status_counts = {
        "pending": base_query.filter(ReportModel.status == "pending").count(),
        "in_progress": base_query.filter(ReportModel.status == "in_progress").count(),
        "resolved": base_query.filter(ReportModel.status == "resolved").count(),
        "rejected": base_query.filter(ReportModel.status == "rejected").count()
    }
    
    # Reports by category
    category_counts = {
        "pothole": base_query.filter(ReportModel. category == "pothole").count(),
        "lighting": base_query.filter(ReportModel.category == "lighting").count(),
        "cleaning": base_query.filter(ReportModel.category == "cleaning").count(),
        "park": base_query.filter(ReportModel.category == "park").count(),
        "water": base_query.filter(ReportModel.category == "water").count(),
        "road": base_query.filter(ReportModel.category == "road").count(),
        "other": base_query.filter(ReportModel.category == "other").count()
    }
    
    # Reports by priority
    priority_counts = {
        "low": base_query.filter(ReportModel. priority == "low").count(),
        "medium": base_query. filter(ReportModel.priority == "medium").count(),
        "high": base_query.filter(ReportModel.priority == "high").count(),
        "urgent": base_query.filter(ReportModel.priority == "urgent").count()
    }
    
    # Total users (only super admin can see)
    total_users = None
    if current_user.role == "ADMIN":
        total_users = db.query(User).count()
    
    # Total municipalities (only super admin can see)
    total_municipalities = None
    if current_user.role == "ADMIN":
        total_municipalities = db.query(Municipality).count()
    
    # Last 7 days trend
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_reports = base_query.filter(ReportModel.created_at >= seven_days_ago).count()
    
    # Today's reports
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_reports = base_query.filter(ReportModel.created_at >= today_start).count()
    
    # Average resolution time (resolved reports)
    resolved_reports = base_query.filter(
    ReportModel.status == "resolved",
    ReportModel. resolved_at.isnot(None)
).all()
    
    avg_resolution_hours = None
    if resolved_reports: 
        total_hours = sum([
            (r.resolved_at - r.created_at).total_seconds() / 3600 
            for r in resolved_reports if r.resolved_at
        ])
        avg_resolution_hours = round(total_hours / len(resolved_reports), 2)
    
    return {
        "total_reports":  total_reports,
        "today_reports": today_reports,
        "recent_reports_7days": recent_reports,
        "status_distribution": status_counts,
        "category_distribution": category_counts,
        "priority_distribution": priority_counts,
        "total_users": total_users,
        "total_municipalities": total_municipalities,
        "avg_resolution_hours": avg_resolution_hours,
        "user_role": current_user.role,
        "municipality_id": str(current_user.municipality_id) if current_user.municipality_id else None
    }


@router.get(
    "/dashboard/trends",
    summary="📈 İhbar Trendleri",
    description="""
    Belirtilen gün sayısı için günlük ihbar trendlerini getirir.
    
    **Parametreler:**
    - `days`: Kaç günlük trend (varsayılan: 30)
    
    **Kullanım:**
    - 7 günlük trend için: `?days=7`
    - 30 günlük trend için:  `?days=30`
    
    Her gün için oluşturulan ihbar sayısını döndürür.
    """
)
def get_dashboard_trends(
    days: int = 30,
    db:  Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
) -> List[Dict[str, Any]]:
    """
    Get daily report trends for the last N days
    """
    
    base_query = db.query(ReportModel)
    if current_user.role == "MUNICIPALITY_ADMIN":
        base_query = base_query.filter(ReportModel.municipality_id == current_user.municipality_id)
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get reports grouped by date
    trends = []
    for i in range(days):
        day_start = start_date + timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        
        count = base_query.filter(
            ReportModel.created_at >= day_start,
            ReportModel.created_at < day_end
        ).count()
        
        trends.append({
            "date": day_start. strftime("%Y-%m-%d"),
            "count": count
        })
    
    return trends


@router.get(
    "/dashboard/top-categories",
    summary="🏆 En Çok İhbar Alan Kategoriler",
    description="""
    En çok ihbar alan kategorileri listeler.
    
    **Parametreler:**
    - `limit`: Kaç kategori gösterilecek (varsayılan: 5)
    
    Kategoriler ihbar sayısına göre azalan sırada sıralanır.
    """
)
def get_top_categories(
    limit: int = 5,
    db:  Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
) -> List[Dict[str, Any]]:
    """Get top N categories by report count"""
    
    base_query = db.query(ReportModel)
    if current_user.role == "MUNICIPALITY_ADMIN":
        base_query = base_query.filter(ReportModel.municipality_id == current_user.municipality_id)
    
    # Group by category
    results = db.query(
        ReportModel.category,
        func.count(ReportModel.id).label("count")
    ).group_by(ReportModel.category).order_by(func.count(ReportModel.id).desc()).limit(limit).all()
    
    return [
        {
            "category": category,
            "count": count
        }
        for category, count in results
    ]


@router.patch(
    "/reports/{report_id}/status",
    summary="✏️ İhbar Durumu Güncelle",
    description="""
    İhbar durumunu günceller.
    
    **İzin Verilen Durumlar:**
    - `pending`: Beklemede
    - `in_progress`: İşlemde
    - `resolved`: Çözüldü
    - `rejected`: Reddedildi
    
    **Kurallar:**
    - Municipality Admin sadece kendi belediyesinin ihbarlarını güncelleyebilir
    - Super Admin tüm ihbarları güncelleyebilir
    - Durum `resolved` olduğunda `resolved_at` otomatik set edilir
    
    **Örnek:**
    ```json
    PATCH /api/v1/admin/reports/{id}/status? status=in_progress
    ```
    """,
    response_description="İhbar durumu başarıyla güncellendi"
)
def update_report_status(
    report_id: UUID,
    status: ReportStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Update report status
    
    Allowed statuses: pending, in_progress, resolved, rejected
    """
    
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permission (municipality admin can only update their own municipality's reports)
    if current_user.role == "MUNICIPALITY_ADMIN": 
        if report.municipality_id != current_user.municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this report"
            )
    
    # Update status
    report.status = status. value
    report.updated_at = datetime.utcnow()
    
    # Set resolved_at if status is resolved
    if status. value == "resolved":
        report.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return {
        "message": "Report status updated successfully",
        "report_id": str(report. id),
        "new_status": status.value
    }


@router.patch(
    "/reports/{report_id}/priority",
    summary="⚠️ İhbar Önceliği Güncelle",
    description="""
    İhbar önceliğini günceller. 
    
    **İzin Verilen Öncelikler:**
    - `low`: Düşük
    - `medium`: Orta
    - `high`: Yüksek
    - `urgent`: Acil
    
    **Kurallar:**
    - Municipality Admin sadece kendi belediyesinin ihbarlarını güncelleyebilir
    - Super Admin tüm ihbarları güncelleyebilir
    
    **Örnek:**
    ```json
    PATCH /api/v1/admin/reports/{id}/priority?priority=high
    ```
    """
)
def update_report_priority(
    report_id:  UUID,
    priority: ReportPriority,
    db:  Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Update report priority
    
    Allowed priorities: low, medium, high, urgent
    """
    
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permission
    if current_user.role == "MUNICIPALITY_ADMIN": 
        if report.municipality_id != current_user.municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this report"
            )
    
    # Update priority
    report.priority = priority.value
    report.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return {
        "message": "Report priority updated successfully",
        "report_id": str(report.id),
        "new_priority": priority.value
    }


@router.patch(
    "/reports/{report_id}/assign-municipality",
    summary="🏛️ İhbarı Belediyeye Ata",
    description="""
    İhbarı belirtilen belediyeye atar.
    
    **Sadece Super Admin kullanabilir! **
    
    İhbar atandığında:  
    - İhbarın `municipality_id` field'ı güncellenir
    - İlgili belediye yöneticileri ihbarı görebilir
    - Belediye dashboard'unda görünür
    
    **Örnek:**
    ```json
    PATCH /api/v1/admin/reports/{report_id}/assign-municipality
    Body:  {"municipality_id": "uuid-here"}
    ```
    """,
    response_description="İhbar belediyeye başarıyla atandı"
)
def assign_report_to_municipality(
    report_id: UUID,
    municipality_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin)
):
    """
    Assign report to a municipality (Super admin only)
    """
    
    # Get report
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check municipality exists
    municipality = db.query(Municipality).filter(Municipality.id == municipality_id).first()
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Assign
    report.municipality_id = municipality_id
    report.updated_at = datetime.utcnow()

    
    
    db.commit()
    db.refresh(report)
    
    return {
        "message": "Report assigned to municipality successfully",
        "report_id": str(report.id),
        "municipality_id": str(municipality_id),
        "municipality_name": municipality.name
    }


@router.get(
    "/users/",
    summary="👥 Tüm Kullanıcıları Listele (Admin)",
    description="Sistemdeki tüm kullanıcıları listeler (Admin yetkisi gerekir)",
    response_model=List[UserSchema]  # ← UserResponse yerine UserSchema
)
async def get_all_users(
    skip:  int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all users (admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users