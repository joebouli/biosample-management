from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, ConfigDict
from backend.utils.camelcase import to_camel

class CommentBase(BaseModel):
    """Common fields for a comment."""
    content: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)


class CommentCreateWithoutId(CommentBase):
    """Payload to create a comment (biosample_id comes from URL)."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class CommentCreate(CommentBase):
    """Internal model with biosample_id (used in service logic)."""
    biosample_id: int


class CommentRead(CommentBase):
    """Model for reading a comment."""
    id: int
    biosample_id: int
    created_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class CommentListResponse(BaseModel):
    """Paginated list of comments."""
    results: List[CommentRead]
    total_count: int

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
