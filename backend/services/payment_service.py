from models import db, Payment, Lease
from datetime import datetime

def add_payment(data):
    new_payment = Payment(
        lease_id=data['lease_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        amount=data['amount'],
        payment_method=data.get('payment_method')
    )
    db.session.add(new_payment)
    db.session.commit()
    return new_payment

def get_payments(filters=None):
    query = Payment.query.join(Lease, Payment.lease_id == Lease.id)

    if filters:
        if 'id' in filters:
            query = query.filter(Payment.id == filters['id'])
        if 'unit_id' in filters:
            query = query.filter(Lease.unit_id == filters['unit_id'])
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
    payment = get_payments(payment_id)
    if payment:
        payment.lease_id = data.get('lease_id', payment.lease_id)
        payment.date = datetime.strptime(data['date'], '%Y-%m-%d') if 'date' in data else payment.date
        payment.amount = data.get('amount', payment.amount)
        payment.payment_method = data.get('payment_method', payment.payment_method)
        db.session.commit()
    return payment

def delete_payment(payment_id):
    payment = get_payments(payment_id)
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
