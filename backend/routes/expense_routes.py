from flask import Blueprint, request, jsonify
from services.expense_service import add_expense, get_expenses, get_expense_by_id, update_expense, delete_expense, expense_to_json

expense_bp = Blueprint('expense_bp', __name__)

@expense_bp.route('/expense', methods=['POST'])
def add_expense_route():
    data = request.json
    try:
        expense = add_expense(data)
        return jsonify(expense_to_json(expense)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense', methods=['GET'])
def get_expenses_route():
    filters = {
        'property_id': request.args.get('propertyId', type=int),
        'unit_id': request.args.get('unitId', type=int),
        'year': request.args.get('year', type=int),
        'month': request.args.get('month', type=int)
    }
    try:
        expenses = get_expenses(filters)
        return jsonify([expense_to_json(expense) for expense in expenses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['GET'])
def get_expense_route(id):
    try:
        expense = get_expense_by_id(id)
        if expense:
            return jsonify(expense_to_json(expense)), 200
        return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['PUT'])
def update_expense_route(id):
    data = request.json
    try:
        expense = update_expense(id, data)
        if expense:
            return jsonify(expense_to_json(expense)), 200
        return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:id>', methods=['DELETE'])
def delete_expense_route(id):
    try:
        if delete_expense(id):
            return jsonify({'message': 'Expense deleted'}), 200
        return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
