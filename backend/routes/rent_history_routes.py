from flask import Blueprint, jsonify
from services.rent_history_service import get_rent_history_by_unit, rent_history_to_json

rent_history_bp = Blueprint('rent_history_bp', __name__)

@rent_history_bp.route('/rent-history/<int:unit_id>', methods=['GET'])
def get_rent_history(unit_id):
    """Get rent history for a specific unit."""
    histories = get_rent_history_by_unit(unit_id)
    return jsonify([rent_history_to_json(history) for history in histories]), 200
