from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi. staticfiles import StaticFiles
import os
from pathlib import Path

from app.core.config import settings
from app. api.api import api_router
from app.core. database import engine, Base

# Import all models to register them
from app.db import base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create uploads directory if not exists
UPLOAD_DIR = Path("uploads/reports")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="🏛️ Belediye İhbar Sistemi API",
    description="""
    **Municipality Report System** - Modern belediye hizmetleri ihbar platformu
    
    ## 🚀 Özellikler
    
    ### 👤 Vatandaş
    * İhbar oluşturma (resim, konum, kategori)
    * İhbarlara oy verme ve yorum yapma
    * Kendi ihbarlarını takip etme
    
    ### 🏛️ Belediye Yöneticisi
    * Dashboard ve istatistikler
    * İhbar durumu güncelleme
    * Öncelik belirleme
    
    ### 👑 Süper Admin
    * Sistem yönetimi
    * Kullanıcı yönetimi
    * İhbarları belediyelere atama
    
    ## 🔐 Authentication
    
    API JWT token kullanır.  Test için:
    1. `/api/v1/auth/test-login` endpoint'ini kullan
    2. Dönen `access_token`'ı kopyala
    3. Sağ üstteki 🔓 **Authorize** butonuna tıkla
    4. Token'ı yapıştır (Bearer prefix otomatik eklenir)
    
    ## 📋 Test Kullanıcıları
    
    - `admin@test.com` - Süper Admin (tüm yetkiler)
    - `belediye@test.com` - Belediye Yöneticisi
    - `ahmet@test.com` - Normal Kullanıcı
    
    ## 🔗 Linkler
    
    * **Postman Collection:** [Download](./postman_collection.json)
    * **GitHub Repository:** [Link](#)
    * **ReDoc:** [/redoc](/redoc)
    """,
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@belediyeihbar.com",
    },
    license_info={
        "name": "MIT License",
        "url":  "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {
            "name": "auth",
            "description": "🔐 **Authentication** - Kullanıcı girişi ve token yönetimi"
        },
        {
            "name": "reports",
            "description": "📋 **Reports** - İhbar oluşturma, listeleme, güncelleme ve silme"
        },
        {
            "name": "users",
            "description": "👥 **Users** - Kullanıcı yönetimi (Admin)"
        },
        {
            "name": "municipalities",
            "description": "🏛️ **Municipalities** - Belediye yönetimi"
        },
        {
            "name":  "comments",
            "description":  "💬 **Comments** - İhbarlara yorum yapma"
        },
        {
            "name": "votes",
            "description": "👍 **Votes** - İhbarlara oy verme (upvote/downvote)"
        },
        {
            "name": "uploads",
            "description": "📤 **Uploads** - Resim yükleme ve statik dosyalar"
        },
        {
            "name": "admin",
            "description": "👑 **Admin Panel** - Dashboard, istatistikler ve yönetim (Admin/Municipality Admin)"
        }
    ]
)

# CORS Middleware - allow all origins for cross-origin Vercel → Render requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "🏛️ Belediye İhbar Sistemi API",
        "version": settings.APP_VERSION,
        "docs":  "/docs",
        "redoc":  "/redoc",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "uploads_dir": str(UPLOAD_DIR),
        "uploads_exists":  UPLOAD_DIR.exists()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )