import React, { useState, useEffect } from 'react';
import { updateUnit } from '@/api/unitService';

const EditUnitModal = ({ show, onClose, unitData }) => {
    const [formData, setFormData] = useState({
        property_id: unitData.property_id,
        unit_number: unitData.unit_number,
        tenant_id: unitData.tenant_id, // Optional, based on your unit model structure
    });

    useEffect(() => {
        if (unitData) {
            setFormData({
                property_id: unitData.property_id,
                unit_number: unitData.unit_number,
                tenant_id: unitData.tenant_id,
            });
        }
    }, [unitData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUnit(unitData.id, formData);
            onClose(); // Close the modal on success
        } catch (error) {
            console.error('Error updating unit:', error);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="p-6 text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Edit Unit</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            name="unit_number"
                            value={formData.unit_number}
                            onChange={handleChange}
                            placeholder="Unit Number"
                            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                        <input
                            type="text"
                            name="tenant_id"
                            value={formData.tenant_id}
                            onChange={handleChange}
                            placeholder="Tenant ID (Optional)"
                            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                        <div className="flex justify-end gap-4">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Unit</button>
                            <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg border border-gray-300 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-700">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUnitModal;
