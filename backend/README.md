# 🏛️ Belediye İhbar Sistemi API

**Municipality Report System** - Backend API

Vatandaşların belediye hizmetleriyle ilgili sorunları bildirmelerini sağlayan, belediye yöneticilerinin bu ihbarları takip edip çözebilmelerini sağlayan modern bir web uygulaması.

---

## 🚀 Özellikler

### 👤 Kullanıcı Özellikleri
- ✅ Firebase Authentication entegrasyonu
- ✅ İhbar oluşturma (başlık, açıklama, kategori, konum, resim)
- ✅ İhbar listeleme ve detay görüntüleme
- ✅ İhbarlara oy verme (upvote/downvote)
- ✅ İhbarlara yorum yapma
- ✅ Kendi ihbarlarını düzenleme/silme

### 🏛️ Belediye Yöneticisi Özellikleri
- ✅ Dashboard (istatistikler, trendler, kategori dağılımı)
- ✅ Atanan ihbarları görüntüleme
- ✅ İhbar durumu güncelleme (pending → in_progress → resolved)
- ✅ Öncelik belirleme (low, medium, high, urgent)
- ✅ İhbarlara cevap yazma

### 👑 Süper Admin Özellikleri
- ✅ Sistem geneli istatistikler
- ✅ Kullanıcı yönetimi (aktif/pasif, rol değiştirme)
- ✅ Belediye yönetimi
- ✅ İhbarları belediyelere atama
- ✅ Tüm ihbarları görüntüleme

### 🔧 Teknik Özellikler
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Role-based Access Control (ADMIN, MUNICIPALITY_ADMIN, CITIZEN)
- ✅ Image upload & storage
- ✅ PostgreSQL database
- ✅ Docker deployment
- ✅ Swagger documentation
- ✅ Postman collection

---

## 🛠️ Teknolojiler

- **Backend:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL 17
- **ORM:** SQLAlchemy
- **Authentication:** JWT + Firebase
- **Image Processing:** Pillow
- **Container:** Docker & Docker Compose
- **API Documentation:** Swagger UI / ReDoc

---

## 📋 Gereksinimler

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 17 (Docker ile otomatik kurulur)

---

## 🚀 Kurulum

### 1️⃣ Repoyu Klonla

