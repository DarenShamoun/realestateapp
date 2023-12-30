import React from 'react';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const PaymentHistory = ({ payments, rentHistory }) => (
  <div className="w-full lg:w-1/2 px-4">
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
                  <p>Date: {`${new Date(rent.date).getFullYear()}-${(new Date(rent.date).getMonth() + 1).toString().padStart(2, '0')}`}</p>
                  <p>Total Rent: ${rent.total_rent.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-300">No rent history available</p>}
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-lg text-white mb-2">Payment History</h3>
          {payments.length > 0 ? (
            <ul className="space-y-2">
              {payments.map((payment, index) => (
                <li key={index} className="text-gray-300">
                  <p>Date: {formatDate(payment.date)}</p>
                  <p>Amount: ${payment.amount.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-300">No payment history available</p>}
        </div>
      </div>
    </div>
  </div>
);

export default PaymentHistory;
