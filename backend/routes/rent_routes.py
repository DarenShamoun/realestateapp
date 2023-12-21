from flask import Blueprint, request, jsonify
from models import db, Rent, Unit, Property
from datetime import datetime
import sqlalchemy as sa

rent_bp = Blueprint('rent_bp', __name__)

@rent_bp.route('/rent', methods=['POST'])
def add_rent():
    try:
        data = request.json
        rent_date = datetime.strptime(data['date'], '%Y-%m-%d') if 'date' in data else datetime.utcnow()
        new_rent = Rent(
            unit_id=data['unit_id'],
            rent=data['rent'],
            trash=data['trash'],
            water_sewer=data['water_sewer'],
            parking=data['parking'],
            debt=data['debt'],
            breaks=data['breaks'],
            date=rent_date
        )
        db.session.add(new_rent)
        db.session.commit()
        return jsonify({'message': 'Rent details added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@rent_bp.route('/rent/by-date', methods=['GET'])
def get_rent_by_date():
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    day = request.args.get('day', type=int)
    unit_id = request.args.get('unitId', type=int)
    property_id = request.args.get('propertyId', type=int)

    if not year:
        return jsonify({'error': 'Year is required'}), 400

    try:
        query = Rent.query

        if unit_id:
            query = query.join(Unit, Rent.unit_id == Unit.id).filter(Unit.id == unit_id)
        elif property_id:
            query = query.join(Unit, Rent.unit_id == Unit.id).join(Property, Unit.property_id == Property.id).filter(Property.id == property_id)

        if month:
            query = query.filter(sa.extract('month', Rent.date) == month)
        if day:
            query = query.filter(sa.extract('day', Rent.date) == day)

        query = query.filter(sa.extract('year', Rent.date) == year)
        rent_records = query.all()

        if not rent_records:
            return jsonify({'message': 'No rent details found for the specified criteria'}), 404

        return jsonify([
            {
                'id': rent.id,
                'unit_id': rent.unit_id,
                'property_id': rent.unit.property_id if rent.unit else None,
                'rent': rent.rent,
                'trash': rent.trash,
                'water_sewer': rent.water_sewer,
                'parking': rent.parking,
                'debt': rent.debt,
                'breaks': rent.breaks,
                'date': rent.date.strftime('%Y-%m-%d')
            } for rent in rent_records
        ]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@rent_bp.route('/rent/all', methods=['GET'])
def get_all_rents():
    rents = Rent.query.all()
    rent_list = [{
        'id': rent.id,
        'unit_id': rent.unit_id,
        'rent': rent.rent,
        'trash': rent.trash,
        'water_sewer': rent.water_sewer,
        'parking': rent.parking,
        'debt': rent.debt,
        'breaks': rent.breaks,
        'date': rent.date.strftime('%Y-%m-%d')
    } for rent in rents]
    return jsonify(rent_list), 200

@rent_bp.route('/rent/<int:id>', methods=['GET'])
def get_rent(id):
    try:
        rent = Rent.query.get(id)
        if rent:
            return jsonify({
                'id': rent.id,
                'unit_id': rent.unit_id,
                'rent': rent.rent,
                'trash': rent.trash,
                'water_sewer': rent.water_sewer,
                'parking': rent.parking,
                'debt': rent.debt,
                'breaks': rent.breaks,
                'date': rent.date.strftime('%Y-%m-%d')  # Format the date as desired
            }), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@rent_bp.route('/rent/monthly', methods=['GET'])
def get_monthly_rent():
    unit_id = request.args.get('unitId', type=int)
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    if not all([unit_id, year, month]):
        return jsonify({'error': 'Unit ID, year, and month are required'}), 400

    rent = Rent.query.filter_by(unit_id=unit_id).filter(db.extract('year', Rent.date) == year, db.extract('month', Rent.date) == month).first()
    
    if rent:
        return jsonify({
            'id': rent.id,
            'unit_id': rent.unit_id,
            'rent': rent.rent,
            'trash': rent.trash,
            'water_sewer': rent.water_sewer,
            'parking': rent.parking,
            'debt': rent.debt,
            'breaks': rent.breaks,
            'date': rent.date.strftime('%Y-%m')
        }), 200
    else:
        return jsonify({'message': 'Rent details not found for the specified month'}), 404

@rent_bp.route('/rent/<int:id>', methods=['PUT'])
def update_rent(id):
    try:
        rent = Rent.query.get(id)
        if not rent:
            return jsonify({'message': 'Rent details not found'}), 404

        data = request.json
        if 'date' in data:
            rent.date = datetime.strptime(data['date'], '%Y-%m-%d')

        rent.rent = data.get('rent', rent.rent)
        rent.trash = data.get('trash', rent.trash)
        rent.water_sewer = data.get('water_sewer', rent.water_sewer)
        rent.parking = data.get('parking', rent.parking)
        rent.debt = data.get('debt', rent.debt)
        rent.breaks = data.get('breaks', rent.breaks)

        db.session.commit()
        return jsonify({'message': 'Rent details updated'}), 200
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
