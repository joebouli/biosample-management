from typing import Optional
from backend.utils.camelcase import to_camel
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class BioSampleBase(BaseModel):
    """Common fields for BioSample."""
    location: str
    sampling_date: date


class BioSampleCreate(BioSampleBase):
    """Schema for creating a BioSample."""
    operator_name: str
    sample_type_name: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class BioSampleUpdate(BaseModel):
    """Schema for updating a BioSample."""
    location: Optional[str] = None
    sampling_date: Optional[date] = None
    operator_name: Optional[str] = None
    sample_type_name: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class BioSampleRead(BioSampleBase):
    """Schema for reading a BioSample."""
    id: int
    operator_name: str
    sample_type_name: str
    created_at: datetime

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
