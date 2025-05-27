from backend.models.biosample import BioSample
from backend.schemas.biosample import BioSampleCreate, BioSampleRead
from backend.services.operator_service import get_or_create_operator
from backend.services.sampletype_service import get_or_create_sample_type
from sqlmodel import Session


def from_biosample_create(session: Session, data: BioSampleCreate) -> BioSample:
    operator = get_or_create_operator(session, data.operator_name)
    sample_type = get_or_create_sample_type(session, data.sample_type_name)
    return BioSample(
        location=data.location,
        sampling_date=data.sampling_date,
        operator_id=operator.id,
        type_id=sample_type.id,
    )


def to_biosample_read(biosample: BioSample) -> BioSampleRead:
    return BioSampleRead(
        id=biosample.id,
        location=biosample.location,
        sampling_date=biosample.sampling_date,
        operator_name=biosample.operator.name,
        sample_type_name=biosample.sample_type.name,
        created_at=biosample.created_at,
    )
