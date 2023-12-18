import React, { useState, useEffect } from 'react';
import { updateProperty } from '@/api/propertyService';

const EditPropertyModal = ({ property, show, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    property_type: '',
    address: '',
    purchase_price: '',
    year_built: '',
    square_footage: ''
  });

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        property_type: property.property_type,
        address: property.address,
        purchase_price: property.purchase_price || '',
        year_built: property.year_built || '',
        square_footage: property.square_footage || ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProperty(property.id, formData);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="p-6 text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Edit Property</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Property Name"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
            <input
              type="text"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              placeholder="Property Type"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
            <input
              type="number"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="Purchase Price"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              placeholder="Year Built"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            <input
              type="number"
              name="square_footage"
              value={formData.square_footage}
              onChange={handleChange}
              placeholder="Square Footage"
              className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            <div className="flex justify-end gap-4">
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Property</button>
              <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
