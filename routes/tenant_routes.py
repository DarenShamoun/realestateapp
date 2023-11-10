from flask import Blueprint, request, jsonify
from models import db, Tenant

tenant_bp = Blueprint('tenant_bp', __name__)

@tenant_bp.route('/tenant', methods=['POST'])
def add_tenant():
    data = request.json
    new_tenant = Tenant(
        full_name=data['full_name'], 
        primary_phone=data['primary_phone'], 
        secondary_phone=data.get('secondary_phone'),  # .get() used for optional field
        contact_notes=data.get('contact_notes')
    )
    db.session.add(new_tenant)
    db.session.commit()
    return jsonify({'message': 'Tenant added'}), 201

@tenant_bp.route('/tenant', methods=['GET'])
def get_tenants():
    tenants = Tenant.query.all()
    return jsonify([{
        'id': tenant.id, 
        'full_name': tenant.full_name, 
        'primary_phone': tenant.primary_phone, 
        'secondary_phone': tenant.secondary_phone, 
        'contact_notes': tenant.contact_notes
    } for tenant in tenants]), 200

@tenant_bp.route('/tenant/<int:id>', methods=['PUT'])
def update_tenant(id):
    tenant = Tenant.query.get(id)
    if tenant:
        data = request.json
        tenant.full_name = data['full_name']
        tenant.primary_phone = data['primary_phone']
        tenant.secondary_phone = data.get('secondary_phone')
        tenant.contact_notes = data.get('contact_notes')
        db.session.commit()
        return jsonify({'message': 'Tenant updated'}), 200
    else:
        return jsonify({'message': 'Tenant not found'}), 404

@tenant_bp.route('/tenant/<int:id>', methods=['DELETE'])
def delete_tenant(id):
    tenant = Tenant.query.get(id)
    if tenant:
        db.session.delete(tenant)
        db.session.commit()
        return jsonify({'message': 'Tenant deleted'}), 200
    else:
        return jsonify({'message': 'Tenant not found'}), 404
