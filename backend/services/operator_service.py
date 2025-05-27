from sqlmodel import Session, select
from backend.models.operator import Operator

def get_operator_by_name(session: Session, name: str) -> Operator | None:
    """Retrieve an Operator by name, or return None if not found."""
    stmt = select(Operator).where(Operator.name == name.lower())
    return session.exec(stmt).first()

def get_operators(session: Session) -> list[str]:
    """Return all Operators in the database."""
    stmt = select(Operator.name)
    return session.exec(stmt).all()

def create_operator_by_name(session: Session, name: str) -> Operator:
    """Create a new Operator with a lowercase name and return it."""
    operator = Operator(name=name.lower())
    session.add(operator)
    session.commit()
    session.refresh(operator)
    return operator

def get_or_create_operator(session: Session, name: str) -> Operator:
    """Retrieve an Operator by name, or create one if it doesn't exist."""
    operator = get_operator_by_name(session, name)
    return operator if operator else create_operator_by_name(session, name)
