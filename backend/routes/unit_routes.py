from flask import Blueprint, request, jsonify
from models import db, Unit, Property
from services.unit_service import get_total_rent, calculate_balance, update_balance, unit_to_json

unit_bp = Blueprint('unit_bp', __name__)

@unit_bp.route('/unit', methods=['POST'])
def add_unit():
    try:
        data = request.json
        if not Property.query.get(data['property_id']):
            return jsonify({'message': 'Property not found'}), 404
        new_unit = Unit(property_id=data['property_id'], unit_number=data['unit_number'], is_occupied=data.get('is_occupied', False))
        db.session.add(new_unit)
        db.session.commit()
        return jsonify({'message': 'Unit added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit', methods=['GET'])
def get_units():
    try:
        property_id = request.args.get('propertyId')
        tenant_id = request.args.get('tenantId')
        query = Unit.query
        if property_id:
            query = query.filter_by(property_id=property_id)
        if tenant_id:
            query = query.filter_by(tenant_id=tenant_id)
        units = query.all()
        return jsonify([unit_to_json(unit) for unit in units]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>', methods=['GET'])
def get_unit(id):
    try:
        unit = Unit.query.get(id)
        if unit:
            return jsonify(unit_to_json(unit)), 200
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
            unit.property_id = data.get('property_id', unit.property_id)
            unit.unit_number = data.get('unit_number', unit.unit_number)
            unit.tenant_id = data.get('tenant_id', unit.tenant_id)
            unit.is_occupied = data.get('is_occupied', unit.is_occupied)
            unit.rent_status = data.get('rent_status', unit.rent_status)
            db.session.commit()
            return jsonify(unit_to_json(unit)), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>/update_balance', methods=['PUT'])
def update_unit_balance(id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    balance = update_balance(id, year, month)
    if balance is not None:
        return jsonify({'message': 'Unit balance updated', 'balance': balance}), 200
    else:
        return jsonify({'message': 'Unit not found or invalid date'}), 404

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
