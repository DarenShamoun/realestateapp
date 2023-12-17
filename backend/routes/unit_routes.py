from flask import Blueprint, request, jsonify
from models import db, Unit, Property

unit_bp = Blueprint('unit_bp', __name__)

@unit_bp.route('/unit', methods=['POST'])
def add_unit():
    try:
        data = request.json
        # Validate if the property exists
        if not Property.query.get(data['property_id']):
            return jsonify({'message': 'Property not found'}), 404

        new_unit = Unit(
            property_id=data['property_id'], 
            unit_number=data['unit_number'], 
            is_occupied=data.get('is_occupied', False)  # Default to False if not provided
        )
        db.session.add(new_unit)
        db.session.commit()
        return jsonify({'message': 'Unit added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit', methods=['GET'])
def get_units():
    try:
        units = Unit.query.all()
        return jsonify([{
            'id': unit.id, 
            'property_id': unit.property_id, 
            'unit_number': unit.unit_number, 
            'is_occupied': unit.is_occupied  # Updated to include is_occupied
        } for unit in units]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>', methods=['GET'])
def get_unit(id):
    try:
        unit = Unit.query.get(id)
        if unit:
            return jsonify({
                'id': unit.id,
                'property_id': unit.property_id, 
                'unit_number': unit.unit_number, 
                'is_occupied': unit.is_occupied  # Updated to include is_occupied
            }), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>', methods=['PUT'])
def update_unit(id):
    try:
        unit = Unit.query.get(id)
        if unit:
            data = request.json
            unit.property_id = data['property_id']
            unit.unit_number = data['unit_number']
            unit.is_occupied = data.get('is_occupied', unit.is_occupied)  # Update is_occupied, keeping current value if not provided
            db.session.commit()
            return jsonify({'message': 'Unit updated'}), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>', methods=['DELETE'])
def delete_unit(id):
    try:
        unit = Unit.query.get(id)
        if unit:
            db.session.delete(unit)
            db.session.commit()
            return jsonify({'message': 'Unit deleted'}), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
