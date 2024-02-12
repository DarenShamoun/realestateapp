import React from 'react';
import { useState } from 'react';
import { formatDate } from '@/Utils/DateManagment';
import EditPaymentModal from '@/components/Modals/EditPaymentModal';
import EditRentModal from '@/components/Modals/EditRentModal';

const FinancialHistory = ({ payments, rentHistory, leases, onOpenCreatePayment, onOpenCreateRent }) => {
  const [editPaymentData, setEditPaymentData] = useState(null);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [editRentData, setEditRentData] = useState(null);
  const [isEditRentModalOpen, setIsEditRentModalOpen] = useState(false);

  const onOpenEditPayment = (payment) => {
    setEditPaymentData(payment);
    setIsEditPaymentModalOpen(true);
  };

  const onCloseEditPaymentModal = () => {
    setIsEditPaymentModalOpen(false);
    setEditPaymentData(null);
  };

  const onOpenEditRent = (rent) => {
    setEditRentData(rent);
    setIsEditRentModalOpen(true);
  };

  const onCloseEditRentModal = () => {
    setIsEditRentModalOpen(false);
    setEditRentData(null);
  };

  // Check if there is an active lease
  const hasActiveLease = leases.some(lease => lease.is_active);

  return (
    <div className="w-full lg:w-1/2 px-4">

      {/* Edit Payment Modal */}
      {isEditPaymentModalOpen && (
        <EditPaymentModal
          isOpen={isEditPaymentModalOpen}
          onClose={onCloseEditPaymentModal}
          payment={editPaymentData}
        />
      )}

      {/* Edit Rent Modal */}
      {isEditRentModalOpen && (
        <EditRentModal
          isOpen={isEditRentModalOpen}
          onClose={onCloseEditRentModal}
          rent={editRentData}
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
                  <li key={index} className="text-gray-300 flex justify-between items-center">
                    <div>
                      <p>Date: {formatDate(rent.date, "MM-DD-YYYY")}</p>
                      <p>Total Rent: ${rent.total_rent.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => onOpenEditRent(rent)} 
                      className="ml-4"
                    >
                      <img src="/edit-button.svg" alt="Edit" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-gray-300">No rent history available</p>)}

            {/* Show Add Rent Button if there is an active lease */}
            {hasActiveLease && (
              <button
                onClick={onOpenCreateRent}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Add Rent
              </button>
                )}
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg text-white mb-2">Payment History</h3>
            {payments.length > 0 ? (
              <ul className="space-y-2">
                {payments.slice(0, 6).map((payment, index) => (
                  <li key={index} className="text-gray-300 flex justify-between items-center">
                    <div>
                      <p>Date: {formatDate(payment.date, "MM-DD-YYYY")}</p>
                      <p>Amount: ${payment.amount.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => onOpenEditPayment(payment)} 
                      className="ml-4"
                    >
                      <img src="/edit-button.svg" alt="Edit" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p className="text-gray-300">No payment history available</p>)}
              {/* Show Add Payment Button if there is an active lease */}
              {hasActiveLease && (
                <button
                  onClick={onOpenCreatePayment}
                  className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
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
