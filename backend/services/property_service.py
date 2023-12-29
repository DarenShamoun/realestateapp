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
    property = get_properties(property_id)
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

def delete_property(property_id):
    property = get_properties(property_id)
    if property:
        db.session.delete(property)
        db.session.commit()
        return True
    return False

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