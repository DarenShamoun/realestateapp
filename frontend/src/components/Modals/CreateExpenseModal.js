import React, { useState } from 'react';
import { addExpense } from '@/api/expenseService'; // Assuming this is the correct path to your expense service

const CreateExpenseModal = ({ isOpen, onClose, properties, units, context }) => {
    const [expenseData, setExpenseData] = useState({
        property_id: '',
        unit_id: null,
        amount: '',
        category: '',
        date: '',
        description: ''
    }); 
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    const validateExpenseDetails = () => {
        let newErrors = {};
        // Add your validation logic here
        // ...

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateExpenseDetails()) {
        return;
        }

        const payload = {
            ...expenseData,
            unit_id: expenseData.unit_id || null
        };

        try {
            await addExpense(payload);
            onClose();
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('An error occurred while adding the expense. Please try again.');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4 text-white">Add Expense</h2>
                
                {/* Form Fields */}

                {/* Property/Unit Dropdown based on Context */}
                {context === 'property' ? (
                    <>
                        <label className="block mb-2 text-sm font-bold text-white">Property</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                            name="property_id"
                            value={expenseData.property_id}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>{property.name}</option>
                            ))}
                        </select>
                    </>
                ) : (
                    <>
                        <label className="block mb-2 text-sm font-bold text-white">Unit</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                            name="unit_id"
                            value={expenseData.unit_id}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>{unit.unit_number}</option>
                            ))}
                        </select>
                    </>
                )}
                {errors.property_id && <p className="text-red-500 text-xs italic">{errors.property_id}</p>}
                {errors.unit_id && <p className="text-red-500 text-xs italic">{errors.unit_id}</p>}

                {/* Date */}
                <label className="block mb-2 text-sm font-bold text-white">Date</label>
                    <input
                    type="date"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    name="date"
                    value={expenseData.date}
                    onChange={handleInputChange}
                    />
                {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}

                {/* Category */}
                <label className="block mb-2 text-sm font-bold text-white">Category</label>
                    <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    name="category"
                    placeholder="Category"
                    value={expenseData.category}
                    onChange={handleInputChange}
                    />
                {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}

                {/* Amount */}
                <label className="block mb-2 text-sm font-bold text-white">Amount</label>
                    <input
                    type="number"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    name="amount"
                    placeholder="Amount"
                    value={expenseData.amount}
                    onChange={handleInputChange}
                    />
                {errors.amount && <p className="text-red-500 text-xs italic">{errors.amount}</p>}

                {/* Description */}
                <label className="block mb-2 text-sm font-bold text-white">Description</label>
                    <input
                    type="text"
                    className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
                    name="description"
                    placeholder="Description"
                    value={expenseData.description}
                    onChange={handleInputChange}
                    />
                {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">
                        Close
                    </button>
                    <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">
                        Add Expense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateExpenseModal;
