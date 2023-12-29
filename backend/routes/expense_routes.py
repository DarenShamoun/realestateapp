from flask import Blueprint, request, jsonify
from services.expense_service import (
    add_expense, 
    get_expenses,
    update_expense, 
    delete_expense, 
    expense_to_json
)

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
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        expenses = get_expenses(filters)
        return jsonify([expense_to_json(expense) for expense in expenses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:expense_id>', methods=['PUT'])
def update_expense_route(expense_id):
    data = request.json
    try:
        expense = update_expense(expense_id, data)
        if expense:
            return jsonify(expense_to_json(expense)), 200
        else:
            return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@expense_bp.route('/expense/<int:expense_id>', methods=['DELETE'])
def delete_expense_route(expense_id):
    try:
        if delete_expense(expense_id):
            return jsonify({'message': 'Expense deleted'}), 200
        else:
            return jsonify({'message': 'Expense not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
