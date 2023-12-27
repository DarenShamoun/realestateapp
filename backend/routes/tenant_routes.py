from flask import Blueprint, request, jsonify
from services.tenant_service import (
    add_tenant, 
    get_all_tenants, 
    get_tenant_by_id, 
    get_tenant_payments, 
    update_tenant, 
    delete_tenant, 
    tenant_to_json
)

tenant_bp = Blueprint('tenant_bp', __name__)

@tenant_bp.route('/tenant', methods=['POST'])
def add_tenant_route():
    data = request.json
    try:
        new_tenant = add_tenant(data)
        return jsonify(tenant_to_json(new_tenant)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant', methods=['GET'])
def get_tenants():
    try:
        tenants = get_all_tenants()
        return jsonify([tenant_to_json(tenant) for tenant in tenants]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['GET'])
def get_tenant(id):
    try:
        tenant = get_tenant_by_id(id)
        if tenant:
            return jsonify(tenant_to_json(tenant)), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@tenant_bp.route('/tenant/<int:tenant_id>/payments', methods=['GET'])
def get_tenant_payment_history(tenant_id):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    try:
        payments = get_tenant_payments(tenant_id, start_date, end_date)
        payment_history = [{'id': payment.id, 'amount': payment.amount, 'date': payment.date.strftime('%Y-%m-%d'), 'payment_method': payment.payment_method} for payment in payments]
        return jsonify(payment_history), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['PUT'])
def update_tenant_route(id):
    data = request.json
    try:
        updated_tenant = update_tenant(id, data)
        if updated_tenant:
            return jsonify({'message': 'Tenant updated'}), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['DELETE'])
def delete_tenant_route(id):
    try:
        if delete_tenant(id):
            return jsonify({'message': 'Tenant deleted'}), 200
        return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
