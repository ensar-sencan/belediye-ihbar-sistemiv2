"""
Municipality model
"""
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid


class Municipality(Base):
    __tablename__ = "municipalities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False, unique=True)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String(20), nullable=True)
    website = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    users = relationship("User", back_populates="municipality")
    reports = relationship("Report", back_populates="municipality")