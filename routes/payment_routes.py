from flask import Blueprint, request, jsonify
from models import db, Payment
from datetime import datetime

payment_bp = Blueprint('payment_bp', __name__)

@payment_bp.route('/payment', methods=['POST'])
def add_payment():
    data = request.json
    new_payment = Payment(
        lease_id=data['lease_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        amount=data['amount'],
        payment_type=data['payment_type']
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({'message': 'Payment added'}), 201

@payment_bp.route('/payment', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify([{
        'id': payment.id,
        'lease_id': payment.lease_id,
        'date': payment.date.strftime('%Y-%m-%d'),
        'amount': payment.amount,
        'payment_type': payment.payment_type
    } for payment in payments]), 200

@payment_bp.route('/payment/<int:id>', methods=['PUT'])
def update_payment(id):
    payment = Payment.query.get(id)
    if payment:
        data = request.json
        payment.lease_id = data['lease_id']
        payment.date = datetime.strptime(data['date'], '%Y-%m-%d')
        payment.amount = data['amount']
        payment.payment_type = data['payment_type']
        db.session.commit()
        return jsonify({'message': 'Payment updated'}), 200
    else:
        return jsonify({'message': 'Payment not found'}), 404

@payment_bp.route('/payment/<int:id>', methods=['DELETE'])
def delete_payment(id):
    payment = Payment.query.get(id)
    if payment:
        db.session.delete(payment)
        db.session.commit()
        return jsonify({'message': 'Payment deleted'}), 200
    else:
        return jsonify({'message': 'Payment not found'}), 404
