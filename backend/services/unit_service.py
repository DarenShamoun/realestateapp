from models import Unit, Payment, Rent, db
from sqlalchemy import extract
from datetime import datetime

def add_unit(data):
    new_unit = Unit(**data)
    db.session.add(new_unit)
    db.session.commit()
    return new_unit

def get_all_units():
    return Unit.query.all()

def get_unit_by_id(unit_id):
    return Unit.query.get(unit_id)

def update_unit(unit_id, data):
    unit = get_unit_by_id(unit_id)
    if not unit:
        return None

    for key, value in data.items():
        setattr(unit, key, value)

    db.session.commit()
    return unit

def delete_unit(unit_id):
    unit = get_unit_by_id(unit_id)
    if unit:
        db.session.delete(unit)
        db.session.commit()
        return True
    return False

def get_total_rent(unit_id):
    current_month = datetime.now().month
    current_year = datetime.now().year
    unit = Unit.query.get(unit_id)
    if unit:
        total_rent = 0
        for lease in unit.lease_details:
            # Assuming each lease can have multiple rents
            rent_records = lease.rents
            for rent in rent_records:
                if rent.date.year == current_year and rent.date.month == current_month:
                    total_rent += rent.total_rent
        return total_rent
    return 0

def calculate_balance(unit_id, year, month):
    unit = Unit.query.get(unit_id)
    if unit:
        payments = Payment.query.filter_by(unit_id=unit.id)
        payments = payments.filter(extract('year', Payment.date) == year,
                                    extract('month', Payment.date) == month).all()
        total_paid = sum(payment.amount for payment in payments)
        rent_expected = get_total_rent(unit_id)
        return rent_expected - total_paid
    return None

def update_balance(unit_id, year, month):
    unit = Unit.query.get(unit_id)
    if unit:
        total_paid = sum(payment.amount for lease in unit.lease_details for payment in lease.payments if payment.date.year == year and payment.date.month == month)
        total_rent = sum(lease.rent.total_rent for lease in unit.lease_details if lease.rent and lease.rent.date.year == year and lease.rent.date.month == month)
        balance = total_rent - total_paid
        return balance
    return None


def unit_to_json(unit):
    return {
        'id': unit.id,
        'property_id': unit.property_id,
        'unit_number': unit.unit_number,
        'is_occupied': unit.is_occupied,
        'rent_status': unit.rent_status,
        'total_rent': get_total_rent(unit.id),
        'created_at': unit.created_at.isoformat(),
        'updated_at': unit.updated_at.isoformat()
    }
