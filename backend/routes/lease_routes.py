from flask import Blueprint, request, jsonify
from services.lease_service import (
    add_lease, 
    get_leases, 
    update_lease, 
    delete_lease, 
    lease_to_json
)

lease_bp = Blueprint('lease_bp', __name__)

@lease_bp.route('/lease', methods=['POST'])
def add_lease_route():
    data = request.json
    try:
        lease = add_lease(data)
        return jsonify(lease_to_json(lease)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease', methods=['GET'])
def get_leases_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        leases = get_leases(filters)
        return jsonify([lease_to_json(lease) for lease in leases]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease/<int:lease_id>', methods=['PUT'])
def update_lease_route(lease_id):
    data = request.json
    try:
        lease = update_lease(lease_id, data)
        if lease:
            return jsonify(lease_to_json(lease)), 200
        else:
            return jsonify({'message': 'Lease not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease/<int:lease_id>', methods=['DELETE'])
def delete_lease_route(lease_id):
    try:
        if delete_lease(lease_id):
            return jsonify({'message': 'Lease deleted'}), 200
        else:
            return jsonify({'message': 'Lease not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
