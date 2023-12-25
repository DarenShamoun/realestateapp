from flask import Blueprint, request, jsonify
from services.rent_service import (
    add_rent, 
    get_all_rents, 
    get_rent_by_id, 
    get_recent_rent, 
    get_monthly_rent, 
    update_rent, 
    delete_rent, 
    rent_to_json
)

rent_bp = Blueprint('rent_bp', __name__)

@rent_bp.route('/rent', methods=['POST'])
def add_rent_route():
    data = request.json
    try:
        new_rent = add_rent(data)
        return jsonify(rent_to_json(new_rent)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/all', methods=['GET'])
def get_all_rents_route():
    try:
        rents = get_all_rents()
        return jsonify([rent_to_json(rent) for rent in rents]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:id>', methods=['GET'])
def get_rent_route(id):
    try:
        rent = get_rent_by_id(id)
        if rent:
            return jsonify(rent_to_json(rent)), 200
        return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/recent/<int:unit_id>', methods=['GET'])
def get_recent_rent_route(unit_id):
    try:
        recent_rent = get_recent_rent(unit_id)
        if recent_rent:
            return jsonify(rent_to_json(recent_rent)), 200
        return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/monthly', methods=['GET'])
def get_monthly_rent_route():
    unit_id = request.args.get('unitId', type=int)
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    try:
        rent = get_monthly_rent(unit_id, year, month)
        if rent:
            return jsonify(rent_to_json(rent)), 200
        return jsonify({'message': 'Rent details not found for the specified month'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:id>', methods=['PUT'])
def update_rent_route(id):
    data = request.json
    try:
        updated_rent = update_rent(id, data)
        if updated_rent:
            return jsonify(rent_to_json(updated_rent)), 200
        return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:id>', methods=['DELETE'])
def delete_rent_route(id):
    try:
        if delete_rent(id):
            return jsonify({'message': 'Rent details deleted'}), 200
        return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
