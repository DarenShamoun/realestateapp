'use client'

import React, { useState, useEffect, useRef } from 'react';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/api/documentService';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [documentType, setDocumentType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [customFilename, setCustomFilename] = useState('');
    const [isFileSelected, setIsFileSelected] = useState(false);
    const hiddenFileInput = useRef(null);

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

    const handleClickUploadButton = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop();
            setDocumentType(fileExtension);
            setFile(selectedFile);
            setIsFileSelected(true);
        }
    };
    
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('custom_filename', customFilename);
        formData.append('document_type', documentType);
    
        try {
            await addDocument(formData);
            fetchDocuments(); 
            resetUploadState();
        } catch (error) {
            setError(error.message);
        }
    };
    
    const resetUploadState = () => {
        hiddenFileInput.current.value = '';
        setFile(null);
        setCustomFilename('');
        setIsFileSelected(false);
    };
    
    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            fetchDocuments(); 
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredDocuments = documents.filter(doc => 
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.custom_filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white mb-4">Documents</h1>
            
            {/* Search and Upload Section */}
            <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between mb-6">
                {/* Search Input */}
                <div className="flex flex-grow items-center rounded-full bg-gray-700 mr-3">
                    <input 
                        type="text" 
                        placeholder="Search documents..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="py-2 px-4 w-full leading-tight focus:outline-none text-white rounded-l-full"
                    />
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-r-full">
                        {/* Search icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full mx-2">
                        {/* Filter icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 5a1 1 0 001 1h12a1 1 0 100-2H4a1 1 0 00-1 1zm0 6a1 1 0 001 1h12a1 1 0 100-2H4a1 1 0 00-1 1zm0 6a1 1 0 001 1h12a1 1 0 100-2H4a1 1 0 00-1 1z" />
                        </svg>
                    </button>
                </div>

                {/* Upload Section */}
                <div className="flex items-center">
                    <input 
                        type="file" 
                        ref={hiddenFileInput}
                        onChange={handleFileChange} 
                        style={{display: 'none'}} 
                    />

                    {/* Upload Button and Custom Filename Input */}
                    {isFileSelected ? (
                        // Shown when a file is selected
                        <div className="flex items-center bg-gray-700 rounded-full">
                            <input 
                                type="text" 
                                placeholder="Custom filename (optional)" 
                                value={customFilename} 
                                onChange={(e) => setCustomFilename(e.target.value)} 
                                className="bg-gray-700 text-white rounded-l-full py-2 px-4 leading-tight focus:outline-none"
                            />
                            <button onClick={handleUpload} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 ">
                                {/* Upload icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                            <button onClick={resetUploadState} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-r-full">
                                {/* Cancel icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        // Upload Button
                        <button onClick={handleClickUploadButton} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">
                            {/* Custom File upload icon */}
                            <img src="/upload-file.svg" alt="Upload" className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Document List Section */}
            <div>
                {filteredDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                        <span className="text-lg text-white">{doc.custom_filename || doc.filename}</span>
                        <div>
                            {/* View and Delete Buttons */}
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
}

export default Documents;
