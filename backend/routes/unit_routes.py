from flask import Blueprint, request, jsonify
from services.unit_service import (
    add_unit, 
    get_units, 
    update_unit, 
    delete_unit, 
    unit_to_json
)

unit_bp = Blueprint('unit_bp', __name__)

@unit_bp.route('/unit', methods=['POST'])
def add_unit_route():
    data = request.json
    try:
        new_unit = add_unit(data)
        return jsonify(unit_to_json(new_unit)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit', methods=['GET'])
def get_units_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        units = get_units(filters)
        return jsonify([unit_to_json(unit) for unit in units]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:unit_id>', methods=['PUT'])
def update_unit_route(unit_id):
    data = request.json
    try:
        updated_unit = update_unit(unit_id, data)
        if updated_unit:
            return jsonify(unit_to_json(updated_unit)), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:unit_id>', methods=['DELETE'])
def delete_unit_route(unit_id):
    try:
        if delete_unit(unit_id):
            return jsonify({'message': 'Unit deleted'}), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
