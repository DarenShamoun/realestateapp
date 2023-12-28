from flask import Blueprint, jsonify
from services.rent_history_service import (
    get_rent_history_by_unit, 
    delete_rent_history, 
    rent_history_to_json
)

rent_history_bp = Blueprint('rent_history_bp', __name__)

@rent_history_bp.route('/rent-history/<int:unit_id>', methods=['GET'])
def get_rent_history(unit_id):
    """Get rent history for a specific unit."""
    histories = get_rent_history_by_unit(unit_id)
    return jsonify([rent_history_to_json(history) for history in histories]), 200

@rent_history_bp.route('/rent-history/<int:id>', methods=['DELETE'])
def delete_rent_history_route(id):
    """Delete a specific rent history record."""
    result = delete_rent_history(id)
    if result:
        return jsonify({'message': 'Rent history deleted successfully'}), 200
    else:
        return jsonify({'error': 'Rent history not found'}), 404
