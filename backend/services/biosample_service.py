from typing import List, Optional
from sqlmodel import Session, select
from datetime import datetime, timedelta
from random import choice, randint
from backend.services.exceptions import EntityNotFoundError
from backend.converters.biosample_converter import from_biosample_create, to_biosample_read
from backend.models.biosample import BioSample
from backend.schemas.biosample import BioSampleCreate, BioSampleUpdate, BioSampleRead
from backend.services.operator_service import get_or_create_operator
from backend.services.sampletype_service import get_or_create_sample_type
from backend.services.comment_service import delete_comments_for_sample

def create_biosample(session: Session, data: BioSampleCreate) -> BioSampleRead:
    """Create a new biosample from input data."""
    biosample = from_biosample_create(session, data)
    session.add(biosample)
    session.commit()
    session.refresh(biosample)
    return to_biosample_read(biosample)

def generate_random_biosample_data():
    """Generate random data for testing/demo purposes."""
    locations = ["Rome", "Milan", "Turin", "Naples", "Florence"]
    sample_types = ["water", "chocolate", "flour"]
    operators = ["Mario", "Luigi", "Anna", "Julia", "Luke"]

    return {
        "location": choice(locations),
        "sampling_date": datetime.today().date() - timedelta(days=randint(0, 30)),
        "operator_name": choice(operators),
        "sample_type_name": choice(sample_types),
    }

def generate_multiple_biosamples(session: Session, n: int) -> List[BioSampleRead]:
    """Generate and insert N random biosamples."""
    biosamples = []
    for _ in range(n):
        data = BioSampleCreate(**generate_random_biosample_data())
        biosample = create_biosample(session, data)
        biosamples.append(biosample)
    return biosamples

def list_biosamples(session: Session, limit: int = 10, offset: int = 0) -> List[BioSampleRead]:
    """Return a paginated list of biosamples."""
    stmt = select(BioSample).order_by(BioSample.created_at.desc()).offset(offset).limit(limit)
    results = session.exec(stmt).all()
    return [to_biosample_read(bs) for bs in results]

def get_biosample(session: Session, biosample_id: int) -> Optional[BioSampleRead]:
    """Fetch a single biosample by ID."""
    biosample = session.get(BioSample, biosample_id)
    return to_biosample_read(biosample) if biosample else None

def update_biosample(session: Session, biosample_id: int, data: BioSampleUpdate) -> Optional[BioSampleRead]:
    """Update an existing biosample."""
    biosample = session.get(BioSample, biosample_id)
    if not biosample:
        raise EntityNotFoundError(f"BioSample with id {biosample_id} not found")
    update_data = data.model_dump(exclude_unset=True)
    if "operator_name" in update_data:
        operator = get_or_create_operator(session, update_data.pop("operator_name"))
        biosample.operator_id = operator.id
    if "sample_type_name" in update_data:
        sample_type = get_or_create_sample_type(session, update_data.pop("sample_type_name"))
        biosample.type_id = sample_type.id
    for key, value in update_data.items():
        setattr(biosample, key, value)
    session.add(biosample)
    session.commit()
    session.refresh(biosample)
    return to_biosample_read(biosample)

def delete_biosample(session: Session, biosample_id: int) -> Optional[BioSampleRead]:
    """Delete a biosample and its related comments."""
    delete_comments_for_sample(session, biosample_id)
    biosample = session.get(BioSample, biosample_id)
    if not biosample:
        raise EntityNotFoundError(f"BioSample with id {biosample_id} not found")
    session.delete(biosample)
    session.commit()
    return biosample