\`\`\`bash
git clone <repo-url>
cd belediye-ihbar-sistemi/backend
\`\`\`

### 2️⃣ Environment Variables

\`\`\`.env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/belediye_ihbar

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Firebase (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
\`\`\`

### 3️⃣ Docker ile Çalıştır

\`\`\`bash
# Container'ları başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Test verisi ekle
docker-compose exec backend python seed_data.py
\`\`\`

### 4️⃣ API'ye Eriş

- **Swagger UI:** http://127.0.0.1:8001/docs
- **ReDoc:** http://127.0.0.1:8001/redoc
- **OpenAPI JSON:** http://127.0.0.1:8001/openapi.json

---

## 📊 API Endpoints

### 🔐 Authentication
\`\`\`
POST   /api/v1/auth/test-login           Test kullanıcı girişi (Development)
GET    /api/v1/auth/me                   Mevcut kullanıcı bilgisi
\`\`\`

### 📋 Reports (İhbarlar)
\`\`\`
GET    /api/v1/reports/                  Tüm ihbarları listele
POST   /api/v1/reports/                  Yeni ihbar oluştur
GET    /api/v1/reports/{id}              İhbar detayı
PATCH  /api/v1/reports/{id}              İhbar güncelle
DELETE /api/v1/reports/{id}              İhbar sil
POST   /api/v1/reports/{id}/images       İhbara resim ekle
\`\`\`

### 👥 Users (Kullanıcılar)
\`\`\`
GET    /api/v1/users/                    Kullanıcıları listele (Admin)
GET    /api/v1/users/{id}                Kullanıcı detayı (Admin)
DELETE /api/v1/users/{id}                Kullanıcı sil (Admin)
\`\`\`

### 🏛️ Municipalities (Belediyeler)
\`\`\`
GET    /api/v1/municipalities/           Tüm belediyeleri listele
GET    /api/v1/municipalities/{id}       Belediye detayı
\`\`\`

### 💬 Comments (Yorumlar)
\`\`\`
POST   /api/v1/comments/                 Yorum ekle
GET    /api/v1/comments/report/{id}      İhbara ait yorumlar
DELETE /api/v1/comments/{id}             Yorum sil
\`\`\`

### 👍 Votes (Oylar)
\`\`\`
POST   /api/v1/votes/reports/{id}        İhbara oy ver (upvote/downvote)
DELETE /api/v1/votes/reports/{id}        Oyu geri çek
\`\`\`

### 👑 Admin Panel
\`\`\`
GET    /api/v1/admin/dashboard/stats             Dashboard istatistikleri
GET    /api/v1/admin/dashboard/trends            Günlük trend (7/30 gün)
GET    /api/v1/admin/dashboard/top-categories    En çok ihbar alan kategoriler
PATCH  /api/v1/admin/reports/{id}/status         İhbar durumu güncelle
PATCH  /api/v1/admin/reports/{id}/priority       Öncelik güncelle
PATCH  /api/v1/admin/reports/{id}/assign-municipality  Belediyeye ata
\`\`\`

---

## 🧪 Test Kullanıcıları

\`\`\`
Email: admin@test.com         Role: ADMIN (Süper Admin)
Email: belediye@test.com      Role: MUNICIPALITY_ADMIN
Email: ahmet@test.com         Role: CITIZEN (Normal kullanıcı)
\`\`\`

---

## 📬 Postman Collection

Postman collection dosyası:  \`postman_collection.json\`

\`\`\`bash
# Import et:  Postman → Import → postman_collection.json
# Environment: Belediye Local
#   - base_url: http://127.0.0.1:8001/api/v1
#   - access_token: (otomatik doldurulur)
\`\`\`

---

## 🐳 Docker Komutları

\`\`\`bash
# Container'ları başlat
docker-compose up -d

# Container'ları durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f backend

# Backend container'a gir
docker-compose exec backend bash

# Database'e bağlan
docker-compose exec db psql -U postgres -d belediye_ihbar

# Yeniden build et
docker-compose up --build -d

# Seed data çalıştır
docker-compose exec backend python seed_data.py
\`\`\`

---

## 📁 Proje Yapısı

\`\`\`
backend/
├── app/
│   ├── api/
│   │   ├── deps.py                  # Dependencies (auth, permissions)
│   │   ├── api.py                   # API router
│   │   └── routes/
│   │       ├── auth.py              # Authentication
│   │       ├── reports.py           # Reports CRUD
│   │       ├── users.py             # Users management
│   │       ├── municipalities.py    # Municipalities
│   │       ├── comments.py          # Comments
│   │       ├── votes.py             # Votes
│   │       ├── uploads.py           # Image uploads
│   │       └── admin.py             # Admin panel
│   ├── core/
│   │   ├── config.py                # Settings
│   │   ├── database.py              # Database connection
│   │   └── security.py              # JWT utils
│   ├── models/                      # SQLAlchemy models
│   ├── schemas/                     # Pydantic schemas
│   └── main.py                      # FastAPI app
├── uploads/                         # Uploaded images
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── seed_data.py                     # Test data generator
└── README.md
\`\`\`

---

## 🔒 Güvenlik

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt - opsiyonel)
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ File upload validation

---

## 📈 Gelecek Özellikler (Roadmap)

- [ ] Email notifications
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Report analytics & charts
- [ ] Export reports (PDF, Excel)
- [ ] Real-time updates (WebSocket)
- [ ] Mobile app API improvements
- [ ] Rate limiting
- [ ] Caching (Redis)

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (\`git checkout -b feature/amazing-feature\`)
3. Commit yapın (\`git commit -m 'feat: Add amazing feature'\`)
4. Push yapın (\`git push origin feature/amazing-feature\`)
5. Pull Request açın

---

## 📝 Lisans

MIT License

---

## 📞 İletişim

**Proje sahibi:** [Ensar Şencan]

**Email:** ensar61826@gmail.com

**GitHub:** [github.com/ensarsencanMf/repo](https://github.com/ensarsencanMf/repo)

---

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projeler kullanılarak geliştirilmiştir:

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Pydantic](https://pydantic-docs.helpmanual.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)