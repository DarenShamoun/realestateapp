from models import Unit, Payment, Lease, db
from sqlalchemy import extract
from datetime import datetime

def add_unit(data):
    new_unit = Unit(**data)
    db.session.add(new_unit)
    db.session.commit()
    return new_unit

def get_units(filters=None):
    query = Unit.query

    if filters:
        if 'id' in filters:
            query = query.filter(Unit.id == filters['id'])
        if 'property_id' in filters:
            query = query.filter(Unit.property_id == filters['property_id'])
        if 'is_occupied' in filters:
            query = query.filter(Unit.is_occupied == filters['is_occupied'])
        if 'tenant_id' in filters:
            tenant_id = filters['tenant_id']
            query = query.join(Unit.lease_details).filter(Lease.tenant_id == tenant_id)

    return query.all()

def update_unit(id, data):
    unit = get_units(id)
    if not unit:
        return None

    for key, value in data.items():
        setattr(unit, key, value)

    db.session.commit()
    return unit

def delete_unit(id):
    unit = get_units(id)
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
