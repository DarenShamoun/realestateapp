'use client';

import React, { useState, useEffect } from 'react';
import { updateTenant } from '@/api/tenantService';

const EditTenantModal = ({ isOpen, onClose, tenant }) => {
  const [tenantData, setTenantData] = useState({
    full_name: '',
    primary_phone: '',
    secondary_phone: '',
    email: '',
    contact_notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tenant) {
      setTenantData({
        full_name: tenant.full_name || '',
        primary_phone: tenant.primary_phone || '',
        secondary_phone: tenant.secondary_phone || '',
        email: tenant.email || '',
        contact_notes: tenant.contact_notes || ''
      });
    }
  }, [tenant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
  };

  const validateTenantDetails = () => {
    let newErrors = {};
    if (!tenantData.full_name) {
      newErrors.full_name = 'Full name is required.';
    }
    if (!tenantData.primary_phone) {
      newErrors.primary_phone = 'Primary phone is required.';
    }
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateTenantDetails()) {
      return;
    }

    try {
      await updateTenant(tenant.id, tenantData);
      onClose();
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('An error occurred while updating the tenant. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Tenant</h2>
        
        {/* Tenant Form Fields */}
        {/* Full Name */}
        <label className="block mb-2 text-sm font-bold text-white">Full Name</label>
        <input
          type="text"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="full_name"
          placeholder="Full Name"
          value={tenantData.full_name}
          onChange={handleInputChange}
        />
        {errors.full_name && <p className="text-red-500 text-xs italic">{errors.full_name}</p>}

        {/* Primary Phone */}
        <label className="block mb-2 text-sm font-bold text-white">Primary Phone</label>
        <input
            type="text"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="primary_phone"
            placeholder="Primary Phone"
            value={tenantData.primary_phone}
            onChange={handleInputChange}
        />
        {errors.primary_phone && <p className="text-red-500 text-xs italic">{errors.primary_phone}</p>}

        {/* Secondary Phone */}
        <label className="block mb-2 text-sm font-bold text-white">Secondary Phone</label>
        <input
            type="text"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="secondary_phone"
            placeholder="Secondary Phone"
            value={tenantData.secondary_phone}
            onChange={handleInputChange}
        />
        {errors.secondary_phone && <p className="text-red-500 text-xs italic">{errors.secondary_phone}</p>}

        {/* Email */}
        <label className="block mb-2 text-sm font-bold text-white">Email</label>
        <input
            type="text"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="email"
            placeholder="Email"
            value={tenantData.email}
            onChange={handleInputChange}
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}

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

export default EditTenantModal;
