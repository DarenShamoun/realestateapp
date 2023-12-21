from flask import Blueprint, request, jsonify
from models import db, Unit, Property, Payment

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
    property_id = request.args.get('propertyId')
    tenant_id = request.args.get('tenantId')
    try:
        query = Unit.query
        if property_id:
            query = query.filter_by(property_id=property_id)
        if tenant_id:
            query = query.filter_by(tenant_id=tenant_id)
        units = query.all()
        unit_data = []
        for unit in units:
            rent_details = unit.rent_details
            total_rent = unit.get_total_rent() if rent_details else None
            tenant_info = {
                'id': unit.tenant.id,
                'full_name': unit.tenant.full_name
            } if unit.tenant else None
            unit_data.append({
                'id': unit.id,
                'property_id': unit.property_id,
                'unit_number': unit.unit_number,
                'is_occupied': unit.is_occupied,
                'total_rent': total_rent,
                'tenant': tenant_info,
                'rent_details': {
                    'rent': rent_details.rent if rent_details else 0,
                    'trash': rent_details.trash if rent_details else 0,
                    'water_sewer': rent_details.water_sewer if rent_details else 0,
                    'parking': rent_details.parking if rent_details else 0,
                    'debt': rent_details.debt if rent_details else 0,
                    'breaks': rent_details.breaks if rent_details else 0,
                } if rent_details else {}
            })
        return jsonify(unit_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@unit_bp.route('/unit/<int:id>', methods=['GET'])
def get_unit(id):
    try:
        unit = Unit.query.get(id)
        if unit:
            rent_details = unit.rent_details
            total_rent = unit.get_total_rent() if rent_details else None
            tenant_info = {
                'id': unit.tenant.id,
                'full_name': unit.tenant.full_name
            } if unit.tenant else None
            return jsonify({
                'id': unit.id,
                'property_id': unit.property_id,
                'unit_number': unit.unit_number,
                'is_occupied': unit.is_occupied,
                'total_rent': total_rent,
                'tenant': tenant_info,
                'rent_details': {
                    'rent': rent_details.rent if rent_details else 0,
                    'trash': rent_details.trash if rent_details else 0,
                    'water_sewer': rent_details.water_sewer if rent_details else 0,
                    'parking': rent_details.parking if rent_details else 0,
                    'debt': rent_details.debt if rent_details else 0,
                    'breaks': rent_details.breaks if rent_details else 0,
                } if rent_details else {}
            }), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@unit_bp.route('/unit/<int:id>/financial-summary', methods=['GET'])
def get_unit_financial_summary(id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    try:
        unit = Unit.query.get(id)
        if unit:
            payments_query = Payment.query.filter_by(unit_id=id)
            if year:
                payments_query = payments_query.filter(db.extract('year', Payment.date) == year)
            if month:
                payments_query = payments_query.filter(db.extract('month', Payment.date) == month)
            total_payments = sum(payment.amount for payment in payments_query.all())

            return jsonify({
                'unit_id': id,
                'year': year,
                'month': month,
                'total_payments': total_payments
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
            unit.tenant_id = data.get('tenant_id')
            # Automatically update is_occupied based on tenant presence
            unit.is_occupied = True if unit.tenant_id else False
            db.session.commit()
            return jsonify({'message': 'Unit updated'}), 200
        else:
            return jsonify({'message': 'Unit not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@unit_bp.route('/unit/<int:id>/update_balance', methods=['PUT'])
def update_unit_balance(id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    unit = Unit.query.get(id)
    if unit:
        unit.update_balance(year, month)
        return jsonify({'message': 'Unit balance updated'}), 200
    else:
        return jsonify({'message': 'Unit not found'}), 404

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
