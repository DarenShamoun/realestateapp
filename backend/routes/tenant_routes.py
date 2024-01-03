from flask import Blueprint, request, jsonify
from services.tenant_service import (
    add_tenant, 
    get_tenants, 
    update_tenant, 
    delete_tenant, 
    tenant_to_json
)
import traceback

tenant_bp = Blueprint('tenant_bp', __name__)

@tenant_bp.route('/tenant', methods=['POST'])
def add_tenant_route():
    data = request.json
    try:
        new_tenant = add_tenant(data)
        return jsonify(tenant_to_json(new_tenant)), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant', methods=['GET'])
def get_tenants_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        tenants = get_tenants(filters)
        return jsonify([tenant_to_json(tenant) for tenant in tenants]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:tenant_id>', methods=['PUT'])
def update_tenant_route(tenant_id):
    data = request.json
    try:
        updated_tenant = update_tenant(tenant_id, data)
        if updated_tenant:
            return jsonify(tenant_to_json(updated_tenant)), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:tenant_id>', methods=['DELETE'])
def delete_tenant_route(tenant_id):
    try:
        if delete_tenant(tenant_id):
            return jsonify({'message': 'Tenant deleted'}), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
