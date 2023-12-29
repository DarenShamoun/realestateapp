from models import db, Expense
from datetime import datetime

def add_expense(data):
    new_expense = Expense(
        property_id=data['property_id'],
        unit_id=data.get('unit_id'),
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', '')
    )
    db.session.add(new_expense)
    db.session.commit()
    return new_expense

def get_expenses(filters=None):
    query = Expense.query
    if filters:
        if 'expense_id' in filters:
            query = query.filter(Expense.id == filters['expense_id'])
        if 'property_id' in filters:
            query = query.filter(Expense.property_id == filters['property_id'])
        if 'unit_id' in filters:
            query = query.filter(Expense.unit_id == filters['unit_id'])
        if 'year' in filters:
            query = query.filter(db.extract('year', Expense.date) == filters['year'])
        if 'month' in filters:
            query = query.filter(db.extract('month', Expense.date) == filters['month'])
    return query.all()

def update_expense(expense_id, data):
    expense = get_expenses(expense_id)
    if expense:
        expense.property_id = data.get('property_id', expense.property_id)
        expense.unit_id = data.get('unit_id', expense.unit_id)
        expense.date = datetime.strptime(data['date'], '%Y-%m-%d') if data.get('date') else expense.date
        expense.amount = data.get('amount', expense.amount)
        expense.category = data.get('category', expense.category)
        expense.description = data.get('description', expense.description)
        db.session.commit()
    return expense

def delete_expense(expense_id):
    expense = get_expenses(expense_id)
    if expense:
        db.session.delete(expense)
        db.session.commit()
        return True
    return False

def expense_to_json(expense):
    return {
        'id': expense.id,
        'property_id': expense.property_id,
        'unit_id': expense.unit_id,
        'date': expense.date.strftime('%Y-%m-%d'),
        'amount': expense.amount,
        'category': expense.category,
        'description': expense.description,
        'created_at': expense.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': expense.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
