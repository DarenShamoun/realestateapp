from flask import Blueprint, request, jsonify
from services.property_service import (
    add_property_service, 
    get_properties, 
    update_property_service, 
    delete_property_service
)

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    try:
        data = request.json
        response = add_property_service(data)
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property', methods=['GET'])
def get_properties_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        properties = get_properties(filters)
        return jsonify(properties), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property_route(id):
    try:
        data = request.json
        updated_property = update_property_service(id, data)
        if updated_property:
            return jsonify(updated_property), 200
        return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property_route(id):
    try:
        if delete_property_service(id):
            return jsonify({'message': 'Property successfully deleted'}), 200
        return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
