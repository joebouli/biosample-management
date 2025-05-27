from sqlmodel import Session, select
from backend.models.sampletype import SampleType

def get_sample_type_by_name(session: Session, name: str) -> SampleType | None:
    """Retrieve a SampleType by name, or return None if not found."""
    stmt = select(SampleType).where(SampleType.name == name.lower())
    return session.exec(stmt).first()

def get_sample_types(session: Session) -> list[SampleType]:
    """Return all SampleTypes in the database."""
    stmt = select(SampleType)
    return session.exec(stmt).all()

def create_sample_type_by_name(session: Session, name: str) -> SampleType:
    """Create a new SampleType with a lowercase name and return it."""
    sample_type = SampleType(name=name.lower())
    session.add(sample_type)
    session.commit()
    session.refresh(sample_type)
    return sample_type

def get_or_create_sample_type(session: Session, name: str) -> SampleType:
    """Retrieve a SampleType by name, or create one if it doesn't exist."""
    sample_type = get_sample_type_by_name(session, name)
    return sample_type if sample_type else create_sample_type_by_name(session, name)
