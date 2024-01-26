'use client';

import React, { useState } from 'react';
import { addProperty } from '@/api/propertyService';

const CreatePropertyModal = ({ isOpen, onClose }) => {
  const [propertyData, setPropertyData] = useState({
    name: '',
    property_type: '',
    address: '',
    purchase_price: '',
    year_built: '',
    square_footage: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const validatePropertyDetails = () => {
    let newErrors = {};
    if (!propertyData.name.trim()) {
      newErrors.name = 'Property name is required.';
    }
    if (!propertyData.property_type || !['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'].includes(propertyData.property_type)) {
      newErrors.property_type = 'Valid property type is required (RESIDENTIAL, COMMERCIAL, INDUSTRIAL).';
    }
    if (!propertyData.address.trim()) {
      newErrors.address = 'Address is required.';
    }
    if (propertyData.purchase_price && isNaN(propertyData.purchase_price)) {
      newErrors.purchase_price = 'Purchase price must be a number.';
    }
    if (propertyData.year_built && isNaN(propertyData.year_built)) {
      newErrors.year_built = 'Year built must be a number.';
    }
    if (propertyData.square_footage && isNaN(propertyData.square_footage)) {
      newErrors.square_footage = 'Square footage must be a number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePropertyDetails()) {
      return;
    }
    try {
      await addProperty(propertyData);
      onClose();
    } catch (error) {
      console.error('Error adding property:', error);
      alert('An error occurred while adding the property. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Property</h2>
        
        {/* Property Form Fields */}
        {/* Name */}
        <label className="block mb-2 text-sm font-bold text-white">Name</label>
        <input
          type="text"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="name"
          placeholder="Property Name"
          value={propertyData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}

        {/* Property Type */}
        <label className="block mb-2 text-sm font-bold text-white">Property Type</label>
        <select
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="property_type"
          value={propertyData.property_type}
          onChange={handleInputChange}
        >
          <option value="">Select Type</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="INDUSTRIAL">Industrial</option>
        </select>
        {errors.property_type && <p className="text-red-500 text-xs italic">{errors.property_type}</p>}

        {/* Address */}
        <label className="block mb-2 text-sm font-bold text-white">Address</label>
        <input
          type="text"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="address"
          placeholder="Address"
          value={propertyData.address}
          onChange={handleInputChange}
        />
        {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}

        {/* Purchase Price */}
        <label className="block mb-2 text-sm font-bold text-white">Purchase Price</label>
        <input
          type="number"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="purchase_price"
          placeholder="Purchase Price"
          value={propertyData.purchase_price}
          onChange={handleInputChange}
        />
        {errors.purchase_price && <p className="text-red-500 text-xs italic">{errors.purchase_price}</p>}

        {/* Year Built */}
        <label className="block mb-2 text-sm font-bold text-white">Year Built</label>
        <input
          type="number"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="year_built"
          placeholder="Year Built"
          value={propertyData.year_built}
          onChange={handleInputChange}
        />
        {errors.year_built && <p className="text-red-500 text-xs italic">{errors.year_built}</p>}

        {/* Square Footage */}
        <label className="block mb-2 text-sm font-bold text-white">Square Footage</label>
        <input
          type="number"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="square_footage"
          placeholder="Square Footage"
          value={propertyData.square_footage}
          onChange={handleInputChange}
        />
        {errors.square_footage && <p className="text-red-500 text-xs italic">{errors.square_footage}</p>}

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Close
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            Add Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePropertyModal;
