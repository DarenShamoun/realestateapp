from models import db, Expense
from datetime import datetime

def add_expense(data):
    new_expense = Expense(**data)
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
    expense = Expense.query.get(expense_id)
    if not expense:
        return None
    
    for key, value in data.items():
        setattr(expense, key, value)

    db.session.commit()
    return expense

def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
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
