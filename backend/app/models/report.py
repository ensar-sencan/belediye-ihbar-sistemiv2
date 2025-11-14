from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
from app.db.base_class import Base 
import enum

class ReportCategory(str, enum.Enum):
    ROAD_DAMAGE = "road_damage"
    POTHOLE = "pothole"
    LIGHTING = "lighting"
    CLEANING = "cleaning"
    PARK_GARDEN = "park_garden"
    WATER = "water"
    INFRASTRUCTURE = "infrastructure"
    OTHER = "other"

class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

class ReportPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    municipality_id = Column(Integer, ForeignKey("municipalities.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ReportCategory), nullable=False)
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    priority = Column(Enum(ReportPriority), default=ReportPriority.MEDIUM)
    
    # Location
    location = Column(Geometry('POINT', srid=4326), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    
    # Images
    images = Column(Text, nullable=True)
    
    # Engagement
    vote_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="reports")
    municipality = relationship("Municipality", back_populates="reports")
    votes = relationship("ReportVote", back_populates="report", cascade="all, delete-orphan")
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")

class ReportVote(Base):
    __tablename__ = "report_votes"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    report = relationship("Report", back_populates="votes")
    user = relationship("User", back_populates="votes")

class ReportComment(Base):
    __tablename__ = "report_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    report = relationship("Report", back_populates="comments")