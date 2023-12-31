from models import db, Tenant, Lease, Unit, Property

def add_tenant(data):
    new_tenant = Tenant(**data)
    db.session.add(new_tenant)
    db.session.commit()
    return new_tenant

def get_tenants(filters=None):
    query = Tenant.query.join(Lease, Lease.tenant_id == Tenant.id)\
                        .join(Unit, Lease.unit_id == Unit.id)\
                        .join(Property, Unit.property_id == Property.id)

    if filters:
        if 'tenant_id' in filters:
            query = query.filter(Tenant.id == filters['tenant_id'])
        if 'unit_id' in filters:
            query = query.filter(Unit.id == filters['unit_id'])
        if 'property_id' in filters:
            query = query.filter(Property.id == filters['property_id'])
        if 'lease_id' in filters:
            query = query.filter(Lease.id == filters['lease_id'])
        if 'full_name' in filters:
            query = query.filter(Tenant.full_name.ilike(f"%{filters['full_name']}%"))
        if 'primary_phone' in filters:
            query = query.filter(Tenant.primary_phone == filters['primary_phone'])

    return query.all()

def update_tenant(tenant_id, data):
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return None
    
    for key, value in data.items():
        setattr(tenant, key, value)

    db.session.commit()
    return tenant

def delete_tenant(tenant_id):
    tenant = Tenant.query.get(tenant_id)
    if tenant:
        db.session.delete(tenant)
        db.session.commit()
        return True
    return False

def tenant_to_json(tenant):
    return {
        'id': tenant.id,
        'full_name': tenant.full_name,
        'primary_phone': tenant.primary_phone,
        'secondary_phone': tenant.secondary_phone,
        'email': tenant.email,
        'contact_notes': tenant.contact_notes
    }
