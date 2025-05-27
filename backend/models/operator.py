from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Operator(SQLModel, table=True):
    """
    Represents an operator who collects biosamples.

    Attributes:
        id (Optional[int]): Primary key.
        name (str): Unique name of the operator.
        biosamples (List[BioSample]): List of biosamples collected by this operator.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    biosamples: List["BioSample"] = Relationship(back_populates="operator")
