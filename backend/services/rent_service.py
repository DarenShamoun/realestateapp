from models import db, Rent, Lease, Unit
from datetime import datetime
from services.rent_history_service import add_rent_history

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

def get_rents(filters):
    query = Rent.query.join(Lease, Rent.lease_id == Lease.id).join(Unit, Lease.unit_id == Unit.id)
    
    if 'rent_id' in filters:
        query = query.filter(Rent.id == filters['rent_id'])
    if 'lease_id' in filters:
        query = query.filter(Rent.lease_id == filters['lease_id'])
    if 'unit_id' in filters:
        query = query.filter(Unit.id == filters['unit_id'])
    if 'property_id' in filters:
        query = query.filter(Unit.property_id == filters['property_id'])
    if 'year' in filters:
        query = query.filter(db.extract('year', Rent.date) == int(filters['year']))
    if 'month' in filters:
        query = query.filter(db.extract('month', Rent.date) == int(filters['month']))
    if 'start_date' in filters:
        start_date = datetime.strptime(filters['start_date'], '%Y-%m-%d')
        query = query.filter(Rent.date >= start_date)
    if 'end_date' in filters:
        end_date = datetime.strptime(filters['end_date'], '%Y-%m-%d')
        query = query.filter(Rent.date <= end_date)

    return query.all()

def update_rent(rent_id, data):
    """Updates an existing rent record."""
    rent = get_rents(rent_id)
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

def delete_rent(rent_id):
    """Deletes a rent record by its ID."""
    rent = get_rents(rent_id)
    if rent:
        db.session.delete(rent)
        db.session.commit()
        return True
    return False

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
