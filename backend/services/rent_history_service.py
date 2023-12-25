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

def get_rent_history_by_unit(unit_id):
    """Retrieves rent history records for a specific unit."""
    return RentHistory.query.filter_by(unit_id=unit_id).all()

def rent_history_to_json(rent_history):
    """Converts a RentHistory object to a JSON representation."""
    return {
        'id': rent_history.id,
        'unit_id': rent_history.unit_id,
        'old_rent': rent_history.old_rent,
        'new_rent': rent_history.new_rent,
        'change_date': rent_history.change_date.strftime('%Y-%m-%d')
    }