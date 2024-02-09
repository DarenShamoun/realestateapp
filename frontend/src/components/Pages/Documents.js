'use client'

import React, { useState, useEffect, useRef } from 'react';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getLeases } from '@/api/leaseService';
import { getTenants } from '@/api/tenantService';
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

    // New state variables for dropdown selections
    const [properties, setProperties] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [units, setUnits] = useState([]);
    const [leaseId, setLeaseId] = useState('');
    const [leases, setLeases] = useState([]);
    const [tenantId, setTenantId] = useState('');
    const [tenants, setTenants] = useState([]);
    const [expenseId, setExpenseId] = useState('');
    const [paymentId, setPaymentId] = useState('');

    // Fetch documents for the document list
    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const data = await getDocuments();
            const filteredDocuments = data.filter(doc => 
                doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.custom_filename.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDocuments(filteredDocuments);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch properties, units, leases, and tenants for dropdowns
    const fetchProperties = async () => {
        try {
            const fetchedProperties = await getProperties();
            setProperties(fetchedProperties);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };

    const fetchUnits = async (propertyId) => {
        try {
            const fetchedUnits = await getUnits({ property_id: propertyId });
            const sortedUnits = fetchedUnits.sort((a, b) => parseInt(a.unit_number) - parseInt(b.unit_number));
            setUnits(sortedUnits);
            } catch (error) {
            console.error('Failed to fetch units:', error);
        }
    };

    const fetchLeases = async (unitId) => {
        try {
            const fetchedLeases = await getLeases({ unit_id: unitId });
            setLeases(fetchedLeases);
            fetchTenants();
        } catch (error) {
            console.error('Failed to fetch leases:', error);
        }
    };


    const fetchTenants = async () => {
        try {
            const fetchedTenants = await getTenants();
            setTenants(fetchedTenants);
        } catch (error) {
            console.error('Failed to fetch tenants:', error);
        }
    };

    // Helper function to get tenant name from tenant id
    const getTenantName = (tenantId) => {
        const tenant = tenants.find(t => t.id === tenantId);
        return tenant ? tenant.full_name : 'Unknown';
    };

    // Fetch documents, properties on component mount
    useEffect(() => {
        fetchDocuments();
        fetchProperties();
        fetchTenants();
    }, []);

    // Fetch units when propertyId changes
    useEffect(() => {
        if (propertyId) {
            fetchUnits(propertyId);
        } else {
            setUnits([]);
        }
    }, [propertyId]);

    // Fetch leases when unitId changes
    useEffect(() => {
        if (unitId) {
            fetchLeases(unitId);
        } else {
            setLeases([]); 
        }
    }, [unitId]);

    // Event handlers
    const handleClickUploadButton = () => {
        hiddenFileInput.current.click();
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop();
            setDocumentType(fileExtension);
            setFile(selectedFile);
            setIsFileSelected(true);
        }
    };

    // Update leaseId and set tenantId based on the selected lease
    const handleLeaseChange = (e) => {
        const selectedLeaseId = e.target.value;
        setLeaseId(selectedLeaseId);

        const selectedLease = leases.find(lease => lease.id.toString() === selectedLeaseId);
        if (selectedLease) {
            setTenantId(selectedLease.tenant_id.toString());
            // Filter tenants to include only the one associated with the selected lease
            const filteredTenant = tenants.filter(tenant => tenant.id === selectedLease.tenant_id);
            setTenants(filteredTenant);
        } else {
            setTenantId('');
            fetchTenants(); // Reload all tenants if no lease is selected
        }
    };
    
    // Upload document
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('custom_filename', customFilename);
        formData.append('document_type', documentType);
        formData.append('property_id', propertyId);
        formData.append('unit_id', unitId);
        formData.append('lease_id', leaseId);
        formData.append('tenant_id', tenantId);
        formData.append('expense_id', expenseId);
        formData.append('payment_id', paymentId);
    
        try {
            await addDocument(formData);
            fetchDocuments(); 
            resetUploadState();
        } catch (error) {
            setError(error.message);
        }
    };
    
    // Reset file upload state to initial state
    const resetUploadState = () => {
        hiddenFileInput.current.value = '';
        setFile(null);
        setCustomFilename('');
        setIsFileSelected(false);
        setPropertyId('');
        setUnitId('');
        setLeaseId('');
        setTenantId('');
        setExpenseId('');
        setPaymentId('');
    };
    
    // Delete document
    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            fetchDocuments(); 
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-white mb-4">Documents</h1>
            
            {/* Search and Upload Section */}
            <div className="bg-gray-800 p-4 rounded-t-lg flex items-center justify-between">
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
                                placeholder="Custom filename" 
                                value={customFilename} 
                                onChange={(e) => setCustomFilename(e.target.value)} 
                                className="bg-gray-700 text-white rounded-l-full py-2 px-4 leading-tight focus:outline-none"
                            />
                            <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 ">
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

            {/* Dropdown Grid Section */}
            {isFileSelected && (
                <div className="bg-gray-700 p-4 mb-4 rounded-b-lg">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Dropdown for Property */}
                        <div>
                            <label className="text-white block mb-2">Property</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={propertyId}
                                onChange={(e) => setPropertyId(e.target.value)}
                            >
                                <option value="">Select Property</option>
                                {properties.map(property => (
                                    <option key={property.id} value={property.id}>{property.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Unit */}
                        <div>
                            <label className="text-white block mb-2">Unit</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={unitId}
                                onChange={(e) => setUnitId(e.target.value)}
                                disabled={!propertyId} // Disable if no property is selected
                            >
                                <option value="">Select Unit</option>
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Lease */}
                        <div>
                            <label className="text-white block mb-2">Lease</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={leaseId}
                                onChange={handleLeaseChange}
                                disabled={!unitId} // Disable if no unit is selected
                            >
                                <option value="">Select Lease</option>
                                {leases.map(lease => (
                                    <option key={lease.id} value={lease.id}>
                                        {`${lease.is_active ? 'Active' : 'Inactive'} - ${getTenantName(lease.tenant_id)}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Tenant */}
                        <div>
                            <label className="text-white block mb-2">Tenant</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={tenantId}
                                onChange={(e) => setTenantId(e.target.value)}
                                disabled={!!propertyId} // Disable if a property is selected
                            >
                                <option value="">Select Tenant</option>
                                {tenants.map(tenant => (
                                    <option key={tenant.id} value={tenant.id}>{tenant.full_name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Expense */}
                        <div>
                            <label className="text-white block mb-2">Expense</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={expenseId}
                                onChange={(e) => setExpenseId(e.target.value)}
                            >
                                <option value="">Select Expense</option>
                                {/* Replace with actual options */}
                            </select>
                        </div>

                        {/* Dropdown for Payment */}
                        <div>
                            <label className="text-white block mb-2">Payment</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                            >
                                <option value="">Select Payment</option>
                                {/* Replace with actual options */}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Document List Section */}
            <div className="bg-gray-700 pl-4 pr-4 pb-4 rounded-b-lg">
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                            <span className="text-lg text-white">{doc.custom_filename || doc.filename}</span>
                            <div className="flex items-center">
                                <button onClick={() => {/* handle view logic */}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                                    View
                                </button>
                                <button onClick={() => handleDelete(doc.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-white text-center pt-6 pb-4">No documents found.</div>
                )}
            </div>
        </div>
    );
}

export default Documents;
