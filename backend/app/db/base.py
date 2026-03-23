"""
Import all models here to ensure they're registered with SQLAlchemy
This file must import Base first, then all models
"""
# Import Base first
from app.db.base_class import Base

# Import all models - SQLAlchemy will resolve relationships
from app.models. user import User
from app.models. municipality import Municipality
from app.models.report import Report
from app. models.comment import Comment
from app.models.vote import Vote

# Export all
__all__ = ["Base", "User", "Municipality", "Report", "Comment", "Vote"]