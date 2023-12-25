from models import db, Tenant, Payment
from sqlalchemy import desc

def add_tenant(data):
    new_tenant = Tenant(**data)
    db.session.add(new_tenant)
    db.session.commit()
    return new_tenant

def get_tenant_payments(tenant_id, start_date=None, end_date=None):
    query = Payment.query.filter_by(tenant_id=tenant_id)
    if start_date:
        query = query.filter(Payment.date >= start_date)
    if end_date:
        query = query.filter(Payment.date <= end_date)
    return query.order_by(desc(Payment.date)).all()

def update_tenant(id, data):
    tenant = Tenant.query.get(id)
    if not tenant:
        return None
    for key, value in data.items():
        setattr(tenant, key, value)
    db.session.commit()
    return tenant

def tenant_to_json(tenant):
    return {
        'id': tenant.id,
        'full_name': tenant.full_name,
        'primary_phone': tenant.primary_phone,
        'secondary_phone': tenant.secondary_phone,
        'email': tenant.email,
        'contact_notes': tenant.contact_notes
    }

def get_all_tenants():
    """Retrieves all tenant records from the database."""
    return Tenant.query.all()

def get_tenant_by_id(tenant_id):
    """Retrieves a tenant record by its ID."""
    return Tenant.query.get(tenant_id)

def delete_tenant(tenant_id):
    """Deletes a tenant record by its ID."""
    tenant = get_tenant_by_id(tenant_id)
    if tenant:
        db.session.delete(tenant)
        db.session.commit()
        return True
    return False
