from models import Unit, Payment, db
from sqlalchemy import extract

def get_total_rent(unit_id):
    unit = Unit.query.get(unit_id)
    if unit and unit.rent_details:
        return unit.rent_details.calculate_total_rent()
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
        total_paid = sum(payment.amount for payment in unit.payments if payment.date.year == year and payment.date.month == month)
        balance = get_total_rent(unit_id) - total_paid
        if balance > 0:
            unit.rent_details.debt += balance
        elif balance < 0:
            unit.rent_details.debt = max(0, unit.rent_details.debt + balance)
        db.session.commit()
        return balance
    return None

def unit_to_json(unit):
    rent_details = unit.rent_details
    return {
        'id': unit.id,
        'property_id': unit.property_id,
        'unit_number': unit.unit_number,
        'is_occupied': unit.is_occupied,
        'rent_status': unit.rent_status,
        'tenant_id': unit.tenant_id,
        'total_rent': get_total_rent(unit.id) if rent_details else None,
        'created_at': unit.created_at,
        'updated_at': unit.updated_at,
        'rent_details': {
            'rent': rent_details.rent if rent_details else 0,
            'trash': rent_details.trash if rent_details else 0,
            'water_sewer': rent_details.water_sewer if rent_details else 0,
            'parking': rent_details.parking if rent_details else 0,
            'debt': rent_details.debt if rent_details else 0,
            'breaks': rent_details.breaks if rent_details else 0,
        } if rent_details else {}
    }