from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from fastapi import Query
from sqlalchemy import func
from sqlmodel import select

from backend.database import get_session
from backend.services import biosample_service
from backend.schemas.biosample import BioSampleCreate, BioSampleRead, BioSampleUpdate
from backend.models.biosample import BioSample

router = APIRouter(prefix="/biosamples", tags=["BioSamples"])

@router.post("/", response_model=BioSampleRead)
def create_biosample(data: BioSampleCreate, session: Session = Depends(get_session)):
    """
    Create a new biosample entry in the database.

    Args:
        data (BioSampleCreate): Data to create the biosample.
        session (Session): Database session dependency.

    Returns:
        BioSampleRead: Created biosample data.
    """
    return biosample_service.create_biosample(session, data)

@router.get("/")
def list_biosamples(
    session: Session = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Retrieve a paginated list of biosamples with total count.

    Args:
        session (Session): Database session dependency.
        limit (int): Maximum number of biosamples to return (default 10).
        offset (int): Number of biosamples to skip (default 0).

    Returns:
        dict: Contains the list of biosamples under "results" and total count under "totalCount".
    """
    total_count = session.exec(select(func.count()).select_from(BioSample)).one()
    results = biosample_service.list_biosamples(session, limit=limit, offset=offset)
    return {"results": results, "totalCount": total_count}

@router.get("/{biosample_id}", response_model=BioSampleRead)
def get_biosample(biosample_id: int, session: Session = Depends(get_session)):
    """
    Retrieve a single biosample by its ID.

    Args:
        biosample_id (int): The ID of the biosample to retrieve.
        session (Session): Database session dependency.

    Returns:
        BioSampleRead: The requested biosample data.
    """
    biosample = biosample_service.get_biosample(session, biosample_id)
    return biosample

@router.put("/{biosample_id}", response_model=BioSampleRead)
def update_biosample(biosample_id: int, data: BioSampleUpdate, session: Session = Depends(get_session)):
    """
    Update an existing biosample.

    Args:
        biosample_id (int): ID of the biosample to update.
        data (BioSampleUpdate): Data to update.
        session (Session): Database session dependency.

    Returns:
        BioSampleRead: Updated biosample data.
    """
    updated = biosample_service.update_biosample(session, biosample_id, data)
    return updated

@router.delete("/{biosample_id}")
def delete_biosample(biosample_id: int, session: Session = Depends(get_session)):
    """
    Delete a biosample by its ID.

    Args:
        biosample_id (int): ID of the biosample to delete.
        session (Session): Database session dependency.

    Returns:
        dict: Confirmation message {"ok": True} on successful deletion.
    """
    biosample_service.delete_biosample(session, biosample_id)  # se non trovato, solleva EntityNotFoundError
    return {"ok": True}


@router.get("/generate/{n}", response_model=List[BioSampleRead])
def generate_random_biosamples(n: int, session: Session = Depends(get_session)):
    """
    Generate and insert multiple random biosamples.

    Args:
        n (int): Number of biosamples to generate.
        session (Session): Database session dependency.

    Note:
        This endpoint is intended for testing or development purposes only.

    Returns:
        List[BioSampleRead]: List of newly generated biosamples.
    """
    return biosample_service.generate_multiple_biosamples(session, n)
