# 📚 API Dokümantasyonu

Belediye İhbar Sistemi REST API dokümantasyonu.

## 🔗 Base URL

```
Development: http://localhost:8000
Production: https://api.belediye-ihbar.com
```

## 🔐 Authentication

API, Firebase Authentication kullanır. Her istekte Firebase ID Token gönderilmelidir.

```http
Authorization: Bearer <firebase_id_token>
```

## 📋 API Endpoints

### Authentication

#### Kayıt Ol
```http
POST /api/auth/register
```

**Not:** Firebase Auth üzerinden yapılır, frontend'de yönetilir.

#### Giriş Yap
```http
POST /api/auth/login
```

**Not:** Firebase Auth üzerinden yapılır, frontend'de yönetilir.

---

### Users (Kullanıcılar)

#### Yeni Kullanıcı Oluştur
```http
POST /api/users/
```

**Request Body:**
```json
{
  "firebase_uid": "firebase_user_id",
  "email": "user@example.com",
  "full_name": "Ahmet Yılmaz",
  "phone": "+905551234567",
  "role": "citizen"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "firebase_uid": "firebase_user_id",
  "email": "user@example.com",
  "full_name": "Ahmet Yılmaz",
  "phone": "+905551234567",
  "role": "citizen",
  "is_active": true,
  "municipality_id": null,
  "created_at": "2025-10-25T23:20:17Z"
}
```

#### Kullanıcıları Listele
```http
GET /api/users/?skip=0&limit=20
```

---

### Reports (İhbarlar)

#### Yeni İhbar Oluştur
```http
POST /api/reports/
```

**Request Body:**
```json
{
  "title": "Yol çukuru acil müdahale gerektiriyor",
  "description": "X Caddesi üzerinde büyük bir çukur var.",
  "category": "pothole",
  "latitude": 41.0082,
  "longitude": 28.9784,
  "address": "Kadıköy, İstanbul",
  "images": ["https://cloudinary.com/image1.jpg"]
}
```

**Kategoriler:**
- `road_damage` - Yol Bozukluğu
- `pothole` - Çukur
- `lighting` - Aydınlatma
- `cleaning` - Temizlik
- `park_garden` - Park/Bahçe
- `water` - Su
- `infrastructure` - Altyapı
- `other` - Diğer

#### İhbarları Listele
```http
GET /api/reports/?skip=0&limit=20&status=pending
```

---

### Municipalities (Belediyeler)

#### Belediyeleri Listele
```http
GET /api/municipalities/
```

#### Belediye İstatistikleri
```http
GET /api/municipalities/{municipality_id}/stats
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Kadıköy Belediyesi",
  "city": "İstanbul",
  "total_reports": 150,
  "pending_reports": 45,
  "resolved_reports": 100
}
```

## 📊 Status Codes

- `200 OK` - Başarılı istek
- `201 Created` - Kaynak oluşturuldu
- `204 No Content` - Başarılı, içerik yok
- `400 Bad Request` - Geçersiz istek
- `401 Unauthorized` - Kimlik doğrulaması gerekli
- `403 Forbidden` - Yetki yok
- `404 Not Found` - Kaynak bulunamadı
- `500 Internal Server Error` - Sunucu hatası

## 🧪 Interaktif Dokümantasyon

- **Swagger UI:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc
