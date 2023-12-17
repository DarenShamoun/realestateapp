from flask import Blueprint, request, jsonify
from models import db, Rent

rent_bp = Blueprint('rent_bp', __name__)

@rent_bp.route('/rent', methods=['POST'])
def add_rent():
    try:
        data = request.json
        new_rent = Rent(
            unit_id=data['unit_id'],
            rent=data['rent'],
            trash=data['trash'],
            water_sewer=data['water_sewer'],
            parking=data['parking'],
            debt=data['debt'],
            breaks=data['breaks']
        )
        db.session.add(new_rent)
        db.session.commit()
        return jsonify({'message': 'Rent details added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
                'breaks': rent.breaks
            }), 200
        else:
            return jsonify({'message': 'Rent details not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rent_bp.route('/rent/<int:id>', methods=['PUT'])
def update_rent(id):
    try:
        rent = Rent.query.get(id)
        if rent:
            data = request.json
            rent.rent = data['rent']
            rent.trash = data['trash']
            rent.water_sewer = data['water_sewer']
            rent.parking = data['parking']
            rent.debt = data['debt']
            rent.breaks = data['breaks']
            db.session.commit()
            return jsonify({'message': 'Rent details updated'}), 200
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
