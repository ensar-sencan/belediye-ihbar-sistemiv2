"""
Models initialization - import all models here
"""
from app.core.database import Base

# Import models in correct order (base models first)
from .user import User
from .municipality import Municipality
from .report import Report
from .comment import Comment
from .vote import Vote

# Make all models available
__all__ = ["Base", "User", "Municipality", "Report", "Comment", "Vote"]