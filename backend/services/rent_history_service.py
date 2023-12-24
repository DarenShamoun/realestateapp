from models import db, RentHistory
from datetime import datetime

def add_rent_history(unit_id, old_rent, new_rent):
    """Adds a new rent history record to the database."""
    rent_history = RentHistory(
        unit_id=unit_id,
        old_rent=old_rent,
        new_rent=new_rent,
        change_date=datetime.utcnow()
    )
    db.session.add(rent_history)
    db.session.commit()
    return rent_history
