from flask import Blueprint, request, jsonify
from models import db, Property

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    try:
        data = request.json
        new_property = Property(
            name=data['name'],
            property_type=data['property_type'],
            address=data['address'],
            purchase_price=data.get('purchase_price'),
            year_built=data.get('year_built'),
            square_footage=data.get('square_footage')
        )
        db.session.add(new_property)
        db.session.commit()
        return jsonify({'message': 'Property added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@property_bp.route('/property', methods=['GET'])
def get_properties():
    try:
        properties = Property.query.all()
        return jsonify([{
            'id': prop.id,
            'name': prop.name,
            'property_type': prop.property_type,
            'address': prop.address,
            'purchase_price': prop.purchase_price,
            'year_built': prop.year_built,
            'square_footage': prop.square_footage
        } for prop in properties]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['GET'])
def get_property(id):
    try:
        property = Property.query.get(id)
        if property:
            return jsonify({
                'id': property.id,
                'name': property.name,
                'property_type': property.property_type,
                'address': property.address,
                'purchase_price': property.purchase_price,
                'year_built': property.year_built,
                'square_footage': property.square_footage
            }), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property(id):
    try:
        property = Property.query.get(id)
        if property:
            data = request.json
            property.name = data['name']
            property.property_type = data['property_type']
            property.address = data['address']
            property.purchase_price = data.get('purchase_price', property.purchase_price)
            property.year_built = data.get('year_built', property.year_built)
            property.square_footage = data.get('square_footage', property.square_footage)
            db.session.commit()
            return jsonify({'message': 'Property updated'}), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property(id):
    try:
        property = Property.query.get(id)
        if property:
            db.session.delete(property)
            db.session.commit()
            return jsonify({'message': 'Property deleted'}), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
