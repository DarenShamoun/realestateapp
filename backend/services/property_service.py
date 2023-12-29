from models import db, Property, Expense, Payment
from sqlalchemy import extract

def add_property_service(data):
    new_property = Property(
        name=data['name'],
        property_type=data['property_type'],
        address=data['address'],
        purchase_price=data.get('purchase_price'),
        year_built=data.get('year_built'),
        square_footage=data.get('square_footage')
    )
    db.session.add(new_property)
    db.session.commit()
    return property_to_json(new_property)

def get_all_properties_service():
    properties = Property.query.all()
    return [property_to_json(property) for property in properties]

def get_property_by_id_service(property_id):
    property = Property.query.get(property_id)
    if property:
        return property_to_json(property)
    return None

def update_property_service(property_id, data):
    property = Property.query.get(property_id)
    if property:
        property.name = data.get('name', property.name)
        property.property_type = data.get('property_type', property.property_type)
        property.address = data.get('address', property.address)
        property.purchase_price = data.get('purchase_price', property.purchase_price)
        property.year_built = data.get('year_built', property.year_built)
        property.square_footage = data.get('square_footage', property.square_footage)
        db.session.commit()
        return property_to_json(property)
    return None

def delete_property_service(property_id):
    property = Property.query.get(property_id)
    if property:
        db.session.delete(property)
        db.session.commit()
        return True
    return False

def calculate_monthly_income(property_id, year, month):
    total_income = 0
    property = Property.query.get(property_id)
    if property:
        for unit in property.units:
            payments = Payment.query.filter_by(unit_id=unit.id)
            payments = payments.filter(extract('year', Payment.date) == year,
                                       extract('month', Payment.date) == month).all()
            total_income += sum(payment.amount for payment in payments)
    return total_income

def get_property_financial_summary(property_id, year, month):
    property = Property.query.get(property_id)
    if not property:
        return None
    
    total_income = calculate_monthly_income(property_id, year, month)
    expenses_query = Expense.query.filter_by(property_id=property_id)
    if year:
        expenses_query = expenses_query.filter(extract('year', Expense.date) == year)
    if month:
        expenses_query = expenses_query.filter(extract('month', Expense.date) == month)
    total_expenses = sum(expense.amount for expense in expenses_query.all())

    return {
        'property_id': property_id,
        'year': year,
        'month': month,
        'total_income': total_income,
        'total_expenses': total_expenses
    }

def calculate_property_expenses(property_id, year, month):
    try:
        expenses_query = Expense.query.filter_by(property_id=property_id)
        if year:
            expenses_query = expenses_query.filter(extract('year', Expense.date) == year)
        if month:
            expenses_query = expenses_query.filter(extract('month', Expense.date) == month)
        total_expenses = sum(expense.amount for expense in expenses_query.all())
        return total_expenses
    except Exception as e:
        # Log the exception as needed
        return None

def property_to_json(property):
    """
    Converts a Property object to a JSON representation.
    """
    return {
        'id': property.id,
        'name': property.name,
        'property_type': property.property_type,
        'address': property.address,
        'purchase_price': property.purchase_price,
        'year_built': property.year_built,
        'square_footage': property.square_footage,
        'created_at': property.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': property.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }