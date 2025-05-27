from typing import Optional
from pydantic import BaseModel, ConfigDict
from backend.utils.camelcase import to_camel


class OperatorBase(BaseModel):
    """Base fields for an operator."""
    name: str


class OperatorCreate(OperatorBase):
    """Payload to create an operator."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class OperatorUpdate(BaseModel):
    """Payload to update an operator."""
    name: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class OperatorRead(OperatorBase):
    """Read model for an operator."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
