from flask import Blueprint, jsonify
from models import RentHistory

rent_history_bp = Blueprint('rent_history_bp', __name__)

@rent_history_bp.route('/rent-history/<int:unit_id>', methods=['GET'])
def get_rent_history(unit_id):
    """Get rent history for a specific unit."""
    histories = RentHistory.query.filter_by(unit_id=unit_id).all()
    return jsonify([{
        'id': history.id,
        'unit_id': history.unit_id,
        'old_rent': history.old_rent,
        'new_rent': history.new_rent,
        'change_date': history.change_date.strftime('%Y-%m-%d')
    } for history in histories]), 200
