from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class SampleType(SQLModel, table=True):
    """
    Represents a type/category of biological samples.

    Attributes:
        id (Optional[int]): Primary key identifier.
        name (str): Unique name of the sample type.
        biosamples (List[BioSample]): List of biosamples of this type.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    # Reverse relationship to biosamples with this sample type
    biosamples: List["BioSample"] = Relationship(back_populates="sample_type")
