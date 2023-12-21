from flask import Blueprint, request, jsonify
from models import db, Payment, Rent, Unit
from datetime import datetime
from dateutil.relativedelta import relativedelta

payment_bp = Blueprint('payment_bp', __name__)

@payment_bp.route('/payment', methods=['POST'])
def add_payment():
    try:
        data = request.json
        new_payment = Payment(
            lease_id=data['lease_id'],
            tenant_id=data.get('tenant_id'),
            unit_id=data.get('unit_id'),
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            amount=data['amount'],
            payment_method=data.get('payment_method')
        )
        db.session.add(new_payment)

        # Fetch unit and rent details for the current month
        unit = Unit.query.get(new_payment.unit_id)
        if not unit:
            db.session.rollback()
            return jsonify({'error': 'Unit not found'}), 404

        # Use get_total_rent method to fetch the current total rent
        if unit.rent_details:
            current_month_rent = unit.get_total_rent()
        else:
            # Handle cases where rent details are not available
            current_month_rent = 0

        amount_paid = new_payment.amount
        balance_due = current_month_rent - amount_paid

        # Fetch or create rent details for the next month
        next_month = new_payment.date.replace(day=1) + relativedelta(months=1)
        next_month_rent = Rent.query.filter_by(unit_id=unit.id, date=next_month).first()
        if not next_month_rent:
            next_month_rent = Rent(
                unit_id=unit.id, 
                date=next_month,
                rent=0,
                trash=0,
                water_sewer=0,
                parking=0,
                debt=0,  # Ensure debt is set to 0 by default
                breaks=0
            )
            db.session.add(next_month_rent)

        # Adjust the debt in the next month's rent details
        next_month_rent.debt = max(0, next_month_rent.debt + balance_due)
        db.session.commit()
        return jsonify({'message': 'Payment added', 'id': new_payment.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment', methods=['GET'])
def get_payments():
    unit_id = request.args.get('unitId')
    tenant_id = request.args.get('tenantId')
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    try:
        query = Payment.query
        if unit_id:
            query = query.filter(Payment.unit_id == unit_id)
        if tenant_id:
            query = query.filter(Payment.tenant_id == tenant_id)
        if year:
            query = query.filter(db.extract('year', Payment.date) == year)
        if month:
            query = query.filter(db.extract('month', Payment.date) == month)

        payments = query.all()
        return jsonify([
            {
                'id': payment.id,
                'lease_id': payment.lease_id,
                'tenant_id': payment.tenant_id,
                'unit_id': payment.unit_id,
                'date': payment.date.strftime('%Y-%m-%d'),
                'amount': payment.amount,
                'payment_method': payment.payment_method
            } for payment in payments
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['GET'])
def get_payment(id):
    try:
        payment = Payment.query.get(id)
        if payment:
            return jsonify({
                'id': payment.id,
                'lease_id': payment.lease_id,
                'tenant_id': payment.tenant_id,
                'unit_id': payment.unit_id,
                'date': payment.date.strftime('%Y-%m-%d'),
                'amount': payment.amount,
                'payment_method': payment.payment_method
            }), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['PUT'])
def update_payment(id):
    try:
        payment = Payment.query.get(id)
        if payment:
            data = request.json
            payment.lease_id = data['lease_id']
            payment.tenant_id = data.get('tenant_id', payment.tenant_id)
            payment.unit_id = data.get('unit_id', payment.unit_id)
            payment.date = datetime.strptime(data['date'], '%Y-%m-%d')
            payment.amount = data['amount']
            payment.payment_method = data.get('payment_method', payment.payment_method)
            db.session.commit()
            return jsonify({'message': 'Payment updated'}), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['DELETE'])
def delete_payment(id):
    try:
        payment = Payment.query.get(id)
        if payment:
            db.session.delete(payment)
            db.session.commit()
            return jsonify({'message': 'Payment deleted'}), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
