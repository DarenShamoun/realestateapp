from flask import Blueprint, request, jsonify
from models import db, Expense
from datetime import datetime

expense_bp = Blueprint('expense_bp', __name__)

@expense_bp.route('/expense', methods=['POST'])
def add_expense():
    """
    Add a new expense to the database.

    Returns:
        JSON: A JSON response indicating the success or failure of the operation.
    """
    try:
        data = request.json
        new_expense = Expense(
            property_id=data['property_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            amount=data['amount'],
            category=data['category'],
            description=data.get('description', '')
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({'message': 'Expense added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense', methods=['GET'])
def get_expenses():
    """
    Get a list of expenses from the database based on optional filters.

    Returns:
        JSON: A JSON response containing the list of expenses.
    """
    property_id = request.args.get('propertyId')
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)

    try:
        query = Expense.query
        if property_id:
            query = query.filter(Expense.property_id == property_id)
        if year:
            query = query.filter(db.extract('year', Expense.date) == year)
        if month:
            query = query.filter(db.extract('month', Expense.date) == month)

        expenses = query.all()
        return jsonify([
            {
                'id': expense.id,
                'property_id': expense.property_id,
                'date': expense.date.strftime('%Y-%m-%d'),
                'amount': expense.amount,
                'category': expense.category,
                'description': expense.description
            } for expense in expenses
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['GET'])
def get_expense(id):
    """
    Get a single expense from the database by its ID.

    Args:
        id (int): The ID of the expense.

    Returns:
        JSON: A JSON response containing the expense details.
    """
    try:
        expense = Expense.query.get(id)
        if expense:
            return jsonify({
                'id': expense.id,
                'property_id': expense.property_id,
                'date': expense.date.strftime('%Y-%m-%d'),
                'amount': expense.amount,
                'category': expense.category,
                'description': expense.description
            }), 200
        else:
            return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['PUT'])
def update_expense(id):
    """
    Update an existing expense in the database.

    Args:
        id (int): The ID of the expense to be updated.

    Returns:
        JSON: A JSON response indicating the success or failure of the operation.
    """
    try:
        expense = Expense.query.get(id)
        if expense:
            data = request.json
            expense.property_id = data['property_id']
            expense.date = datetime.strptime(data['date'], '%Y-%m-%d')
            expense.amount = data['amount']
            expense.category = data['category']
            expense.description = data.get('description', '')
            db.session.commit()
            return jsonify({'message': 'Expense updated'}), 200
        else:
            return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['DELETE'])
def delete_expense(id):
    """
    Delete an expense from the database.

    Args:
        id (int): The ID of the expense to be deleted.

    Returns:
        JSON: A JSON response indicating the success or failure of the operation.
    """
    try:
        expense = Expense.query.get(id)
        if expense:
            db.session.delete(expense)
            db.session.commit()
            return jsonify({'message': 'Expense deleted'}), 200
        else:
            return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
