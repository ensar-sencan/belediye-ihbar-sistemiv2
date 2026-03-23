"""
Municipality endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_user
from app.schemas.municipality import Municipality, MunicipalityCreate, MunicipalityUpdate
from app.models.municipality import Municipality as MunicipalityModel

router = APIRouter()


@router.get("/", response_model=List[Municipality])
async def list_municipalities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get list of municipalities
    """
    municipalities = db.query(MunicipalityModel).offset(skip).limit(limit).all()
    return municipalities


@router.get("/{municipality_id}", response_model=Municipality)
async def get_municipality(
    municipality_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get single municipality by ID
    """
    municipality = db.query(MunicipalityModel).filter(
        MunicipalityModel. id == municipality_id
    ).first()
    
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    return municipality


@router.post("/", response_model=Municipality, status_code=status.HTTP_201_CREATED)
async def create_municipality(
    municipality_in: MunicipalityCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)  # Only authenticated users
):
    """
    Create new municipality (admin only in production)
    """
    new_municipality = MunicipalityModel(**municipality_in.dict())
    db.add(new_municipality)
    db.commit()
    db.refresh(new_municipality)
    
    return new_municipality


@router.patch("/{municipality_id}", response_model=Municipality)
async def update_municipality(
    municipality_id: UUID,
    municipality_in: MunicipalityUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)  # Only authenticated users
):
    """
    Update municipality (admin only in production)
    """
    municipality = db.query(MunicipalityModel).filter(
        MunicipalityModel.id == municipality_id
    ).first()
    
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    # Update fields
    for key, value in municipality_in. dict(exclude_unset=True).items():
        setattr(municipality, key, value)
    
    db.commit()
    db.refresh(municipality)
    
    return municipality


@router.delete("/{municipality_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_municipality(
    municipality_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)  # Only authenticated users
):
    """
    Delete municipality (admin only in production)
    """
    municipality = db. query(MunicipalityModel).filter(
        MunicipalityModel.id == municipality_id
    ).first()
    
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found"
        )
    
    db.delete(municipality)
    db.commit()
    
    return None