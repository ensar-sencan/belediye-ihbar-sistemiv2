"""
Report model
"""
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Text , ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSON , ARRAY
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid
from datetime import datetime


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    municipality_id = Column(UUID(as_uuid=True), ForeignKey("municipalities.id"), nullable=True)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    priority = Column(String(50), nullable=True, default="medium")
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String(500), nullable=True)
    
    image_urls = Column(ARRAY(String), default=list)
    
    upvotes = Column(Integer, default=0, nullable=False)
    downvotes = Column(Integer, default=0, nullable=False)
    
    is_anonymous = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="reports")
    municipality = relationship("Municipality", back_populates="reports")
    comments = relationship("Comment", back_populates="report", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="report", cascade="all, delete-orphan")