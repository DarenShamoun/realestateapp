from flask import Blueprint, request, jsonify
from services.payment_service import (add_payment, get_payments, get_payment_by_id, update_payment, delete_payment, payment_to_json)

payment_bp = Blueprint('payment_bp', __name__)

@payment_bp.route('/payment', methods=['POST'])
def add_payment_route():
    data = request.json
    try:
        payment = add_payment(data)
        return jsonify(payment_to_json(payment)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment', methods=['GET'])
def get_payments_route():
    filters = {
        'unit_id': request.args.get('unitId', type=int),
        'tenant_id': request.args.get('tenantId', type=int),
        'year': request.args.get('year', type=int),
        'month': request.args.get('month', type=int)
    }
    try:
        payments = get_payments(filters)
        return jsonify([payment_to_json(payment) for payment in payments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['GET'])
def get_payment_route(id):
    try:
        payment = get_payment_by_id(id)
        if payment:
            return jsonify(payment_to_json(payment)), 200
        return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['PUT'])
def update_payment_route(id):
    data = request.json
    try:
        payment = update_payment(id, data)
        if payment:
            return jsonify(payment_to_json(payment)), 200
        return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:id>', methods=['DELETE'])
def delete_payment_route(id):
    try:
        if delete_payment(id):
            return jsonify({'message': 'Payment deleted'}), 200
        return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
