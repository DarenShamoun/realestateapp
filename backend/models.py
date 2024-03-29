from extensions import db
from datetime import datetime
from sqlalchemy_utils import EmailType
from sqlalchemy.schema import CheckConstraint

class Property(db.Model):
    """
    Represents a property in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    property_type = db.Column(db.String(50), nullable=False)
    __table_args__ = (
        CheckConstraint(property_type.in_(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'])),
    )    
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
    unit_number = db.Column(db.String(20), nullable=False)
    lease_details = db.relationship('Lease', backref='unit', lazy=True)
    rent_status = db.Column(db.String(50))
    is_occupied = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Rent(db.Model):
    """
    Represents the rent details for a unit in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False, index=True)
    rent = db.Column(db.Float, nullable=False, default=0)
    trash = db.Column(db.Float, nullable=False, default=0)
    water_sewer = db.Column(db.Float, nullable=False, default=0)
    parking = db.Column(db.Float, nullable=False, default=0)
    debt = db.Column(db.Float, nullable=False, default=0)
    breaks = db.Column(db.Float, nullable=False, default=0)
    total_rent = db.Column(db.Float, nullable=False, default=0.0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RentHistory(db.Model):
    """
    Documents changes in the base rent for a unit in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False)
    old_rent = db.Column(db.Float, nullable=False)
    new_rent = db.Column(db.Float, nullable=False)
    change_date = db.Column(db.DateTime, default=datetime.utcnow)

class Tenant(db.Model):
    """
    Represents a tenant in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    primary_phone = db.Column(db.String(20), nullable=True)
    secondary_phone = db.Column(db.String(20), nullable=True)
    email = db.Column(EmailType, nullable=True)
    contact_notes = db.Column(db.Text, nullable=True)
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
    deposit = db.Column(db.Float, nullable=True)
    terms = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    rents = db.relationship('Rent', backref='lease', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Payment(db.Model):
    """
    Represents a payment in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False, index=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=True)
    receipt_number = db.Column(db.String(100), unique=True)
    is_partial = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Expense(db.Model):
    """
    Represents an expense in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False, index=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), index=True, nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Document(db.Model):
    """
    Represents a document in the real estate application.
    """
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255))
    filename = db.Column(db.String(255), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    custom_filename = db.Column(db.String(255))
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    expense_id = db.Column(db.Integer, db.ForeignKey('expense.id'), nullable=True)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.id'), nullable=True)
    property = db.relationship('Property', backref='documents')
    unit = db.relationship('Unit', backref='documents')
    lease = db.relationship('Lease', backref='documents')
    tenant = db.relationship('Tenant', backref='documents')
    expense = db.relationship('Expense', backref='documents')
    payment = db.relationship('Payment', backref='documents')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
