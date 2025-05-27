from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class Comment(SQLModel, table=True):
    """
    Represents a comment associated with a biosample.

    Attributes:
        id (Optional[int]): Primary key.
        biosample_id (int): Foreign key to the related biosample.
        content (str): Text content of the comment.
        author (str): Name or identifier of the comment author.
        created_at (datetime): Timestamp when the comment was created, defaults to UTC now.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    biosample_id: int = Field(foreign_key="biosample.id")
    content: str
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    biosample: "BioSample" = Relationship(back_populates="comments")
