from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date, datetime

class BioSample(SQLModel, table=True):
    """
    Represents a biological sample collected at a specific location and date.

    Attributes:
        id (Optional[int]): Primary key.
        location (str): Sample collection location.
        sampling_date (date): Date of sample collection.
        created_at (datetime): Timestamp of record creation, default is current UTC time.
        type_id (int): Foreign key referencing SampleType.
        operator_id (int): Foreign key referencing Operator.
        sample_type (Optional[SampleType]): Related sample type, eager loaded.
        operator (Optional[Operator]): Related operator who collected the sample, eager loaded.
        comments (List[Comment]): Comments associated with this biosample.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    location: str
    sampling_date: date
    created_at: datetime = Field(default_factory=datetime.utcnow)

    type_id: int = Field(foreign_key="sampletype.id")
    operator_id: int = Field(foreign_key="operator.id")

    sample_type: Optional["SampleType"] = Relationship(
        back_populates="biosamples",
        sa_relationship_kwargs={"lazy": "joined"}  # eager load to reduce queries
    )
    operator: Optional["Operator"] = Relationship(
        back_populates="biosamples",
        sa_relationship_kwargs={"lazy": "joined"}  # eager load to reduce queries
    )
    comments: List["Comment"] = Relationship(
        back_populates="biosample"
    )
