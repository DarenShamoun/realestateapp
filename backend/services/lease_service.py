from models import db, Lease, Unit
from datetime import datetime
import logging


def add_lease(data):
    new_lease = Lease(
        unit_id=data['unit_id'],
        tenant_id=data['tenant_id'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d') if data.get('end_date') else None,
        monthly_rent=data['monthly_rent'],
        deposit=data.get('deposit'),
        terms=data.get('terms'),
        status=data.get('status')
    )
    db.session.add(new_lease)
    update_unit_occupancy(new_lease.unit_id)
    db.session.commit()
    return new_lease

def get_all_leases(unit_id=None, tenant_id=None):
    query = Lease.query
    if unit_id:
        query = query.filter(Lease.unit_id == unit_id)
    if tenant_id:
        query = query.filter(Lease.tenant_id == tenant_id)
    return query.all()

def get_lease_by_id(lease_id):
    return Lease.query.get(lease_id)

def update_lease(id, data):
    lease = Lease.query.get(id)
    if lease:
        lease.unit_id = data.get('unit_id', lease.unit_id)
        lease.tenant_id = data.get('tenant_id', lease.tenant_id)
        lease.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d') if data.get('start_date') else lease.start_date
        lease.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d') if data.get('end_date') else lease.end_date
        lease.monthly_rent = data.get('monthly_rent', lease.monthly_rent)
        lease.deposit = data.get('deposit', lease.deposit)
        lease.terms = data.get('terms', lease.terms)
        lease.status = data.get('status', lease.status)
        update_unit_occupancy(lease.unit_id)
        db.session.commit()
    return lease

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

def delete_lease(lease_id):
    lease = Lease.query.get(lease_id)
    if lease:
        unit_id = lease.unit_id
        db.session.delete(lease)
        update_unit_occupancy(unit_id)
        db.session.commit()
        return True    
    return False

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
