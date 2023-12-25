from extensions import db
from datetime import datetime
from enum import Enum
from sqlalchemy_utils import EmailType


class PropertyType(Enum):
    """Represents the type of a property."""
    RESIDENTIAL = 'residential'
    COMMERCIAL = 'commercial'
    INDUSTRIAL = 'industrial'

class Property(db.Model):
    """
    Represents a property in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    property_type = db.Column(db.Enum(PropertyType), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    units = db.relationship('Unit', backref='property', lazy=True)
    purchase_price = db.Column(db.Float, nullable=True)
    year_built = db.Column(db.Integer, nullable=True)
    square_footage = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Unit(db.Model):
    """
    Represents a unit in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False, index=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True, index=True)
    tenant = db.relationship('Tenant', backref='units', uselist=False)
    unit_number = db.Column(db.String(20), nullable=False)
    rent_details = db.relationship('Rent', backref='unit', uselist=False, lazy=True)
    rent_status = db.Column(db.String(50))  # Possible values: 'Current', 'Late', 'Paid'
    is_occupied = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Rent(db.Model):
    """
    Represents the rent details for a unit in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False, index=True)
    rent = db.Column(db.Float, nullable=False, default=0)
    trash = db.Column(db.Float, nullable=False, default=0)
    water_sewer = db.Column(db.Float, nullable=False, default=0)
    parking = db.Column(db.Float, nullable=False, default=0)
    debt = db.Column(db.Float, nullable=False, default=0)
    breaks = db.Column(db.Float, nullable=False, default=0)
    total_rent = db.Column(db.Float, nullable=False, default=0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RentHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    old_rent = db.Column(db.Float, nullable=False)
    new_rent = db.Column(db.Float, nullable=False)
    change_date = db.Column(db.DateTime, default=datetime.utcnow)

class Tenant(db.Model):
    """
    Represents a tenant in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    primary_phone = db.Column(db.String(20), nullable=False)
    secondary_phone = db.Column(db.String(20))
    email = db.Column(EmailType)
    contact_notes = db.Column(db.Text)
    leases = db.relationship('Lease', backref='tenant', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Lease(db.Model):
    """
    Represents a lease in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False, index=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False, index=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    monthly_rent = db.Column(db.Float, nullable=False)
    deposit = db.Column(db.Float)
    terms = db.Column(db.Text)
    status = db.Column(db.String(50))  # Possible values: 'Active', 'Ended', 'Renewed'
    payments = db.relationship('Payment', backref='lease', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LeaseRenewal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False)
    renewal_date = db.Column(db.DateTime, default=datetime.utcnow)
    new_end_date = db.Column(db.DateTime)

class Payment(db.Model):
    """
    Represents a payment in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False, index=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), index=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), index=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=True)
    receipt_number = db.Column(db.String(100), unique=True)
    is_partial = db.Column(db.Boolean, default=False)
    tenant = db.relationship('Tenant', backref='payments')
    unit = db.relationship('Unit', backref='payments')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Expense(db.Model):
    """
    Represents an expense in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False, index=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
