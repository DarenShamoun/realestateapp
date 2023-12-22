from flask import Blueprint, request, jsonify
from models import db, Tenant, Payment
from sqlalchemy import desc

tenant_bp = Blueprint('tenant_bp', __name__)

@tenant_bp.route('/tenant', methods=['POST'])
def add_tenant():
    """
    Add a new tenant to the database.

    Returns:
        A JSON response with a success message and HTTP status code 201 if the tenant is added successfully.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
        data = request.json
        new_tenant = Tenant(
            full_name=data['full_name'], 
            primary_phone=data['primary_phone'], 
            secondary_phone=data.get('secondary_phone'),
            contact_notes=data.get('contact_notes')
        )
        db.session.add(new_tenant)
        db.session.commit()
        return jsonify({'message': 'Tenant added'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant', methods=['GET'])
def get_tenants():
    """
    Get all tenants from the database.

    Returns:
        A JSON response with a list of tenant objects and HTTP status code 200 if successful.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
        tenants = Tenant.query.all()
        return jsonify([{
            'id': tenant.id, 
            'full_name': tenant.full_name, 
            'primary_phone': tenant.primary_phone, 
            'secondary_phone': tenant.secondary_phone, 
            'contact_notes': tenant.contact_notes
        } for tenant in tenants]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['GET'])
def get_tenant(id):
    """
    Get a specific tenant from the database by ID.

    Args:
        id (int): The ID of the tenant.

    Returns:
        A JSON response with the tenant object and HTTP status code 200 if the tenant is found.
        A JSON response with a message indicating the tenant is not found and HTTP status code 404 if the tenant is not found.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
        tenant = Tenant.query.get(id)
        if tenant:
            return jsonify({
                'id': tenant.id,
                'full_name': tenant.full_name, 
                'primary_phone': tenant.primary_phone, 
                'secondary_phone': tenant.secondary_phone, 
                'contact_notes': tenant.contact_notes
            }), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@tenant_bp.route('/tenant/<int:tenant_id>/payments', methods=['GET'])
def get_tenant_payments(tenant_id):
    """
    Get the payment history of a specific tenant from the database.

    Args:
        tenant_id (int): The ID of the tenant.

    Returns:
        A JSON response with the payment history of the tenant and HTTP status code 200 if the tenant is found.
        A JSON response with a message indicating the tenant is not found and HTTP status code 404 if the tenant is not found.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
        tenant = Tenant.query.get(tenant_id)
        if tenant:
            payments = Payment.query.filter_by(tenant_id=tenant_id).order_by(desc(Payment.date)).all()
            payment_history = [{
                'payment_id': payment.id,
                'lease_id': payment.lease_id,
                'unit_id': payment.unit_id,
                'amount': payment.amount,
                'date': payment.date.strftime('%Y-%m-%d'),
                'payment_method': payment.payment_method
            } for payment in payments]

            return jsonify(payment_history), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['PUT'])
def update_tenant(id):
    """
    Update a specific tenant in the database.

    Args:
        id (int): The ID of the tenant.

    Returns:
        A JSON response with a success message and HTTP status code 200 if the tenant is updated successfully.
        A JSON response with a message indicating the tenant is not found and HTTP status code 404 if the tenant is not found.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tenant_bp.route('/tenant/<int:id>', methods=['DELETE'])
def delete_tenant(id):
    """
    Delete a specific tenant from the database.

    Args:
        id (int): The ID of the tenant.

    Returns:
        A JSON response with a success message and HTTP status code 200 if the tenant is deleted successfully.
        A JSON response with a message indicating the tenant is not found and HTTP status code 404 if the tenant is not found.
        A JSON response with an error message and HTTP status code 500 if an error occurs.
    """
    try:
        tenant = Tenant.query.get(id)
        if tenant:
            db.session.delete(tenant)
            db.session.commit()
            return jsonify({'message': 'Tenant deleted'}), 200
        else:
            return jsonify({'message': 'Tenant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
