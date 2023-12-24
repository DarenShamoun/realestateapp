from flask import Blueprint, request, jsonify
from models import db, Rent, Unit, Property
from datetime import datetime
import sqlalchemy as sa
from services.rent_service import add_rent, update_rent


rent_bp = Blueprint('rent_bp', __name__)

def rent_to_json(rent):
    return {
        'id': rent.id,
        'unit_id': rent.unit_id,
        'rent': rent.rent,
        'trash': rent.trash,
        'water_sewer': rent.water_sewer,
        'parking': rent.parking,
        'debt': rent.debt,
        'breaks': rent.breaks,
        'date': rent.date.strftime('%Y-%m-%d')
    }

@rent_bp.route('/rent', methods=['POST'])
def add_rent_route():
    try:
        data = request.json
        new_rent = add_rent(data)
        return jsonify(rent_to_json(new_rent)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/all', methods=['GET'])
def get_all_rents():
    """
    Get all rent details.
    """
    rents = Rent.query.all()
    return jsonify([rent_to_json(rent) for rent in rents]), 200

@rent_bp.route('/rent/<int:id>', methods=['GET'])
def get_rent(id):
    try:
        rent = Rent.query.get(id)
        if rent:
            return jsonify(rent_to_json(rent)), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@rent_bp.route('/rent/recent/<int:unit_id>', methods=['GET'])
def get_recent_rent(unit_id):
    """
    Get the most recent rent details for a specific unit.
    """
    recent_rent = Rent.query.filter_by(unit_id=unit_id).order_by(Rent.date.desc()).first()
    if recent_rent:
        return jsonify(rent_to_json(recent_rent)), 200
    else:
        return jsonify({'message': 'Rent details not found'}), 404
    
@rent_bp.route('/rent/monthly', methods=['GET'])
def get_monthly_rent():
    """
    Get the monthly rent details for a specific unit.
    """
    unit_id = request.args.get('unitId', type=int)
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    if not all([unit_id, year, month]):
        return jsonify({'error': 'Unit ID, year, and month are required'}), 400

    rent = Rent.query.filter_by(unit_id=unit_id).filter(
        db.extract('year', Rent.date) == year, 
        db.extract('month', Rent.date) == month
    ).first()

    if rent:
        return jsonify(rent_to_json(rent)), 200
    else:
        return jsonify({'message': 'Rent details not found for the specified month'}), 404

@rent_bp.route('/rent/<int:id>', methods=['PUT'])
def update_rent_route(id):
    try:
        data = request.json
        updated_rent = update_rent(id, data)
        if updated_rent:
            return jsonify(rent_to_json(updated_rent)), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:id>', methods=['DELETE'])
def delete_rent(id):
    try:
        rent = Rent.query.get(id)
        if rent:
            db.session.delete(rent)
            db.session.commit()
            return jsonify({'message': 'Rent details deleted'}), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
