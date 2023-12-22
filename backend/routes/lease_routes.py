from flask import Blueprint, request, jsonify
from models import db, Lease
from datetime import datetime

lease_bp = Blueprint('lease_bp', __name__)

@lease_bp.route('/lease', methods=['POST'])
def add_lease():
    """
    Add a new lease to the database.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    try:
        data = request.json
        new_lease = Lease(
            unit_id=data['unit_id'],
            tenant_id=data['tenant_id'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d') if data.get('end_date') else None,
            monthly_rent=data['monthly_rent'],
            deposit=data.get('deposit'),
            terms=data.get('terms')
        )
        db.session.add(new_lease)
        db.session.commit()
        return jsonify({'message': 'Lease added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease', methods=['GET'])
def get_leases():
    """
    Get a list of leases from the database.

    Returns:
        A JSON response containing the list of leases.
    """
    unit_id = request.args.get('unitId', type=int)
    tenant_id = request.args.get('tenantId', type=int)

    try:
        query = Lease.query
        if unit_id:
            query = query.filter(Lease.unit_id == unit_id)
        if tenant_id:
            query = query.filter(Lease.tenant_id == tenant_id)

        leases = query.all()
        return jsonify([{
            'id': lease.id,
            'unit_id': lease.unit_id,
            'tenant_id': lease.tenant_id,
            'start_date': lease.start_date.strftime('%Y-%m-%d') if lease.start_date else None,
            'end_date': lease.end_date.strftime('%Y-%m-%d') if lease.end_date else None,
            'monthly_rent': lease.monthly_rent,
            'deposit': lease.deposit,
            'terms': lease.terms
            } for lease in leases]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease/<int:id>', methods=['GET'])
def get_lease(id):
    """
    Get a specific lease from the database.

    Args:
        id (int): The ID of the lease to retrieve.

    Returns:
        A JSON response containing the lease information if found, or a message indicating that the lease was not found.
    """
    try:
        lease = Lease.query.get(id)
        if lease:
            return jsonify({
                'id': lease.id,
                'unit_id': lease.unit_id,
                'tenant_id': lease.tenant_id,
                'start_date': lease.start_date.strftime('%Y-%m-%d') if lease.start_date else None,
                'end_date': lease.end_date.strftime('%Y-%m-%d') if lease.end_date else None,
                'monthly_rent': lease.monthly_rent,
                'deposit': lease.deposit,
                'terms': lease.terms
            }), 200
        else:
            return jsonify({'message': 'Lease not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@lease_bp.route('/lease/<int:id>', methods=['PUT'])
def update_lease(id):
    """
    Update a lease in the database.

    Args:
        id (int): The ID of the lease to update.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    try:
        lease = Lease.query.get(id)
        if lease:
            data = request.json
            lease.unit_id = data['unit_id']
            lease.tenant_id = data['tenant_id']
            lease.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
            lease.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d') if data.get('end_date') else None
            lease.monthly_rent = data['monthly_rent']
            lease.deposit = data.get('deposit')
            lease.terms = data.get('terms')
            db.session.commit()
            return jsonify({'message': 'Lease updated'}), 200
        else:
            return jsonify({'message': 'Lease not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@lease_bp.route('/lease/<int:id>', methods=['DELETE'])
def delete_lease(id):
    """
    Delete a lease from the database.

    Args:
        id (int): The ID of the lease to delete.

    Returns:
        A JSON response indicating the success or failure of the operation.
    """
    try:
        lease = Lease.query.get(id)
        if lease:
            db.session.delete(lease)
            db.session.commit()
            return jsonify({'message': 'Lease deleted'}), 200
        else:
            return jsonify({'message': 'Lease not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
