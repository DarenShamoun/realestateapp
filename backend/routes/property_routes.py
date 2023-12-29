from flask import Blueprint, request, jsonify
from services.property_service import (
    add_property, 
    get_properties, 
    update_property, 
    delete_property,
    property_to_json
)

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    try:
        data = request.json
        new_property = add_property(data)
        return jsonify(property_to_json(new_property)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property', methods=['GET'])
def get_properties_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        properties = get_properties(filters)
        return jsonify([property_to_json(property) for property in properties]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property_route(id):
    try:
        data = request.json
        updated_property = update_property(id, data)
        if updated_property:
            return jsonify(updated_property), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property_route(id):
    try:
        if delete_property(id):
            return jsonify({'message': 'Property successfully deleted'}), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
