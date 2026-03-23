"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy. orm import sessionmaker
from app. core.config import settings

# Import Base from base_class
from app.db.base_class import Base

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    pool_pre_ping=True,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """
    Database session dependency
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()