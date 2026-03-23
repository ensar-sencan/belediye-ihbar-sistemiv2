"""
Create all database tables
"""
from app.core.database import Base, engine
from app.models.user import User
from app. models.municipality import Municipality
from app.models. report import Report
from app.models.vote import Vote
from app. models.comment import Comment

print("🚀 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ All tables created successfully!")