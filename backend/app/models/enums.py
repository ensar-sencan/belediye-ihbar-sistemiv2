"""
Enums for the application
"""
from enum import Enum


class UserRole(str, Enum):
    """User role enum"""
    ADMIN = "ADMIN"
    MUNICIPALITY_ADMIN = "MUNICIPALITY_ADMIN"
    CITIZEN = "CITIZEN"


class ReportStatus(str, Enum):
    """Report status enum"""
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"


class ReportPriority(str, Enum):
    """Report priority enum"""
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class ReportCategory(str, Enum):
    """Report category enum"""
    pothole = "pothole"
    lighting = "lighting"
    cleaning = "cleaning"
    park = "park"
    water = "water"
    road = "road"
    other = "other"


class VoteType(str, Enum):
    """Vote type enum"""
    upvote = "upvote"
    downvote = "downvote"