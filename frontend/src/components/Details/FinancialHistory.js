import React from 'react';
import { useState } from 'react';
import { formatDate } from '@/Utils/DateManagment';
import EditPaymentModal from '@/components/Modals/EditPaymentModal';

const FinancialHistory = ({ payments, rentHistory, leases, onOpenCreatePayment, onOpenCreateRent }) => {
  const [editPaymentData, setEditPaymentData] = useState(null);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);

  const onOpenEditPayment = (payment) => {
    setEditPaymentData(payment);
    setIsEditPaymentModalOpen(true);
  };

  const onCloseEditPaymentModal = () => {
    setIsEditPaymentModalOpen(false);
    setEditPaymentData(null);
  };

  return (
    <div className="w-full lg:w-1/2 px-4">

      {isEditPaymentModalOpen && (
        <EditPaymentModal
          isOpen={isEditPaymentModalOpen}
          onClose={onCloseEditPaymentModal}
          payment={editPaymentData}
        />
      )}

      <div className="bg-gray-700 shadow rounded p-4 mb-4 lg:mb-0">
        <h2 className="text-xl text-white mb-4">Financial History</h2>
        <div className="grid grid-cols-2 gap-4">

          {/* Rent History */}
          <div>
            <h3 className="text-lg text-white mb-2">Rent History</h3>
            {rentHistory.length > 0 ? (
              <ul className="space-y-2">
                {rentHistory.map((rent, index) => (
                  <li key={index} className="text-gray-300">
                    <p>Date: {formatDate(rent.date, "MM-DD-YYYY")}</p>
                    <p>Total Rent: ${rent.total_rent.toFixed(2)}</p>
                    <button 
                      onClick={() => onOpenEditRent(rent)} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-300">No rent history available</p>}
            {/* Add Rent Button */}
            <button
              onClick={onOpenCreateRent}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Add Rent
            </button>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg text-white mb-2">Payment History</h3>
            {payments.length > 0 ? (
              <ul className="space-y-2">
                {payments.map((payment, index) => (
                  <li key={index} className="text-gray-300">
                    <p>Date: {formatDate(payment.date, "MM-DD-YYYY")}</p>
                    <p>Amount: ${payment.amount.toFixed(2)}</p>
                    <button 
                      onClick={() => onOpenEditPayment(payment)} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No payment history available</p>
            )}
            {/* Add Payment Button */}
            {leases && leases.length > 0 && (
              <button
                onClick={onOpenCreatePayment}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Add Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHistory;
