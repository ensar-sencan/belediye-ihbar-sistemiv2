"""
User model
"""
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db. base_class import Base
import uuid
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    firebase_uid = Column(String, unique=True, nullable=True, index=True)
    
    role = Column(String(50), nullable=False, default="CITIZEN")
    is_active = Column(Boolean, default=True, nullable=False)
    
    municipality_id = Column(UUID(as_uuid=True), ForeignKey("municipalities.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime. utcnow, nullable=True)
    
    # Relationships
    municipality = relationship("Municipality", back_populates="users")
    reports = relationship("Report", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    votes = relationship("Vote", back_populates="user")