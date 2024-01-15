'use client';

import React, { useState, useEffect } from 'react';
import { updateRent } from '@/api/rentService';

const EditRentModal = ({ isOpen, onClose, rent }) => {
  const [rentDetails, setRentDetails] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rent) {
      setRentDetails({
        rent: rent.rent,
        trash: rent.trash,
        water_sewer: rent.water_sewer,
        parking: rent.parking,
        debt: rent.debt,
        breaks: rent.breaks,
        date: rent.date.split('T')[0]
      });
    }
  }, [rent]);

  const validateRentDetails = () => {
    let newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'date' ? value : parseFloat(value) || 0;
    setRentDetails({ ...rentDetails, [name]: parsedValue });
  };  

  const handleSubmit = async () => {
    if (!validateRentDetails()) {
      return;
    }

    try {
      await updateRent(rent.id, rentDetails);
      onClose();
    } catch (error) {
      console.error('Error updating rent:', error);
      alert('An error occurred while updating the rent. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Rent</h2>

        {/* Rent Fields */}

        {/* Rent Date */}
        <label className="block mb-2 text-sm font-bold text-white">Rent Date</label>
        <input
            type="date"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="date"
            value={rentDetails.date}
            onChange={(e) => setRentDetails({ ...rentDetails, date: e.target.value })}
        />
        {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
      
        {/* Rent Amount */}
        <label className="block mb-2 text-sm font-bold text-white">Rent</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="rent"
            placeholder="Rent Amount"
            value={rentDetails.rent}
            onChange={handleInputChange}
        />
        {errors.rent && <p className="text-red-500 text-xs italic">{errors.rent}</p>}

        {/* Trash Fee */}
        <label className="block mb-2 text-sm font-bold text-white">Trash Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="trash"
            placeholder="Trash Fee"
            value={rentDetails.trash}
            onChange={handleInputChange}
        />
        {errors.trash && <p className="text-red-500 text-xs italic">{errors.trash}</p>}

        {/* Water/Sewer Fee */}
        <label className="block mb-2 text-sm font-bold text-white">Water & Sewer Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="water_sewer"
            placeholder="Water & Sewer Fee"
            value={rentDetails.water_sewer}
            onChange={handleInputChange}
        />
        {errors.water_sewer && <p className="text-red-500 text-xs italic">{errors.water_sewer}</p>}

        {/* Parking Fee */}
        <label className="block mb-2 text-sm font-bold text-white">Parking Fee</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="parking"
            placeholder="Parking Fee"
            value={rentDetails.parking}
            onChange={handleInputChange}
        />
        {errors.parking && <p className="text-red-500 text-xs italic">{errors.parking}</p>}

        {/* Debt */}
        <label className="block mb-2 text-sm font-bold text-white">Debt</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="debt"
            placeholder="Debt"
            value={rentDetails.debt}
            onChange={handleInputChange}
        />
        {errors.debt && <p className="text-red-500 text-xs italic">{errors.debt}</p>}

        {/* Breaks */}
        <label className="block mb-2 text-sm font-bold text-white">Breaks</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="breaks"
            placeholder="Breaks"
            value={rentDetails.breaks}
            onChange={handleInputChange}
        />
        {errors.breaks && <p className="text-red-500 text-xs italic">{errors.breaks}</p>}

        {/* Buttons */}
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

export default EditRentModal;
