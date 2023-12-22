from flask import Blueprint, request, jsonify
from models import db, Property, Expense

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    """
    Add a new property to the database.

    Returns:
        A JSON response indicating the success or failure of the operation.
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

    Returns:
        A JSON response containing a list of properties.
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

    Args:
        id (int): The ID of the property.

    Returns:
        A JSON response containing the property information if found, or an error message if not found.
    """
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
    
@property_bp.route('/property/<int:id>/financial-summary', methods=['GET'])
def get_property_financial_summary(id):
    """
    Get the financial summary of a property for a specific year and month.

    Args:
        id (int): The ID of the property.

    Returns:
        A JSON response containing the financial summary information if the property is found, or an error message if not found.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    try:
        property = Property.query.get(id)
        if property:
            total_income = property.calculate_monthly_income(year, month) if year and month else None
            expenses_query = Expense.query.filter_by(property_id=id)
            if year:
                expenses_query = expenses_query.filter(db.extract('year', Expense.date) == year)
            if month:
                expenses_query = expenses_query.filter(db.extract('month', Expense.date) == month)
            total_expenses = sum(expense.amount for expense in expenses_query.all())

            return jsonify({
                'property_id': id,
                'year': year,
                'month': month,
                'total_income': total_income,
                'total_expenses': total_expenses
            }), 200
        else:
            return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@property_bp.route('/property/<int:property_id>/monthly-income', methods=['GET'])
def get_monthly_income(property_id):
    """
    Get the monthly income of a property for a specific year and month.

    Args:
        property_id (int): The ID of the property.

    Returns:
        A JSON response containing the monthly income information if the property is found, or an error message if not found.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    if not year or not month:
        return jsonify({'error': 'Year and month query parameters are required.'}), 400
    property = Property.query.get(property_id)
    if property:
        total_income = property.calculate_monthly_income(year, month)
        return jsonify({'monthly_income': total_income}), 200
    else:
        return jsonify({'message': 'Property not found'}), 404
    
@property_bp.route('/property/<int:id>/expenses', methods=['GET'])
def get_property_expenses(id):
    """
    Get the total expenses of a property for a specific year and month.

    Args:
        id (int): The ID of the property.

    Returns:
        A JSON response containing the total expenses information if the property is found, or an error message if not found.
    """
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    expenses = Expense.query.filter_by(property_id=id)
    expenses = expenses.filter(db.extract('year', Expense.date) == year,
                               db.extract('month', Expense.date) == month).all()
    total_expenses = sum(expense.amount for expense in expenses)
    return jsonify({'property_id': id, 'year': year, 'month': month, 'expenses': total_expenses}), 200

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property(id):
    """
    Update a property in the database.

    Args:
        id (int): The ID of the property.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
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
    """
    Delete a property from the database.

    Args:
        id (int): The ID of the property.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
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
