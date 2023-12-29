from models import db, RentHistory, Lease
from datetime import datetime

def add_rent_history(lease_id, old_rent, new_rent):
    """Adds a new rent history record to the database."""
    lease = Lease.query.get(lease_id)
    if not lease:
        raise ValueError("Lease not found")
    unit_id = lease.unit_id

    rent_history = RentHistory(
        unit_id=unit_id,
        old_rent=old_rent,
        new_rent=new_rent,
        change_date=datetime.utcnow()
    )
    db.session.add(rent_history)
    db.session.commit()
    return rent_history

def get_rent_histories(filters=None):
    query = RentHistory.query.join(Lease, RentHistory.lease_id == Lease.id)

    if filters:
        if 'unit_id' in filters:
            query = query.filter(Lease.unit_id == filters['unit_id'])

    return query.all()

def delete_rent_history(id):
    """Deletes a rent history record by its ID."""
    rent_history = RentHistory.query.get(id)
    if rent_history:
        db.session.delete(rent_history)
        db.session.commit()
        return True
    return False

def rent_history_to_json(rent_history):
    """Converts a RentHistory object to a JSON representation."""
    return {
        'id': rent_history.id,
        'unit_id': rent_history.unit_id,
        'old_rent': rent_history.old_rent,
        'new_rent': rent_history.new_rent,
        'change_date': rent_history.change_date.strftime('%Y-%m-%d')
    }
