from flask import Blueprint, request, jsonify
from models import db, Unit

unit_bp = Blueprint('unit_bp', __name__)

@unit_bp.route('/unit', methods=['POST'])
def add_unit():
    data = request.json
    new_unit = Unit(
        property_id=data['property_id'], 
        unit_number=data['unit_number'], 
        rent=data['rent']
    )
    db.session.add(new_unit)
    db.session.commit()
    return jsonify({'message': 'Unit added'}), 201

@unit_bp.route('/unit', methods=['GET'])
def get_units():
    units = Unit.query.all()
    return jsonify([{
        'id': unit.id, 
        'property_id': unit.property_id, 
        'unit_number': unit.unit_number, 
        'rent': unit.rent
    } for unit in units]), 200

@unit_bp.route('/unit/<int:id>', methods=['PUT'])
def update_unit(id):
    unit = Unit.query.get(id)
    if unit:
        data = request.json
        unit.property_id = data['property_id']
        unit.unit_number = data['unit_number']
        unit.rent = data['rent']
        db.session.commit()
        return jsonify({'message': 'Unit updated'}), 200
    else:
        return jsonify({'message': 'Unit not found'}), 404

@unit_bp.route('/unit/<int:id>', methods=['DELETE'])
def delete_unit(id):
    unit = Unit.query.get(id)
    if unit:
        db.session.delete(unit)
        db.session.commit()
        return jsonify({'message': 'Unit deleted'}), 200
    else:
        return jsonify({'message': 'Unit not found'}), 404
