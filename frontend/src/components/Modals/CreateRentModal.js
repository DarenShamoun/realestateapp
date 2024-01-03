import React, { useState } from 'react';
import { addRent } from '@/api/rentService';

const CreateRentModal = ({ isOpen, onClose, leaseId }) => {
  const [rentData, setRentData] = useState({
    rent: '',
    trash: '',
    water_sewer: '',
    parking: '',
    debt: '',
    breaks: '',
    date: new Date().toISOString().slice(0, 10)
  });
  const [errors, setErrors] = useState({});

  const validateRentDetails = () => {
    let newErrors = {};
    const fields = ['rent', 'trash', 'water_sewer', 'parking', 'debt', 'breaks'];
    fields.forEach(field => {
      if (rentData[field] < 0) {
        newErrors[field] = `The ${field} value cannot be negative.`;
      }
    });
    if (!rentData.date) {
      newErrors.date = 'Please enter a valid date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRentData({ ...rentData, [name]: parseFloat(value) || 0 });
  };

  const handleSubmit = async () => {
    if (!validateRentDetails()) {
      return;
    }

    try {
      await addRent({ ...rentData, lease_id: leaseId });
      alert('Rent added successfully.');
      onClose();
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
        {/* Rent Date */}
        <label className="block mb-2 text-sm font-bold text-white">Rent Date</label>
        <input
            type="date"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="date"
            value={rentData.date}
            onChange={handleInputChange}
        />
        {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}        

        <label className="block mb-2 text-sm font-bold text-white">Rent</label>
        <input 
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="rent"
            value={rentData.rent}
            onChange={handleInputChange}
        />
        {errors.rent && <p className="text-red-500 text-xs italic">{errors.rent}</p>}
        <label className="block mb-2 text-sm font-bold text-white">Trash</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="trash"
            value={rentData.trash}
            onChange={handleInputChange}
        />
        {errors.trash && <p className="text-red-500 text-xs italic">{errors.trash}</p>}
        <label className="block mb-2 text-sm font-bold text-white">Water/Sewer</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="water_sewer"
            value={rentData.water_sewer}
            onChange={handleInputChange}
        />
        {errors.water_sewer && <p className="text-red-500 text-xs italic">{errors.water_sewer}</p>}
        <label className="block mb-2 text-sm font-bold text-white">Parking</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="parking"
            value={rentData.parking}
            onChange={handleInputChange}
        /> 
        {errors.parking && <p className="text-red-500 text-xs italic">{errors.parking}</p>}
        <label className="block mb-2 text-sm font-bold text-white">Debt</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="debt"
            value={rentData.debt}
            onChange={handleInputChange}
        />
        {errors.debt && <p className="text-red-500 text-xs italic">{errors.debt}</p>}
        <label className="block mb-2 text-sm font-bold text-white">Breaks</label>
        <input
            type="number"
            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
            name="breaks"
            value={rentData.breaks}
            onChange={handleInputChange}
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
