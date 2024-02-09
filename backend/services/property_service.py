from models import db, Property

def add_property(data):
    new_property = Property(**data)
    db.session.add(new_property)
    db.session.commit()
    return new_property

def get_properties(filters=None):
    query = Property.query

    if filters:
        if 'property_id' in filters:
            query = query.filter(Property.id == filters['property_id'])
        if 'name' in filters:
            query = query.filter(Property.name.ilike(f"%{filters['name']}%"))
        if 'property_type' in filters:
            query = query.filter(Property.property_type == filters['property_type'])

    return query.all()

def update_property(property_id, data):
    property = Property.query.get(property_id)
    if not property:
        return None
    
    for key, value in data.items():
        setattr(property, key, value)

    db.session.commit()
    return None

def delete_property(property_id):
    property = Property.query.get(property_id)
    if property:
        db.session.delete(property)
        db.session.commit()
        return True
    return False

def property_to_json(property):
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
