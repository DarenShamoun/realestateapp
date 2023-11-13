from flask import Blueprint, request, jsonify
from models import db, Lease
from datetime import datetime

lease_bp = Blueprint('lease_bp', __name__)

@lease_bp.route('/lease', methods=['POST'])
def add_lease():
    data = request.json
    new_lease = Lease(
        unit_id=data['unit_id'],
        tenant_id=data['tenant_id'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d'),
        monthly_rent=data['monthly_rent'],
        deposit=data.get('deposit'),
        terms=data.get('terms')
    )
    db.session.add(new_lease)
    db.session.commit()
    return jsonify({'message': 'Lease added'}), 201

@lease_bp.route('/lease', methods=['GET'])
def get_leases():
    leases = Lease.query.all()
    return jsonify([{
        'id': lease.id,
        'unit_id': lease.unit_id,
        'tenant_id': lease.tenant_id,
        'start_date': lease.start_date.strftime('%Y-%m-%d'),
        'end_date': lease.end_date.strftime('%Y-%m-%d'),
        'monthly_rent': lease.monthly_rent,
        'deposit': lease.deposit,
        'terms': lease.terms
    } for lease in leases]), 200

@lease_bp.route('/lease/<int:id>', methods=['GET'])
def get_lease(id):
    lease = Lease.query.get(id)
    if lease:
        return jsonify({
            'id': lease.id,
            'unit_id': lease.unit_id,
            'tenant_id': lease.tenant_id,
            'start_date': lease.start_date.strftime('%Y-%m-%d'),
            'end_date': lease.end_date.strftime('%Y-%m-%d'),
            'monthly_rent': lease.monthly_rent,
            'deposit': lease.deposit,
            'terms': lease.terms
        }), 200
    else:
        return jsonify({'message': 'Lease not found'}), 404

@lease_bp.route('/lease/<int:id>', methods=['PUT'])
def update_lease(id):
    lease = Lease.query.get(id)
    if lease:
        data = request.json
        lease.unit_id = data['unit_id']
        lease.tenant_id = data['tenant_id']
        lease.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
        lease.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
        lease.monthly_rent = data['monthly_rent']
        lease.deposit = data.get('deposit')
        lease.terms = data.get('terms')
        db.session.commit()
        return jsonify({'message': 'Lease updated'}), 200
    else:
        return jsonify({'message': 'Lease not found'}), 404

@lease_bp.route('/lease/<int:id>', methods=['DELETE'])
def delete_lease(id):
    lease = Lease.query.get(id)
    if lease:
        db.session.delete(lease)
        db.session.commit()
        return jsonify({'message': 'Lease deleted'}), 200
    else:
        return jsonify({'message': 'Lease not found'}), 404