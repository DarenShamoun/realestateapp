from models import db, Rent
from datetime import datetime
from services.rent_history_service import add_rent_history

def calculate_total_rent(rent):
    """Calculates the total rent amount."""
    return (rent.rent or 0) + (rent.trash or 0) + \
           (rent.water_sewer or 0) + (rent.parking or 0) + \
           (rent.debt or 0) + (rent.breaks or 0)

def add_rent(data):
    """Adds a new rent record to the database."""
    rent_date = datetime.strptime(data.get('date', datetime.utcnow().strftime('%Y-%m-%d')), '%Y-%m-%d')

    existing_rent = Rent.query.filter_by(
        unit_id=data['unit_id'],
        date=rent_date
    ).first()

    rent = Rent(
        unit_id=data['unit_id'],
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
    
    if existing_rent and existing_rent.rent != rent.rent:
        add_rent_history(
            unit_id=rent.unit_id,
            old_rent=existing_rent.rent,
            new_rent=rent.rent
        )
    
    db.session.commit()
    return rent

def update_rent(id, data):
    """Updates an existing rent record."""
    rent = Rent.query.get(id)
    if not rent:
        return None

    if 'date' in data:
        rent.date = datetime.strptime(data['date'], '%Y-%m-%d')

    rent.rent = data.get('rent', rent.rent)
    rent.trash = data.get('trash', rent.trash)
    rent.water_sewer = data.get('water_sewer', rent.water_sewer)
    rent.parking = data.get('parking', rent.parking)
    rent.debt = data.get('debt', rent.debt)
    rent.breaks = data.get('breaks', rent.breaks)
    
    rent.total_rent = calculate_total_rent(rent)
    
    if rent.rent != data.get('rent', rent.rent):
        add_rent_history(unit_id=rent.unit_id, old_rent=rent.rent, new_rent=data['rent'])

    db.session.commit()
    return rent

def rent_to_json(rent):
    return {
        'id': rent.id,
        'unit_id': rent.unit_id,
        'rent': rent.rent,
        'trash': rent.trash,
        'water_sewer': rent.water_sewer,
        'parking': rent.parking,
        'debt': rent.debt,
        'breaks': rent.breaks,
        'date': rent.date.strftime('%Y-%m-%d')
    }
