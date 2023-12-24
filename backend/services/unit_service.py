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
