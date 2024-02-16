from models import db, Document
from werkzeug.utils import secure_filename
import os
from flask import current_app

def add_document(data, file):
    filename = secure_filename(file.filename)
    file_path = os.path.join(current_app.config['DOCUMENTS_FOLDER'], filename)
    file.save(file_path)

    normalized_file_path = os.path.normpath(file_path)

    # Convert empty strings to None for integer fields
    for field in ['property_id', 'unit_id', 'lease_id', 'tenant_id', 'expense_id', 'payment_id']:
        if field in data and data[field] == '':
            data[field] = None

    new_document = Document(
        filename=filename,
        file_path=normalized_file_path,
        **data
    )
    db.session.add(new_document)
    db.session.commit()
    return new_document

def get_documents(filters=None):
    query = Document.query

    if filters:
        for key, value in filters.items():
            if key == 'document_id':
                query = query.filter(Document.id == value)
            elif key == 'property_id':
                query = query.filter(Document.property_id == value)
            elif key == 'unit_id':
                query = query.filter(Document.unit_id == value)
            elif key == 'lease_id':
                query = query.filter(Document.lease_id == value)
            elif key == 'tenant_id':
                query = query.filter(Document.tenant_id == value)
            elif key == 'expense_id':
                query = query.filter(Document.expense_id == value)
            elif key == 'payment_id':
                query = query.filter(Document.payment_id == value)
            elif key == 'document_type':
                query = query.filter(Document.document_type == value)
            elif key == 'filename':
                search = f"%{value}%"
                query = query.filter(Document.filename.ilike(search))

    return query.all()

def get_document_file_path(document_id):
    document = Document.query.get(document_id)
    if document and os.path.exists(document.file_path):
        return document.file_path
    return None

def update_document(document_id, data):
    document = Document.query.get(document_id)
    if not document:
        return None
    
    for key, value in data.items():
        setattr(document, key, value)

    db.session.commit()
    return document

def delete_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return False

    try:
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
    except FileNotFoundError as e:
        print(f"File not found during deletion: {e}")
    except Exception as e:
        print(f"Error during file deletion: {e}")
        raise

    db.session.delete(document)
    db.session.commit()
    return True

def document_to_json(document):
    return {
        'id': document.id,
        'filename': document.filename,
        'custom_filename': document.custom_filename,
        'document_type': document.document_type,
        'file_path': document.file_path,
        'property_id': document.property_id,
        'tenant_id': document.tenant_id,
        'lease_id': document.lease_id,
        'expense_id': document.expense_id,
        'created_at': document.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': document.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
