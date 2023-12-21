from extensions import db
from datetime import datetime

class Property(db.Model):
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
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True)
    tenant = db.relationship('Tenant', backref='units', uselist=False)
    unit_number = db.Column(db.String(20), nullable=False)
    rent_details = db.relationship('Rent', backref='unit', uselist=False, lazy=True)
    is_occupied = db.Column(db.Boolean, default=False)
    def get_total_rent(self):
        # Calculates total rent from the associated Rent model
        if self.rent_details:
            return self.rent_details.calculate_total_rent()
        return 0
    def calculate_balance(self, year, month):
        payments = Payment.query.filter_by(unit_id=self.id)
        payments = payments.filter(db.extract('year', Payment.date) == year,
                                    db.extract('month', Payment.date) == month).all()
        total_paid = sum(payment.amount for payment in payments)
        rent_expected = self.get_total_rent()  # Assuming this returns the monthly rent due
        balance = rent_expected - total_paid
        # If balance is negative, it means underpaid, so it should be added to debt
        if balance > 0:
            self.rent_details.debt += balance
            db.session.commit()
        return balance

    def update_balance(self, year, month):
        """Updates balance and debt based on payment history."""
        total_paid = sum(payment.amount for payment in self.payments if payment.date.year == year and payment.date.month == month)
        balance = self.rent_details.calculate_total_rent() - total_paid
        if balance > 0:  # Underpayment
            self.rent_details.debt += balance
        elif balance < 0:  # Overpayment
            self.rent_details.debt = max(0, self.rent_details.debt + balance)  # Reduce debt with the overpaid amount but not below 0
        db.session.commit()

class Rent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    # Rent components
    rent = db.Column(db.Float, nullable=False, default=0)
    trash = db.Column(db.Float, nullable=False, default=0)
    water_sewer = db.Column(db.Float, nullable=False, default=0)
    parking = db.Column(db.Float, nullable=False, default=0)
    debt = db.Column(db.Float, nullable=False, default=0)
    breaks = db.Column(db.Float, nullable=False, default=0)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    def calculate_total_rent(self):
        # Sum of all rent components with a default of 0 if None
        return (self.rent or 0) + (self.trash or 0) + (self.water_sewer or 0) + \
               (self.parking or 0) + (self.debt or 0) + (self.breaks or 0)

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    primary_phone = db.Column(db.String(20), nullable=False)
    secondary_phone = db.Column(db.String(20))
    contact_notes = db.Column(db.Text)
    leases = db.relationship('Lease', backref='tenant', lazy=True)
    def get_payment_history(self):
        # Returns a summary of the tenant's payment history
        payments = self.payments
        return [{'amount': payment.amount, 'date': payment.date, 'type': payment.payment_type} for payment in payments]

class Lease(db.Model):
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
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)