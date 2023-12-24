from flask import Blueprint, request, jsonify
from models import db, Property, Expense
from services.property_service import calculate_monthly_income, get_property_financial_summary, calculate_property_expenses

property_bp = Blueprint('property_bp', __name__)

def property_to_json(property):
    """
    Converts a Property object to a JSON representation.
    """
    return {
        'id': property.id,
        'name': property.name,
        'property_type': property.property_type,
        'address': property.address,
        'purchase_price': property.purchase_price,
        'year_built': property.year_built,
        'square_footage': property.square_footage
    }

@property_bp.route('/property', methods=['POST'])
def add_property():
    """
    Add a new property to the database.
    """
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
    """
    Get all properties from the database.
    """
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
    """
    Get a specific property from the database.
    """
    try:
        property = Property.query.get(id)
        if property:
            return jsonify(property_to_json(property)), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@property_bp.route('/property/<int:id>/financial-summary', methods=['GET'])
def get_property_financial_summary_route(id):
    """
    Get the financial summary of a property for a specific year and month.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    
    try:
        summary = get_property_financial_summary(id, year, month)
        if summary:
            return jsonify(summary), 200
        else:
            return jsonify({'message': 'Property financial summary not found or error in calculation'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@property_bp.route('/property/<int:property_id>/monthly-income', methods=['GET'])
def get_monthly_income_route(property_id):
    """
    Get the monthly income of a property for a specific year and month.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    if not year or not month:
        return jsonify({'error': 'Year and month query parameters are required.'}), 400

    try:
        total_income = calculate_monthly_income(property_id, year, month)
        return jsonify({'monthly_income': total_income}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@property_bp.route('/property/<int:id>/expenses', methods=['GET'])
def get_property_expenses(id):
    """
    Get the total expenses of a property for a specific year and month.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    try:
        total_expenses = calculate_property_expenses(id, year, month)
        if total_expenses is not None:
            return jsonify({'property_id': id, 'year': year, 'month': month, 'expenses': total_expenses}), 200
        else:
            return jsonify({'message': 'Error calculating expenses or property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property(id):
    """
    Update a property with the given ID.
    """
    try:
        property = Property.query.get(id)
        if property:
            data = request.json
            property.name = data.get('name', property.name)
            property.property_type = data.get('property_type', property.property_type)
            property.address = data.get('address', property.address)
            property.purchase_price = data.get('purchase_price', property.purchase_price)
            property.year_built = data.get('year_built', property.year_built)
            property.square_footage = data.get('square_footage', property.square_footage)
            db.session.commit()
            return jsonify(property_to_json(property)), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property(id):
    """
    Delete a property with the given ID.
    """
    try:
        property = Property.query.get(id)
        if property:
            db.session.delete(property)
            db.session.commit()
            return '', 204
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
