from flask import Blueprint, request, send_file, jsonify
from services.document_service import (
    add_document, 
    get_documents, 
    get_document_file_path,
    update_document,
    delete_document, 
    document_to_json
)
import traceback

document_bp = Blueprint('document_bp', __name__)

@document_bp.route('/document', methods=['POST'])
def add_document_route():
    data = request.form.to_dict()
    file = request.files['file']
    try:
        document = add_document(data, file)
        return jsonify(document_to_json(document)), 201
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

@document_bp.route('/document/view/<int:document_id>')
def view_document(document_id):
    file_path = get_document_file_path(document_id)
    if file_path:
        return send_file(file_path, mimetype='application/pdf')
    return jsonify({'error': 'Document not found'}), 404

@document_bp.route('/document/download/<int:document_id>')
def download_document(document_id):
    file_path = get_document_file_path(document_id)
    if file_path:
        return send_file(file_path, as_attachment=True)
    return jsonify({'error': 'Document not found'}), 404
    
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

@document_bp.route('/document/<int:document_id>', methods=['DELETE'])
def delete_document_route(document_id):
    try:
        if delete_document(document_id):
            return jsonify({'message': 'Document deleted'}), 200
        else:
            return jsonify({'message': 'Document not found'}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
