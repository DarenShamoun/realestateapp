from flask import Blueprint, request, jsonify
from services.document_service import (
    add_document, 
    get_documents, 
    update_document,
    delete_document, 
    document_to_json
)
import traceback

document_bp = Blueprint('document_bp', __name__)

@document_bp.route('/document/upload', methods=['POST'])
def add_document_route():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    data = {
        'custom_filename': request.form.get('custom_filename'),
        'document_type': request.form.get('document_type'),
        'property_id': request.form.get('property_id'),
        'tenant_id': request.form.get('tenant_id'),
        'lease_id': request.form.get('lease_id')
    }

    try:
        new_document = add_document(data, file)
        return jsonify(document_to_json(new_document)), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@document_bp.route('/documents', methods=['GET'])
def get_documents_route():
    filters = {k: v for k, v in request.args.items() if v is not None}
    try:
        documents = get_documents(filters)
        return jsonify([document_to_json(doc) for doc in documents]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
@document_bp.route('/document/<int:document_id>', methods=['PUT'])
def update_document_route(document_id):
    data = request.json
    try:
        updated_document = update_document(document_id, data)
        if updated_document:
            return jsonify(document_to_json(updated_document)), 200
        else:
            return jsonify({'message': 'Document not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@document_bp.route('/document/<int:document_id>/delete', methods=['DELETE'])
def delete_document_route(document_id):
    try:
        if delete_document(document_id):
            return jsonify({'message': 'Document deleted'}), 200
        else:
            return jsonify({'message': 'Document not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
