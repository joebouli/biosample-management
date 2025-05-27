from typing import List
from sqlmodel import Session, select, delete
from sqlalchemy import func
from backend.services.exceptions import EntityNotFoundError
from backend.models.comment import Comment
from backend.schemas.comment import CommentCreate, CommentCreateWithoutId, CommentRead, CommentListResponse

def add_comment(session: Session, comment_data: CommentCreateWithoutId, biosample_id: int) -> CommentRead:
    """Create and return a new comment linked to a biosample."""
    from backend.services.biosample_service import get_biosample
    if not get_biosample(session, biosample_id):
        raise EntityNotFoundError(f"Biosample with id {biosample_id} not found")
    full_comment_data = CommentCreate(
        **comment_data.model_dump(),
        biosample_id=biosample_id
    )
    comment = Comment(**full_comment_data.model_dump())
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return CommentRead.model_validate(comment)

def get_comments(session: Session, biosample_id: int, offset: int = 0, limit: int = 10) -> CommentListResponse:
    """Retrieve paginated comments for a biosample, along with total count."""
    from backend.services.biosample_service import get_biosample
    if not get_biosample(session, biosample_id):
        raise EntityNotFoundError(f"Biosample with id {biosample_id} not found")
    stmt = (
        select(Comment)
        .where(Comment.biosample_id == biosample_id)
        .order_by(Comment.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    comments = session.exec(stmt).all()

    count_stmt = select(func.count()).where(Comment.biosample_id == biosample_id)
    total_count = session.exec(count_stmt).one()

    results = [CommentRead.model_validate(c) for c in comments]

    return CommentListResponse(results=results, total_count=total_count)

def count_comments(session: Session, biosample_id: int) -> int:
    """Return the total number of comments for a biosample."""
    return session.exec(
        select(func.count()).where(Comment.biosample_id == biosample_id)
    ).scalar() or 0

def delete_comments_for_sample(session: Session, biosample_id: int) -> None:
    """Delete all comments linked to a given biosample."""
    stmt = delete(Comment).where(Comment.biosample_id == biosample_id)
    session.exec(stmt)
    session.commit()
