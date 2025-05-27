from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from backend.database import get_session
from backend.schemas.comment import CommentCreateWithoutId, CommentRead, CommentListResponse
from backend.services import comment_service

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.get("/{biosample_id}", response_model=CommentListResponse)
def get_comments(
    biosample_id: int,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    session: Session = Depends(get_session)
):
    """
    Retrieve a paginated list of comments for a given biosample.

    Args:
        biosample_id (int): ID of the biosample to fetch comments for.
        offset (int, optional): Number of comments to skip. Defaults to 0.
        limit (int, optional): Maximum number of comments to return. Defaults to 10.

    Returns:
        CommentListResponse: Contains a list of comments and metadata like total count.
    """
    return comment_service.get_comments(session, biosample_id, offset, limit)

@router.post("/{biosample_id}", response_model=CommentRead)
def create_comment(
    biosample_id: int,
    comment_data: CommentCreateWithoutId,
    session: Session = Depends(get_session)
):
    """
    Create a new comment associated with the specified biosample.

    Args:
        biosample_id (int): ID of the biosample to associate the comment with.
        comment_data (CommentCreateWithoutId): Comment data submitted by the client.

    Returns:
        CommentRead: The newly created comment with its ID and other details.
    """
    return comment_service.add_comment(session, comment_data, biosample_id)
