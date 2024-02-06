'use client'

import React, { useState, useEffect } from 'react';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/api/documentService';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [customFilename, setCustomFilename] = useState('');
    const [documentType, setDocumentType] = useState('');

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Determine document type based on file extension
        const fileExtension = selectedFile.name.split('.').pop();
        setDocumentType(fileExtension);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('custom_filename', customFilename);
        formData.append('document_type', documentType);

        try {
            await addDocument(formData);
            fetchDocuments(); // Refresh the list after upload
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            fetchDocuments(); // Refresh the list after deletion
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Documents</h1>
            
            <form onSubmit={handleUpload} className="mb-4">
                <div className="flex gap-4 mb-2">
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="block w-full text-sm text-gray-600
                                   file:mr-4 file:py-2 file:px-4
                                   file:border-0 file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <input 
                        type="text" 
                        placeholder="Custom filename (optional)" 
                        value={customFilename} 
                        onChange={(e) => setCustomFilename(e.target.value)} 
                        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Upload
                </button>
            </form>

            <div>
                {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                        <span className="text-lg">{doc.custom_filename || doc.filename}</span>
                        {/* Add a view button if needed */}
                        <div>
                            <button onClick={() => {/* handle view logic */}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2">
                                View
                            </button>
                            <button onClick={() => handleDelete(doc.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documents;

