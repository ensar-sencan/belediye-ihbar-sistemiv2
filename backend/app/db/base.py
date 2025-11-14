"""
Database base configuration.
Import all models here so Alembic can detect them.
"""
from sqlalchemy.ext.declarative import declarative_base

# Base class for all SQLAlchemy models
Base = declarative_base()

# Import all models here in correct order (dependency order matters!)
from app.models.user import User
from app.models.municipality import Municipality
from app.models.report import Report
from app.models.vote import Vote
from app.models.comment import Comment