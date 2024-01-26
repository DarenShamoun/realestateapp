from flask import Blueprint, request, jsonify
from services.document_service import (
    add_document, 
    get_documents, 
    delete_document, 
    document_to_json
)
import traceback

document_bp = Blueprint('document_bp', __name__)

@document_bp.route('/document/upload', methods=['POST'])
def upload_document_route():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    try:
        new_document = add_document(
            file, 
            property_id=request.form.get('property_id'),
            tenant_id=request.form.get('tenant_id'),
            lease_id=request.form.get('lease_id'),
            document_type=request.form.get('document_type')
        )
        return jsonify(document_to_json(new_document)), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@document_bp.route('/documents', methods=['GET'])
def get_documents_route():
    filters = {k: v for k, v in request.args.items()}
    try:
        documents = get_documents(filters)
        return jsonify([document_to_json(doc) for doc in documents]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@document_bp.route('/document/<int:document_id>/delete', methods=['DELETE'])
def delete_document_route(document_id):
    try:
        if delete_document(document_id):
            return jsonify({'message': 'Document deleted'}), 200
        return jsonify({'message': 'Document not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
