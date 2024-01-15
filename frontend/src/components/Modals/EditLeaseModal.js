'use client';

import React, { useState, useEffect } from 'react';
import { updateLease } from '@/api/leaseService';

const EditLeaseModal = ({ isOpen, onClose, lease }) => {
    const [leaseData, setLeaseData] = useState({
        start_date: '',
        end_date: '',
        monthly_rent: 0,
        deposit: 0,
        terms: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (lease) {
        setLeaseData({
            start_date: lease.start_date.split('T')[0],
            end_date: lease.end_date ? lease.end_date.split('T')[0] : '',
            monthly_rent: lease.monthly_rent,
            deposit: lease.deposit,
            terms: lease.terms
        });
        }
    }, [lease]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaseData({ ...leaseData, [name]: value });
    };

    const validateLeaseDetails = () => {
        let newErrors = {};
        if (!leaseData.start_date) {
            newErrors.start_date = 'Start date is required.';
        }
        if (!leaseData.monthly_rent || leaseData.monthly_rent <= 0) {
            newErrors.monthly_rent = 'Please enter a valid monthly rent.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateLeaseDetails()) {
        return;
        }

        const formattedLeaseData = {
        ...leaseData,
        end_date: leaseData.end_date || null,
        };

        try {
        await updateLease(lease.id, formattedLeaseData);
        onClose();
        } catch (error) {
        console.error('Error updating lease:', error);
        alert('An error occurred while updating the lease. Please try again.');
        }
    };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4 text-white">Edit Lease</h2>
            
            {/* Lease Form Fields */}
            {/* Start Date */}
            <label className="block mb-2 text-sm font-bold text-white">Start Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                name="start_date"
                value={leaseData.start_date}
                onChange={handleInputChange}
            />
            {errors.start_date && <p className="text-red-500 text-xs italic">{errors.start_date}</p>}

            {/* End Date */}
            <label className="block mb-2 text-sm font-bold text-white">End Date</label>
            <input
                type="date"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                name="end_date"
                value={leaseData.end_date}
                onChange={handleInputChange}
            />

            {/* Monthly Rent */}
            <label className="block mb-2 text-sm font-bold text-white">Monthly Rent</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                name="monthly_rent"
                placeholder="Monthly Rent"
                value={leaseData.monthly_rent}
                onChange={handleInputChange}
            />
            {errors.monthly_rent && <p className="text-red-500 text-xs italic">{errors.monthly_rent}</p>}

            {/* Deposit */}
            <label className="block mb-2 text-sm font-bold text-white">Deposit</label>
            <input
                type="number"
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                name="deposit"
                placeholder="Deposit"
                value={leaseData.deposit}
                onChange={handleInputChange}
            />

            {/* Lease Terms */}
            <label className="block mb-2 text-sm font-bold text-white">Lease Terms</label>
            <textarea
                className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                name="terms"
                placeholder="Lease Terms"
                value={leaseData.terms}
                onChange={handleInputChange}
                rows="3"
            ></textarea>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
                <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
                    Close
                </button>
                <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                    Update
                </button>
            </div>
        </div>
    </div>
    );
};
            
export default EditLeaseModal;
            