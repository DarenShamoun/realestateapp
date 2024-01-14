from models import db, Payment, Lease, Unit, Property
from datetime import datetime

def add_payment(data):
    new_payment = Payment(**data)
    db.session.add(new_payment)
    db.session.commit()
    return new_payment

def get_payments(filters=None):
    query = Payment.query.join(Lease, Payment.lease_id == Lease.id)\
        .join(Unit, Lease.unit_id == Unit.id)\
        .join(Property, Unit.property_id == Property.id)

    if filters:
        if 'payment_id' in filters:
            query = query.filter(Payment.id == filters['payment_id'])
        if 'lease_id' in filters:
            query = query.filter(Payment.lease_id == filters['lease_id'])
        if 'unit_id' in filters:
            query = query.filter(Lease.unit_id == filters['unit_id'])
        if 'property_id' in filters:
            query = query.filter(Property.id == filters['property_id'])
        if 'tenant_id' in filters:
            query = query.filter(Lease.tenant_id == filters['tenant_id'])
        if 'year' in filters:
            query = query.filter(db.extract('year', Payment.date) == filters['year'])
        if 'month' in filters:
            query = query.filter(db.extract('month', Payment.date) == filters['month'])
        if 'start_date' in filters:
            start_date = datetime.strptime(filters['start_date'], '%Y-%m-%d')
            query = query.filter(Payment.date >= start_date)
        if 'end_date' in filters:
            end_date = datetime.strptime(filters['end_date'], '%Y-%m-%d')
            query = query.filter(Payment.date <= end_date)

    return query.all()

def update_payment(payment_id, data):
    payment = Payment.query.get(payment_id)
    if not payment:
        return None
    
    for key, value in data.items():
        setattr(payment, key, value)

    db.session.commit()
    return payment

def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if payment:
        db.session.delete(payment)
        db.session.commit()
        return True
    return False

def payment_to_json(payment):
    return {
        'id': payment.id,
        'lease_id': payment.lease_id,
        'date': payment.date.strftime('%Y-%m-%d'),
        'amount': payment.amount,
        'payment_method': payment.payment_method,
        'created_at': payment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': payment.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
