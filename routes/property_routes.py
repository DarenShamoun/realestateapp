from flask import Blueprint, request, jsonify
from models import db, Property

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    data = request.json
    new_property = Property(name=data['name'], property_type=data['property_type'])
    db.session.add(new_property)
    db.session.commit()
    return jsonify({'message': 'Property added'}), 201

@property_bp.route('/property', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return jsonify([{'id': prop.id, 'name': prop.name, 'type': prop.property_type} for prop in properties]), 200

@property_bp.route('/property/<int:id>', methods=['GET'])
def get_property(id):
    property = Property.query.get(id)
    if property:
        return jsonify({
            'id': property.id,
            'name': property.name,
            'property_type': property.property_type
        }), 200
    else:
        return jsonify({'message': 'Property not found'}), 404

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property(id):
    property = Property.query.get(id)
    if property:
        data = request.json
        property.name = data['name']
        property.property_type = data['property_type']
        db.session.commit()
        return jsonify({'message': 'Property updated'}), 200
    else:
        return jsonify({'message': 'Property not found'}), 404

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property(id):
    property = Property.query.get(id)
    if property:
        db.session.delete(property)
        db.session.commit()
        return jsonify({'message': 'Property deleted'}), 200
    else:
        return jsonify({'message': 'Property not found'}), 404
