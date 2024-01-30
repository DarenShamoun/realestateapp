from models import db, Document
from werkzeug.utils import secure_filename
from flask import current_app
import os

def add_document(file, custom_filename=None, **kwargs):
    filename = secure_filename(file.filename)
    file_path = os.path.join(current_app.config['DOCUMENTS_FOLDER'], filename)
    file.save(file_path)

    normalized_file_path = os.path.normpath(file_path)

    new_document = Document(
        filename=filename,
        custom_filename=custom_filename,
        file_path=normalized_file_path,
        **kwargs
    )
    db.session.add(new_document)
    db.session.commit()
    return new_document

def get_documents(filters=None):
    query = Document.query
    if filters:
        for key, value in filters.items():
            query = query.filter(getattr(Document, key) == value)
    return query.all()

def delete_document(document_id):
    document = Document.query.get(document_id)
    if document:
        os.remove(document.file_path)
        db.session.delete(document)
        db.session.commit()
        return True
    return False

def document_to_json(document):
    return {
        'id': document.id,
        'filename': document.filename,
        'custom_filename': document.custom_filename,
        'document_type': document.document_type,
        'file_path': document.file_path,
        'created_at': document.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': document.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        'property_id': document.property_id,
        'tenant_id': document.tenant_id,
        'lease_id': document.lease_id
    }
