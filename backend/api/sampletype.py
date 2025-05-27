from sqlmodel import Session
from typing import List
from fastapi import APIRouter, Depends
from backend.database import get_session
from backend.schemas.sampletype import SampleTypeRead
from backend.services import sampletype_service

router = APIRouter(prefix="/sample-types", tags=["SampleTypeRead"])

@router.get("/", response_model=List[str])
def sampletypes(session: Session = Depends(get_session)):
    """
    Retrieve all sample types from the database.

    Args:
        session (Session): Database session, injected by FastAPI dependency.

    Returns:
        List[SampleTypeRead]: List of sample types.
    """
    return sampletype_service.get_sample_types(session)
