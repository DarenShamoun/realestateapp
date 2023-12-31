from flask import Blueprint, request, jsonify
from services.rent_service import (
    add_rent, 
    get_rents,
    update_rent, 
    delete_rent, 
    rent_to_json
)
import traceback

rent_bp = Blueprint('rent_bp', __name__)

@rent_bp.route('/rent', methods=['POST'])
def add_rent_route():
    data = request.json
    try:
        new_rent = add_rent(data)
        return jsonify(rent_to_json(new_rent)), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
@rent_bp.route('/rent', methods=['GET'])
def get_rents_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        rents = get_rents(filters)
        return jsonify([rent_to_json(rent) for rent in rents]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:rent_id>', methods=['PUT'])
def update_rent_route(rent_id):
    data = request.json
    try:
        updated_rent = update_rent(rent_id, data)
        if updated_rent:
            return jsonify(rent_to_json(updated_rent)), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        traceback.print_exc()        
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:rent_id>', methods=['DELETE'])
def delete_rent_route(rent_id):
    try:
        if delete_rent(rent_id):
            return jsonify({'message': 'Rent details deleted'}), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
