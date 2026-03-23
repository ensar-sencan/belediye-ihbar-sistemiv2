"""
Seed data for development/testing
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.db.base_class import Base
from app.models.user import User
from app.models.municipality import Municipality
from app.models.report import Report
import uuid
from datetime import datetime, timedelta


def seed_database():
    """Seed the database with initial data"""
    
    # Create all tables
    print("Creating database tables...")
    #Base.metadata.create_all(bind=engine)
    
    db:  Session = SessionLocal()
    
    try:
        print("Seeding database...")
        
        # 1. Create Municipalities
        print("Creating municipalities...")
        
        kadikoy = Municipality(
            id=uuid.uuid4(),
            name="Kadıköy Belediyesi",
            district="Kadıköy",
            city="İstanbul",
            contact_email="info@kadikoy.bel.tr",
            contact_phone="+90 216 542 5000",
            website="https://www.kadikoy.bel.tr"
        )
        
        besiktas = Municipality(
            id=uuid.uuid4(),
            name="Beşiktaş Belediyesi",
            district="Beşiktaş",
            city="İstanbul",
            contact_email="info@besiktas.bel.tr",
            contact_phone="+90 212 310 1010",
            website="https://www.besiktas.bel.tr"
        )
        
        uskudar = Municipality(
            id=uuid.uuid4(),
            name="Üsküdar Belediyesi",
            district="Üsküdar",
            city="İstanbul",
            contact_email="info@uskudar.bel.tr",
            contact_phone="+90 216 556 6100",
            website="https://www.uskudar.bel.tr"
        )
        
        db.add_all([kadikoy, besiktas, uskudar])
        db.commit()
        print(f"✅ Created 3 municipalities")
        
        # 2. Create Users
        print("Creating users...")
        
        # Admin User
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@test.com",
            full_name="Sistem Yöneticisi",
            phone="+90 555 999 8877",
            role="ADMIN",
            is_active=True,
            municipality_id=None
        )
        
        # Municipality Admin (Kadıköy)
        municipality_admin = User(
            id=uuid.uuid4(),
            email="belediye@test.com",
            full_name="Kadıköy Belediye Yöneticisi",
            phone="+90 216 542 5001",
            role="MUNICIPALITY_ADMIN",
            is_active=True,
            municipality_id=kadikoy.id
        )
        
        # Regular Users
        user1 = User(
            id=uuid.uuid4(),
            email="ahmet@test.com",
            full_name="Ahmet Yılmaz",
            phone="+90 532 111 2233",
            role="CITIZEN",
            is_active=True,
            municipality_id=None
        )
        
        user2 = User(
            id=uuid.uuid4(),
            email="ayse@test.com",
            full_name="Ayşe Demir",
            phone="+90 533 222 3344",
            role="CITIZEN",
            is_active=True,
            municipality_id=None
        )
        
        user3 = User(
            id=uuid.uuid4(),
            email="mehmet@test.com",
            full_name="Mehmet Kaya",
            phone="+90 534 333 4455",
            role="CITIZEN",
            is_active=True,
            municipality_id=None
        )
        
        db.add_all([admin_user, municipality_admin, user1, user2, user3])
        db.commit()
        print(f"✅ Created 5 users")
        
        # 3. Create Reports
        print("Creating reports...")
        
        reports_data = [
            {
                "title": "Cadde ortasında büyük çukur",
                "description": "Atatürk Caddesi üzerinde araç lastiği patlatacak kadar büyük bir çukur var.  Acil müdahale gerekiyor.",
                "category": "pothole",
                "status": "pending",
                "priority": "high",
                "latitude": 40.9889,
                "longitude": 29.0277,
                "address": "Atatürk Cad. No:45 Kadıköy/İstanbul",
                "user_id": user1.id,
                "municipality_id": kadikoy.id,
                "upvotes":  15,
                "downvotes":  2
            },
            {
                "title": "Sokak lambası yanmıyor",
                "description": "Bağdat Caddesi 123. sokakta sokak lambası 3 gündür yanmıyor. Gece karanlık oluyor.",
                "category": "lighting",
                "status": "in_progress",
                "priority":  "medium",
                "latitude":  40.9845,
                "longitude": 29.0312,
                "address": "Bağdat Cad. 123. Sk.  Kadıköy/İstanbul",
                "user_id":  user2.id,
                "municipality_id": kadikoy.id,
                "upvotes": 8,
                "downvotes": 0
            },
            {
                "title": "Park çöp konteyneri taşıyor",
                "description":  "Fenerbahçe Parkı yanındaki çöp konteynerleri taşıyor. Kötü koku yayılıyor.",
                "category": "cleaning",
                "status": "resolved",
                "priority": "urgent",
                "latitude": 40.9634,
                "longitude": 29.0365,
                "address": "Fenerbahçe Parkı Kadıköy/İstanbul",
                "user_id": user1.id,
                "municipality_id": kadikoy.id,
                "upvotes":  25,
                "downvotes":  1,
                "resolved_at": datetime.utcnow() - timedelta(days=2)
            },
            {
                "title": "Parkta kırık oyun alanı ekipmanı",
                "description": "Moda Parkı'ndaki çocuk oyun alanında salıncak kırık ve tehlikeli.",
                "category": "park",
                "status": "pending",
                "priority": "high",
                "latitude": 40.9821,
                "longitude": 29.0258,
                "address": "Moda Parkı Kadıköy/İstanbul",
                "user_id": user3.id,
                "municipality_id": kadikoy.id,
                "upvotes": 12,
                "downvotes": 0
            },
            {
                "title":  "Su kaçağı - yol çöktü",
                "description": "Ana su borusu patlamış, yolda çökme var. Acil müdahale gerekli!",
                "category": "water",
                "status": "in_progress",
                "priority":  "urgent",
                "latitude": 41.0082,
                "longitude": 28.9784,
                "address": "Barbaros Bulvarı Beşiktaş/İstanbul",
                "user_id":  user2.id,
                "municipality_id": besiktas.id,
                "upvotes": 45,
                "downvotes":  0
            },
            {
                "title": "Yol çizgileri silinmiş",
                "description": "Ana cadde üzerindeki yol çizgileri tamamen silinmiş, trafik karışık.",
                "category": "road",
                "status": "pending",
                "priority": "medium",
                "latitude": 41.0415,
                "longitude": 29.0096,
                "address": "Bağlarbaşı Cad. Üsküdar/İstanbul",
                "user_id": user1.id,
                "municipality_id": uskudar.id,
                "upvotes":  7,
                "downvotes":  1
            },
            {
                "title": "İşgal edilen kaldırım",
                "description": "Dükkan önü kaldırımı işgal etmiş, yayalar yoldan yürümek zorunda.",
                "category": "other",
                "status": "rejected",
                "priority": "low",
                "latitude": 40.9912,
                "longitude": 29.0234,
                "address": "Bahariye Cad. Kadıköy/İstanbul",
                "user_id": user3.id,
                "municipality_id": kadikoy.id,
                "upvotes": 3,
                "downvotes": 8
            }
        ]
        
        for report_data in reports_data: 
            report = Report(
                id=uuid.uuid4(),
                **report_data,
                created_at=datetime.utcnow() - timedelta(days=7, hours=report_data. get("upvotes", 0))
            )
            db.add(report)
        
        db.commit()
        print(f"✅ Created {len(reports_data)} reports")
        
        print("\n" + "="*50)
        print("✅ Database seeded successfully!")
        print("="*50)
        print("\n📋 Test Users:")
        print(f"   Admin:                admin@test.com")
        print(f"   Municipality Admin:  belediye@test.com")
        print(f"   Regular Users:       ahmet@test.com, ayse@test.com, mehmet@test.com")
        print("\n🏛️ Municipalities:")
        print(f"   Kadıköy, Beşiktaş, Üsküdar")
        print("\n📊 Reports:")
        print(f"   {len(reports_data)} reports created")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Starting database seed...")
    seed_database()
    print("Done!")