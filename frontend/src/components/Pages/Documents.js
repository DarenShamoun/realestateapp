'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getLeases } from '@/api/leaseService';
import { getTenants } from '@/api/tenantService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { 
    addDocument, 
    getDocuments, 
    getDocumentViewUrl, 
    getDocumentDownloadUrl, 
    deleteDocument 
} from '@/api/documentService';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [documentType, setDocumentType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [customFilename, setCustomFilename] = useState('');
    const [searchFilename, setSearchFilename] = useState('');
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [showFilterDropdowns, setShowFilterDropdowns] = useState(false);
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
    const [expenses, setExpenses] = useState([]);
    const [paymentId, setPaymentId] = useState('');
    const [payments, setPayments] = useState([]);

    // Fetch documents for the document list
    const fetchDocuments = async (filters = {}) => {
        setIsLoading(true);
        try {
            const queryParameters = {};
            if (filters.propertyId) queryParameters.property_id = filters.propertyId;
            if (filters.unitId) queryParameters.unit_id = filters.unitId;
            if (filters.leaseId) queryParameters.lease_id = filters.leaseId;
            if (filters.tenantId) queryParameters.tenant_id = filters.tenantId;
            if (filters.expenseId) queryParameters.expense_id = filters.expenseId;
            if (filters.paymentId) queryParameters.payment_id = filters.paymentId;
            if (searchFilename) queryParameters.filename = searchFilename;
    
            const documentsData = await getDocuments(queryParameters);
            setDocuments(documentsData);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };    
    
    // Effect hook to fetch documents when searchFilename changes, debounced
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchDocuments();
        }, 300); // Delay for debounce

        return () => clearTimeout(delayDebounce);
    }, [searchFilename]);
    
    // Fetch documents with filters whenever a dropdown value changes
    useEffect(() => {
        const filters = {
            propertyId,
            unitId,
            leaseId,
            tenantId,
            expenseId,
            paymentId
        };
        fetchDocuments(filters);
    }, [propertyId, unitId, leaseId, tenantId, expenseId, paymentId, searchFilename]);
    
    // Function to toggle filter dropdowns for filtering
    const toggleFilterDropdowns = () => {
        setShowFilterDropdowns(!showFilterDropdowns);
        // If we're closing the filter dropdowns, reset the filters
        if (showFilterDropdowns) {
            setPropertyId('');
            setUnitId('');
            setLeaseId('');
            setTenantId('');
            setExpenseId('');
            setPaymentId('');
        }
    };

    // Fetch properties, units, leases, tenants, payments, and expenses for dropdowns
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

    const fetchPayments = async () => {
        try {
            const filters = {};
            if (propertyId) filters.property_id = propertyId;
            if (unitId) filters.unit_id = unitId;
            if (leaseId) filters.lease_id = leaseId;
    
            const fetchedPayments = await getPayments(filters);
            setPayments(fetchedPayments);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        }
    };
    
    const fetchExpenses = async () => {
        try {
            const filters = {};
            if (propertyId) filters.property_id = propertyId;
            if (unitId) filters.unit_id = unitId;
    
            const fetchedExpenses = await getExpenses(filters);
            setExpenses(fetchedExpenses);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
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
    });

    // Fetch units when propertyId changes
    useEffect(() => {
        if (propertyId) {
            fetchUnits(propertyId);
            // Reset states for unit, lease, tenant, payment, and expense
            setUnitId('');
            setLeaseId('');
            setTenantId('');
            setExpenseId('');
            setPaymentId('');
            // Clear the dependent dropdowns
            setUnits([]);
            setLeases([]);
            setTenants([]);
            setExpenses([]);
            setPayments([]);
        } else {
            // Clear all dropdowns if no property is selected
            setUnits([]);
            setLeases([]);
            setTenants([]);
            setExpenses([]);
            setPayments([]);
        }
    }, [propertyId]);

    // Fetch leases when unitId changes
    useEffect(() => {
        if (unitId) {
            fetchLeases(unitId);
            // Reset states for lease, tenant, payment, and expense
            setLeaseId('');
            setTenantId('');
            setExpenseId('');
            setPaymentId('');
            // Clear the dependent dropdowns
            setLeases([]);
            setTenants([]);
            setExpenses([]);
            setPayments([]);
        } else {
            setLeases([]);
            setTenants([]);
            setExpenses([]);
            setPayments([]);
        }
    }, [unitId]);

    // Fetch payments and expenses when leaseId changes
    useEffect(() => {
        fetchPayments();
        fetchExpenses();
    }, [propertyId, unitId, leaseId]);

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

    // Event handlers for dropdown selections
    const handleExpenseChange = async (e) => {
        const selectedExpenseId = e.target.value;
        setExpenseId(selectedExpenseId);
    
        const selectedExpense = expenses.find(expense => expense.id.toString() === selectedExpenseId);
        if (selectedExpense) {
            setUnitId(selectedExpense.unit_id ? selectedExpense.unit_id.toString() : '');
            setLeaseId('');
            setTenantId('');
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

    const handleDownloadDocument = (documentId) => {
        const downloadUrl = getDocumentDownloadUrl(documentId);
        window.open(downloadUrl, '_blank');
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

    const handleViewDocument = (documentId) => {
        const viewUrl = getDocumentViewUrl(documentId);
        window.open(viewUrl, '_blank');
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
                        placeholder="Search by filename..." 
                        value={searchFilename} 
                        onChange={(e) => setSearchFilename(e.target.value)} 
                        className="py-2 px-4 w-full leading-tight focus:outline-none text-black rounded-l-full"
                    />
                    {/* Filter button */}
                    <button onClick={toggleFilterDropdowns} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-r-full">
                        <Image src="/filter.svg" alt="View" className="h-5 w-5" />
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

                    <button onClick={handleClickUploadButton} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">
                        {/* Custom File upload icon */}
                        <Image src="/upload-file.svg" alt="Upload" className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Selected File Display Section */}
            {isFileSelected && file && (
                <div className="bg-gray-800 px-4 py-2 text-white flex justify-between items-center">
                    <p>Selected File: {file.name}</p>
                    {/* Upload and Custom Filename Input */}
                    <div className="flex items-center">
                        <input 
                            type="text" 
                            placeholder="Custom filename (Optional)" 
                            value={customFilename} 
                            onChange={(e) => setCustomFilename(e.target.value)} 
                            className="bg-gray-700 text-white py-2 px-4 leading-tight focus:outline-none rounded-full"
                        />
                    </div>
                </div>
            )}

            {/* Filter Dropdowns Section */}
            {showFilterDropdowns && (
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
                                disabled={!unitId || expenseId} // Disable if no unit is selected or an expense is selected
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
                                disabled={!!propertyId || expenseId} // Disable if a property is selected or an expense is selected
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
                                onChange={handleExpenseChange}
                                disabled={!propertyId || paymentId}
                            >
                                <option value="">Select Expense</option>
                                {expenses.map(expense => (
                                    <option key={expense.id} value={expense.id}>{expense.description}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Payment */}
                        <div>
                            <label className="text-white block mb-2">Payment</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                                disabled={!propertyId || !unitId || !leaseId || expenseId} // Disable if no property, unit, or lease is selected or an expense is selected
                            >
                                <option value="">Select Payment</option>
                                {payments.map(payment => (
                                    <option key={payment.id} value={payment.id}>{`Amount: ${payment.amount}, Date: ${payment.date}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Dropdowns Section */}
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
                                disabled={!unitId || expenseId} // Disable if no unit is selected or an expense is selected
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
                                disabled={!!propertyId || expenseId} // Disable if a property is selected or an expense is selected
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
                                onChange={handleExpenseChange}
                                disabled={!propertyId || paymentId}
                            >
                                <option value="">Select Expense</option>
                                {expenses.map(expense => (
                                    <option key={expense.id} value={expense.id}>{expense.description}</option>
                                ))}
                            </select>
                        </div>

                        {/* Dropdown for Payment */}
                        <div>
                            <label className="text-white block mb-2">Payment</label>
                            <select
                                className="p-2 rounded bg-gray-800 text-white w-full"
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                                disabled={!propertyId || !unitId || !leaseId || expenseId} // Disable if no property, unit, or lease is selected or an expense is selected
                            >
                                <option value="">Select Payment</option>
                                {payments.map(payment => (
                                    <option key={payment.id} value={payment.id}>{`Amount: ${payment.amount}, Date: ${payment.date}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-right justify-between">
                        {/* Upload and Cancel Buttons */}
                        {isFileSelected && (
                            <div className="self-end ml-auto">
                                <button
                                    onClick={handleUpload}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                    aria-label="Upload document"
                                >
                                    Upload
                                </button>
                                <button
                                    onClick={resetUploadState}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mx-2 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                    aria-label="Cancel upload"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Document List Section */}
            <div className={`bg-gray-700 pl-4 pr-4 pb-4 ${isFileSelected || showFilterDropdowns ? 'rounded-lg' : 'rounded-b-lg'}`}>
                {documents.length > 0 ? (
                    documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                            <span className="text-lg text-white">{doc.custom_filename || doc.filename}</span>
                            <div className="flex items-center">
                                {/* View icon */}
                                <button onClick={() => handleViewDocument(doc.id)} className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-2 rounded mx-1">
                                    <Image src="/view.svg" alt="View" className="h-5 w-5" />
                                </button>
                                {/* Download icon */}
                                <button onClick={() => handleDownloadDocument(doc.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded mx-1">
                                    <Image src="/download.svg" alt="Download" className="h-5 w-5" />
                                </button>
                                {/* Delete icon */}
                                <button onClick={() => handleDelete(doc.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded mx-1">
                                    <Image src="/trash-can.svg" alt="Delete" className="h-5 w-5" />
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
