from models import db, Rent
from datetime import datetime

def calculate_total_rent(rent):
    """Calculates the total rent amount."""
    return (rent.rent or 0) + (rent.trash or 0) + \
           (rent.water_sewer or 0) + (rent.parking or 0) + \
           (rent.debt or 0) + (rent.breaks or 0)

def add_rent(data):
    """Adds a new rent record to the database."""
    rent_date = datetime.strptime(data.get('date', datetime.utcnow().strftime('%Y-%m-%d')), '%Y-%m-%d')
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
    db.session.commit()
    return rent

