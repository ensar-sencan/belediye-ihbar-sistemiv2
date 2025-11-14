from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
from app.db.base_class import Base  

class Municipality(Base):
    __tablename__ = "municipalities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True, index=True)
    city = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=True)
    
    # Contact
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Boundaries (GeoJSON polygon)
    boundaries = Column(Geometry('POLYGON', srid=4326), nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reports = relationship("Report", back_populates="municipality")