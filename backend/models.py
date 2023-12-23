from extensions import db
from datetime import datetime

class Property(db.Model):
    """
    Represents a property in the real estate application.

    Attributes:
        id (int): The unique identifier of the property.
        name (str): The name of the property.
        property_type (str): The type of the property.
        address (str): The address of the property.
        units (relationship): The units associated with the property.
        purchase_price (float): The purchase price of the property.
        year_built (int): The year the property was built.
        square_footage (int): The square footage of the property.

    Methods:
        calculate_monthly_income(year, month): Calculates the total income for the property for a given month and year.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    property_type = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    units = db.relationship('Unit', backref='property', lazy=True)
    purchase_price = db.Column(db.Float, nullable=True)
    year_built = db.Column(db.Integer, nullable=True)
    square_footage = db.Column(db.Integer, nullable=True)

    def calculate_monthly_income(self, year, month):
        """Calculates the total income for the property for a given month and year."""
        total_income = 0
        for unit in self.units:
            payments = Payment.query.filter_by(unit_id=unit.id)
            payments = payments.filter(db.extract('year', Payment.date) == year,
                                       db.extract('month', Payment.date) == month).all()
            total_income += sum(payment.amount for payment in payments)
        return total_income

class Unit(db.Model):
    """
    Represents a unit in the real estate application.

    Attributes:
        id (int): The unique identifier of the unit.
        property_id (int): The ID of the property the unit belongs to.
        tenant_id (int): The ID of the tenant occupying the unit.
        tenant (relationship): The tenant associated with the unit.
        unit_number (str): The number of the unit.
        rent_details (relationship): The rent details associated with the unit.
        is_occupied (bool): Indicates whether the unit is occupied.

    Methods:
        get_total_rent(): Calculates the total rent from the associated Rent model.
        calculate_balance(year, month): Calculates the balance for the unit for a given month and year.
        update_balance(year, month): Updates the balance and debt based on payment history.
    """
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    tenant = db.relationship('Tenant', backref='units', uselist=False)
    unit_number = db.Column(db.String(20), nullable=False)
    rent_details = db.relationship('Rent', backref='unit', uselist=False, lazy=True)
    is_occupied = db.Column(db.Boolean, default=False)

    def get_total_rent(self):
        """Calculates the total rent from the associated Rent model."""
        if self.rent_details:
            return self.rent_details.calculate_total_rent()
        return 0

    def calculate_balance(self, year, month):
        """Calculates the balance for the unit for a given month and year."""
        payments = Payment.query.filter_by(unit_id=self.id)
        payments = payments.filter(db.extract('year', Payment.date) == year,
                                    db.extract('month', Payment.date) == month).all()
        total_paid = sum(payment.amount for payment in payments)
        rent_expected = self.get_total_rent()  # Assuming this returns the monthly rent due
        balance = rent_expected - total_paid
        if balance > 0:
            self.rent_details.debt += balance
            db.session.commit()
        return balance

    def update_balance(self, year, month):
        """Updates the balance and debt based on payment history."""
        total_paid = sum(payment.amount for payment in self.payments if payment.date.year == year and payment.date.month == month)
        balance = self.rent_details.calculate_total_rent() - total_paid
        if balance > 0:
            self.rent_details.debt += balance
        elif balance < 0:
            self.rent_details.debt = max(0, self.rent_details.debt + balance)
        db.session.commit()

class Rent(db.Model):
    """
    Represents the rent details for a unit in the real estate application.

    Attributes:
        id (int): The unique identifier of the rent details.
        unit_id (int): The ID of the unit the rent details belong to.
        rent (float): The rent amount.
        trash (float): The trash fee amount.
        water_sewer (float): The water and sewer fee amount.
        parking (float): The parking fee amount.
        debt (float): The debt amount.
        breaks (float): The breaks amount.
        date (datetime): The date of the rent details.

    Methods:
        calculate_total_rent(): Calculates the total rent amount.
    """
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    rent = db.Column(db.Float, nullable=False, default=0)
    trash = db.Column(db.Float, nullable=False, default=0)
    water_sewer = db.Column(db.Float, nullable=False, default=0)
    parking = db.Column(db.Float, nullable=False, default=0)
    debt = db.Column(db.Float, nullable=False, default=0)
    breaks = db.Column(db.Float, nullable=False, default=0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def calculate_total_rent(self):
        """Calculates the total rent amount."""
        return (self.rent or 0) + (self.trash or 0) + (self.water_sewer or 0) + \
               (self.parking or 0) + (self.debt or 0) + (self.breaks or 0)

class Tenant(db.Model):
    """
    Represents a tenant in the real estate application.

    Attributes:
        id (int): The unique identifier of the tenant.
        full_name (str): The full name of the tenant.
        primary_phone (str): The primary phone number of the tenant.
        secondary_phone (str): The secondary phone number of the tenant.
        contact_notes (str): Additional notes about the tenant.
        leases (relationship): The leases associated with the tenant.

    Methods:
        get_payment_history(): Returns a summary of the tenant's payment history.
    """
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    primary_phone = db.Column(db.String(20), nullable=False)
    secondary_phone = db.Column(db.String(20))
    contact_notes = db.Column(db.Text)
    leases = db.relationship('Lease', backref='tenant', lazy=True)

    def get_payment_history(self):
        """Returns a summary of the tenant's payment history."""
        payments = self.payments
        return [{'amount': payment.amount, 'date': payment.date, 'type': payment.payment_type} for payment in payments]

class Lease(db.Model):
    """
    Represents a lease in the real estate application.

    Attributes:
        id (int): The unique identifier of the lease.
        unit_id (int): The ID of the unit the lease belongs to.
        tenant_id (int): The ID of the tenant associated with the lease.
        start_date (date): The start date of the lease.
        end_date (date): The end date of the lease.
        monthly_rent (float): The monthly rent amount.
        deposit (float): The deposit amount.
        terms (str): The terms of the lease.
        payments (relationship): The payments associated with the lease.
    """
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    monthly_rent = db.Column(db.Float, nullable=False)
    deposit = db.Column(db.Float)
    terms = db.Column(db.Text)
    payments = db.relationship('Payment', backref='lease', lazy=True)

class Payment(db.Model):
    """
    Represents a payment in the real estate application.

    Attributes:
        id (int): The unique identifier of the payment.
        lease_id (int): The ID of the lease the payment belongs to.
        tenant_id (int): The ID of the tenant associated with the payment.
        unit_id (int): The ID of the unit associated with the payment.
        date (datetime): The date of the payment.
        amount (float): The payment amount.
        payment_method (str): The payment method.

    Relationships:
        tenant (relationship): The tenant associated with the payment.
        unit (relationship): The unit associated with the payment.
    """
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('lease.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'))
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'))
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=True)
    tenant = db.relationship('Tenant', backref='payments')
    unit = db.relationship('Unit', backref='payments')

class Expense(db.Model):
    """
    Represents an expense in the real estate application.

    Attributes:
        id (int): The unique identifier of the expense.
        property_id (int): The ID of the property the expense belongs to.
        date (datetime): The date of the expense.
        amount (float): The expense amount.
        category (str): The category of the expense.
        description (str): The description of the expense.
    """
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)