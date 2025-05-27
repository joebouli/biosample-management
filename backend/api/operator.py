from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List
from fastapi import Query
from sqlalchemy import func
from sqlmodel import select

from backend.database import get_session
from backend.schemas.operator import OperatorRead
from backend.services import operator_service

router = APIRouter(prefix="/operators", tags=["OperatorRead"])

@router.get("/", response_model=List[str])
def list_operators(session: Session = Depends(get_session)):
    """
    Retrieve a list of all operators.

    Args:
        session (Session): Database session dependency.

    Returns:
        List[OperatorRead]: List of operators.
    """
    return operator_service.get_operators(session)
