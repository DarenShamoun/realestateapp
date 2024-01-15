'use client';

import React, { useState, useEffect } from 'react';
import { updatePayment } from '@/api/paymentService';

const EditPaymentModal = ({ isOpen, onClose, payment }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: '',
    date: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setPaymentData({
        amount: payment.amount,
        payment_method: payment.payment_method,
        date: payment.date.split('T')[0],
      });
    }
  }, [payment]);

  const validatePaymentDetails = () => {
    let newErrors = {};
    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount.';
    }
    if (!paymentData.date) {
      newErrors.date = 'Please enter a valid date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validatePaymentDetails()) {
      return;
    }

    try {
      await updatePayment(payment.id, paymentData);
      onClose();
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('An error occurred while updating the payment. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Payment</h2>
        
        {/* Payment Date */}
        <label className="block mb-2 text-sm font-bold text-white">Payment Date</label>
        <input
          type="date"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="date"
          value={paymentData.date}
          onChange={handleInputChange}
        />
        {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
  
        {/* Payment Amount */}
        <label className="block mb-2 text-sm font-bold text-white">Amount</label>
        <input
          type="number"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="amount"
          placeholder="Amount"
          value={paymentData.amount}
          onChange={handleInputChange}
        />
        {errors.amount && <p className="text-red-500 text-xs italic">{errors.amount}</p>}
  
        {/* Payment Method */}
        <label className="block mb-2 text-sm font-bold text-white">Payment Method</label>
        <input
          type="text"
          className="shadow border rounded w-full py-2 px-3 mb-3 text-gray-600"
          name="payment_method"
          placeholder="Payment Method"
          value={paymentData.payment_method}
          onChange={handleInputChange}
        />
        
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
}

export default EditPaymentModal;
