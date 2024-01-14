'use client';

import React, { useState } from 'react';
import { addRent } from '@/api/rentService';

const CreateRentModal = ({ isOpen, onClose, leaseId }) => {
  const [rentDetails, setRentDetails] = useState({});
  const [rentDate, setRentDate] = useState(new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState({});

  const validateRentDetails = () => {
    let newErrors = {};
    const fields = ['rent', 'trash', 'water_sewer', 'parking', 'debt', 'breaks'];
    fields.forEach(field => {
      if (rentDetails[field] < 0) {
        newErrors[field] = `The ${field} value cannot be negative.`;
      }
    });
    setErrors({...errors, ...newErrors});
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateRentDetails()) {
      return;
    }

    const formattedRentDetails = {
      rent: parseFloat(rentDetails.rent || 0),
      trash: parseFloat(rentDetails.trash || 0),
      water_sewer: parseFloat(rentDetails.water_sewer || 0),
      parking: parseFloat(rentDetails.parking || 0),
      debt: parseFloat(rentDetails.debt || 0),
      breaks: parseFloat(rentDetails.breaks || 0),
    };

    try {
      const rentData = {
        ...formattedRentDetails,
        lease_id: leaseId,
        date: rentDate,
      };
      await addRent(rentData);
      onClose(console.log(rentData));
    } catch (error) {
      console.error('Error adding rent:', error);
      alert('An error occurred while adding the rent. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Rent</h2>
        {/* Rent Fields */}
        <label className="block mb-2 text-sm font-bold text-white">Rent Date</label>
        <input
            type="date"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            value={rentDate}
            onChange={(e) => setRentDate(e.target.value)}
        />
        {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}

        <label className="block mb-2 text-sm font-bold text-white">Rent</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Rent"
            value={rentDetails.rent}
            onChange={(e) => { setRentDetails({ ...rentDetails, rent: e.target.value }) }}
        />
        {errors.rent && <p className="text-red-500 text-xs italic">{errors.rent}</p>}
          
        <label className="block mb-2 text-sm font-bold text-white">Trash Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Trash Fee"
            value={rentDetails.trash}
            onChange={(e) => setRentDetails({ ...rentDetails, trash: e.target.value })}
        />
        {errors.trash && <p className="text-red-500 text-xs italic">{errors.trash}</p>}
  
        <label className="block mb-2 text-sm font-bold text-white">Water & Sewer Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Water & Sewer Fee"
            value={rentDetails.water_sewer}
            onChange={(e) => setRentDetails({ ...rentDetails, water_sewer: e.target.value })}
        />
        {errors.water_sewer && <p className="text-red-500 text-xs italic">{errors.water_sewer}</p>}
  
        <label className="block mb-2 text-sm font-bold text-white">Parking Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Parking Fee"
            value={rentDetails.parking}
            onChange={(e) => setRentDetails({ ...rentDetails, parking: e.target.value })}
        />
        {errors.parking && <p className="text-red-500 text-xs italic">{errors.parking}</p>}
  
        <label className="block mb-2 text-sm font-bold text-white">Debt</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Debt"
            value={rentDetails.debt}
            onChange={(e) => setRentDetails({ ...rentDetails, debt: e.target.value })}
        />
        {errors.debt && <p className="text-red-500 text-xs italic">{errors.debt}</p>}
  
        <label className="block mb-2 text-sm font-bold text-white">Breaks</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            placeholder="Breaks"
            value={rentDetails.breaks}
            onChange={(e) => setRentDetails({ ...rentDetails, breaks: e.target.value })}
        />
        {errors.breaks && <p className="text-red-500 text-xs italic">{errors.breaks}</p>}                
        
        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
            Close
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRentModal;
