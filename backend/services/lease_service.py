from models import db, Property, Lease, Unit, Tenant
from datetime import datetime

def add_lease(data):
    new_lease = Lease(**data)
    db.session.add(new_lease)
    update_unit_occupancy(new_lease.unit_id)
    db.session.commit()
    return new_lease

def get_leases(filters=None):
    query = Lease.query.join(Unit).join(Tenant)

    if filters:
        if 'lease_id' in filters:
            query = query.filter(Lease.id == filters['lease_id'])
        if 'unit_id' in filters:
            query = query.filter(Lease.unit_id == filters['unit_id'])
        if 'tenant_id' in filters:
            query = query.filter(Lease.tenant_id == filters['tenant_id'])
        if 'property_id' in filters:
            query = query.join(Property).filter(Property.id == filters['property_id'])
        if 'status' in filters:
            query = query.filter(Lease.status == filters['status'])
        if 'is_occupied' in filters:
            query = query.filter(Unit.is_occupied == filters['is_occupied'])

    return query.all()

def update_lease(lease_id, data):
    lease = Lease.query.get(lease_id)
    if not lease:
        return None
    
    for key, value in data.items():
        setattr(lease, key, value)

    update_unit_occupancy(lease.unit_id)
    db.session.commit()
    return lease

def delete_lease(lease_id):
    lease = Lease.query.get(lease_id)
    if lease:
        unit_id = lease.unit_id
        db.session.delete(lease)
        update_unit_occupancy(unit_id)
        db.session.commit()
        return True    
    return False

def update_unit_occupancy(unit_id):
    unit = Unit.query.get(unit_id)
    if unit:
        active_lease = Lease.query.filter(
            Lease.unit_id == unit_id,
            (Lease.end_date == None) | (Lease.end_date >= datetime.utcnow()),
            Lease.status == 'Active'
        ).order_by(Lease.start_date.desc()).first()

        if active_lease:
            unit.is_occupied = True
            unit.tenant_id = active_lease.tenant_id
        else:
            unit.is_occupied = False
            unit.tenant_id = None

        db.session.commit()

def lease_to_json(lease):
    return {
        'id': lease.id,
        'unit_id': lease.unit_id,
        'tenant_id': lease.tenant_id,
        'start_date': lease.start_date.strftime('%Y-%m-%d') if lease.start_date else None,
        'end_date': lease.end_date.strftime('%Y-%m-%d') if lease.end_date else None,
        'monthly_rent': lease.monthly_rent,
        'deposit': lease.deposit,
        'terms': lease.terms,
        'status': lease.status,
        'created_at': lease.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': lease.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
