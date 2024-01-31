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
        <div>
            <h1>Documents</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <input 
                    type="text" 
                    placeholder="Custom filename (optional)" 
                    value={customFilename} 
                    onChange={(e) => setCustomFilename(e.target.value)} 
                />
                <button type="submit">Upload</button>
            </form>

            <div>
                {documents.map(doc => (
                    <div key={doc.id}>
                        <span>{doc.custom_filename || doc.filename}</span>
                        <button onClick={() => handleDelete(doc.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documents;
