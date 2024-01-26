'use client';

import React, { useState, useEffect } from 'react';
import { uploadDocument, getDocuments, deleteDocument } from '@/api/documentService';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);

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
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        try {
            await uploadDocument(formData);
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
            {/* Upload Form */}
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>

            {/* Documents List */}
            <div>
                {documents.map(doc => (
                    <div key={doc.id}>
                        <span>{doc.filename}</span>
                        <button onClick={() => handleDelete(doc.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documents;
