'use client';

import React, { useState } from 'react';
import { addUnit } from '@/api/unitService';

const CreateUnitModal = ({ isOpen, onClose, propertyId }) => {
  const [unitData, setUnitData] = useState({
    unit_number: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const validateUnitDetails = () => {
    let newErrors = {};
    if (!unitData.unit_number) {
      newErrors.unit_number = 'Unit number is required.';
    }
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateUnitDetails()) {
      return;
    }

    try {
      await addUnit({ ...unitData, property_id: propertyId });
      onClose();
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('An error occurred while adding the unit. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Unit</h2>
        
        {/* Unit Form Fields */}
        {/* Unit Number */}
        <label className="block mb-2 text-sm font-bold text-white">Unit Number</label>
        <input
          type="text"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="unit_number"
          value={unitData.unit_number}
          onChange={handleInputChange}
        />
        {errors.unit_number && <p className="text-red-500 text-xs italic">{errors.unit_number}</p>}

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Close
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            Add Unit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUnitModal;
