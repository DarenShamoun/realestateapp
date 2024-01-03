from flask import Blueprint, request, jsonify
from services.payment_service import (
    add_payment, 
    get_payments, 
    update_payment, 
    delete_payment, 
    payment_to_json
)
import traceback

payment_bp = Blueprint('payment_bp', __name__)

@payment_bp.route('/payment', methods=['POST'])
def add_payment_route():
    data = request.json
    try:
        payment = add_payment(data)
        return jsonify(payment_to_json(payment)), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment', methods=['GET'])
def get_payments_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        payments = get_payments(filters)
        return jsonify([payment_to_json(payment) for payment in payments]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:payment_id>', methods=['PUT'])
def update_payment_route(payment_id):
    data = request.json
    try:
        payment = update_payment(payment_id, data)
        if payment:
            return jsonify(payment_to_json(payment)), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/payment/<int:payment_id>', methods=['DELETE'])
def delete_payment_route(payment_id):
    try:
        if delete_payment(payment_id):
            return jsonify({'message': 'Payment deleted'}), 200
        else:
            return jsonify({'message': 'Payment not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
