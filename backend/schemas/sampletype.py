from typing import Optional
from pydantic import BaseModel, ConfigDict
from backend.utils.camelcase import to_camel

class SampleTypeBase(BaseModel):
    """Base fields for a sample type."""
    name: str

class SampleTypeCreate(SampleTypeBase):
    """Payload to create a sample type."""
    pass

class SampleTypeRead(SampleTypeBase):
    """Read model for a sample type."""
    pass

class SampleTypeUpdate(BaseModel):
    """Payload to update a sample type."""
    name: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
