from models import Property, Payment, Expense, db
from sqlalchemy import extract

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
