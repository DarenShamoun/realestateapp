from flask import Blueprint, request, jsonify
from services.property_service import (
    add_property_service, 
    get_all_properties_service, 
    get_property_by_id_service, 
    update_property_service, 
    delete_property_service,
    get_property_financial_summary,
    calculate_monthly_income,
    calculate_property_expenses
)

property_bp = Blueprint('property_bp', __name__)

@property_bp.route('/property', methods=['POST'])
def add_property():
    try:
        data = request.json
        response = add_property_service(data)
        return jsonify(response), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property', methods=['GET'])
def get_properties():
    try:
        properties = get_all_properties_service()
        return jsonify(properties), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['GET'])
def get_property(id):
    try:
        property = get_property_by_id_service(id)
        if property:
            return jsonify(property), 200
        return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>/financial-summary', methods=['GET'])
def get_property_financial_summary_route(id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    try:
        summary = get_property_financial_summary(id, year, month)
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:property_id>/monthly-income', methods=['GET'])
def get_monthly_income_route(property_id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    try:
        income = calculate_monthly_income(property_id, year, month)
        return jsonify({'monthly_income': income}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>/expenses', methods=['GET'])
def get_property_expenses_route(id):
    year = request.args.get('year', type=int)
    month = request.args.get('month', type=int)
    try:
        expenses = calculate_property_expenses(id, year, month)
        return jsonify({'expenses': expenses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['PUT'])
def update_property_route(id):
    try:
        data = request.json
        updated_property = update_property_service(id, data)
        if updated_property:
            return jsonify(updated_property), 200
        return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@property_bp.route('/property/<int:id>', methods=['DELETE'])
def delete_property_route(id):
    try:
        if delete_property_service(id):
            return jsonify({'message': 'Property successfully deleted'}), 200
        return jsonify({'message': 'Property not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
