"""
Main API router - combines all route modules
"""
from fastapi import APIRouter
from app.api.routes import auth, municipalities, reports, users
from app.api.routes import votes, comments , uploads , admin

api_router = APIRouter()

# Include all routers
api_router. include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(municipalities.router, prefix="/municipalities", tags=["municipalities"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(votes.router, prefix="/votes", tags=["votes"])
api_router.include_router(comments.router, tags=["comments"])
api_router.include_router(uploads.router, prefix="", tags=["uploads"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
