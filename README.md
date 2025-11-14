# 🏙️ Belediye İhbar Sistemi

Vatandaşların belediyelerine çukur, yol bozukluğu, aydınlatma arızası gibi sorunları kolayca bildirebileceği modern bir web platformu.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![React](https://img.shields.io/badge/react-18+-blue)

## 🎯 Proje Hakkında

Bu proje, Türkiye genelindeki vatandaşların yaşadıkları bölgedeki belediyeye anlık ihbarlarda bulunabilmelerini sağlayan açık kaynaklı bir web uygulamasıdır.

### ✨ Temel Özellikler

- 📍 **Harita Tabanlı İhbar**: Lokasyon bazlı sorun bildirimi
- 📸 **Fotoğraf Yükleme**: Görsel kanıtlarla bildirim
- 🏷️ **Kategorizasyon**: Yol, temizlik, aydınlatma, park-bahçe vb.
- 📊 **Durum Takibi**: Bildirimin gerçek zamanlı durumu
- 🗺️ **İnteraktif Harita**: Tüm bildirimleri harita üzerinde görme
- 👥 **Topluluk Doğrulama**: Diğer vatandaşların bildirimleri onaylama
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🔐 **Güvenli Authentication**: Firebase Auth entegrasyonu

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** - Modern UI
- **Leaflet.js** - İnteraktif harita
- **React Query** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Python 3.11+**
- **FastAPI** - Modern, hızlı web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Ana veritabanı
- **PostGIS** - Coğrafi veri eklentisi
- **Alembic** - Database migration
- **Pydantic** - Veri validasyonu

### Authentication & Services
- **Firebase Authentication** - Kullanıcı girişi
- **Cloudinary** - Görsel depolama
- **JWT** - Token bazlı auth

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ ve npm/yarn
- Python 3.11+
- PostgreSQL 14+ (PostGIS eklentisi ile)
- Firebase projesi (Authentication için)

### Backend Kurulumu

```bash
# Repository'yi klonlayın
git clone https://github.com/ensarSencanMf/belediye-ihbar-sistemi.git
cd belediye-ihbar-sistemi/backend

# Virtual environment oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# .env dosyasını oluşturun
cp .env.example .env
# .env dosyasını düzenleyip gerekli değişkenleri ekleyin

# Database migration
alembic upgrade head

# Sunucuyu başlatın
uvicorn app.main:app --reload
```

### Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install
# veya
yarn install

# .env dosyasını oluşturun
cp .env.example .env
# Firebase ve API ayarlarını yapın

# Development sunucusunu başlatın
npm run dev
# veya
yarn dev
```

## 🏗️ Proje Yapısı

```
belediye-ihbar-sistemi/
├── frontend/                 # React Web App
│   ├── src/
│   │   ├── components/      # UI bileşenleri
│   │   ├── pages/           # Sayfalar
│   │   ├── services/        # API servisleri
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Yardımcı fonksiyonlar
│   └── package.json
│
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Ayarlar, güvenlik
│   │   ├── models/          # SQLAlchemy modelleri
│   │   ├── schemas/         # Pydantic şemaları
│   │   └── services/        # İş mantığı
│   ├── alembic/             # Migrations
│   └── requirements.txt
│
├── docs/                     # Dokümantasyon
└── README.md
```

## 📚 Dokümantasyon

- [API Dokümantasyonu](docs/API.md)
- [Veritabanı Şeması](docs/DATABASE.md)
- [Kurulum Kılavuzu](docs/SETUP.md)
- [Katkıda Bulunma](CONTRIBUTING.md)

## 🗺️ Roadmap

### Faz 1: MVP (4-6 hafta)
- [x] Proje kurulumu ve planlama
- [ ] Authentication sistemi (Firebase)
- [ ] Veritabanı şeması ve modeller
- [ ] İhbar oluşturma API
- [ ] Harita entegrasyonu
- [ ] Temel frontend UI
- [ ] Admin paneli (basit)

### Faz 2: İyileştirmeler (4 hafta)
- [ ] Topluluk doğrulama sistemi
- [ ] Bildirim sistemi (email/push)
- [ ] Gelişmiş filtreleme ve arama
- [ ] Kullanıcı profilleri
- [ ] İstatistik ve raporlama
- [ ] Performance optimizasyonları

### Faz 3: İleri Özellikler (6 hafta)
- [ ] AI destekli görüntü analizi
- [ ] Mobil uygulama (React Native)
- [ ] Gerçek zamanlı güncellemeler (WebSocket)
- [ ] Gamification sistemi
- [ ] Çoklu dil desteği
- [ ] Dark mode

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Commit Mesaj Formatı

```
feat: Yeni özellik ekle
fix: Hata düzeltmesi
docs: Dokümantasyon güncelleme
style: Kod formatı değişikliği
refactor: Kod refactoring
test: Test ekleme/güncelleme
chore: Genel bakım işleri
```

## 📝 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Ensar Sencan** - [@ensarSencanMf](https://github.com/ensarSencanMf) - Proje Sahibi

## 🙏 Teşekkürler

Bu proje, vatandaşların şehirlerini daha yaşanabilir hale getirmek için geliştirilen açık kaynaklı bir inisiyatiftir.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Made with ❤️ in Turkey**
