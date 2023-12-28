from models import db, Rent, Lease
from datetime import datetime
from services.rent_history_service import add_rent_history

def calculate_total_rent(rent):
    """Calculates the total rent amount."""
    return sum([
        rent.rent or 0,
        rent.trash or 0,
        rent.water_sewer or 0,
        rent.parking or 0,
        rent.debt or 0,
        rent.breaks or 0
    ])

def add_rent(data):
    lease = Lease.query.get(data['lease_id'])
    if not lease:
        raise ValueError("Lease not found")

    rent_date = datetime.strptime(data.get('date', datetime.utcnow().strftime('%Y-%m-%d')), '%Y-%m-%d')
    existing_rent = Rent.query.filter_by(lease_id=data['lease_id'], date=rent_date).first()

    rent = Rent(
        lease_id=data['lease_id'],
        rent=data.get('rent', 0),
        trash=data.get('trash', 0),
        water_sewer=data.get('water_sewer', 0),
        parking=data.get('parking', 0),
        debt=data.get('debt', 0),
        breaks=data.get('breaks', 0),
        date=rent_date
    )
    rent.total_rent = calculate_total_rent(rent)
    db.session.add(rent)

    # Adding rent history if rent value changes
    if existing_rent and existing_rent.rent != data.get('rent', 0):
        add_rent_history(lease_id=lease.id, old_rent=existing_rent.rent, new_rent=data.get('rent', 0))

    db.session.commit()
    return rent

def get_all_rents():
    """Retrieves all rent records from the database."""
    return Rent.query.all()

def get_rent_by_id(id):
    """Retrieves a rent record by its ID."""
    return Rent.query.get(id)

def get_recent_rent(lease_id):
    """Retrieves the most recent rent record for a specific lease."""
    return Rent.query.filter_by(lease_id=lease_id).order_by(Rent.date.desc()).first()

def get_monthly_rent(lease_id, year, month):
    """Retrieves rent for a specific month and year for a lease."""
    return Rent.query.filter_by(lease_id=lease_id).filter(
        db.extract('year', Rent.date) == year,
        db.extract('month', Rent.date) == month
    ).first()

def update_rent(id, data):
    """Updates an existing rent record."""
    rent = Rent.query.get(id)
    if not rent:
        return None

    # Keep track of the old rent before updating
    old_rent = rent.rent

    for key in ['rent', 'trash', 'water_sewer', 'parking', 'debt', 'breaks']:
        setattr(rent, key, data.get(key, getattr(rent, key)))
    
    if 'date' in data:
        rent.date = datetime.strptime(data['date'], '%Y-%m-%d')

    rent.total_rent = calculate_total_rent(rent)
    
    # Check if rent amount has changed
    if old_rent != rent.rent:
        add_rent_history(unit_id=rent.unit_id, old_rent=old_rent, new_rent=rent.rent)

    db.session.commit()
    return rent

def delete_rent(id):
    """Deletes a rent record by its ID."""
    rent = get_rent_by_id(id)
    if rent:
        db.session.delete(rent)
        db.session.commit()
        return True
    return False

def rent_to_json(rent):
    lease = Lease.query.get(rent.lease_id)
    unit_id = lease.unit_id if lease else None

    return {
        'id': rent.id,
        'lease_id': rent.lease_id,
        'unit_id': unit_id,
        'rent': rent.rent,
        'trash': rent.trash,
        'water_sewer': rent.water_sewer,
        'parking': rent.parking,
        'debt': rent.debt,
        'breaks': rent.breaks,
        'total_rent': rent.total_rent,
        'date': rent.date.strftime('%Y-%m-%d'),
        'created_at': rent.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': rent.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
