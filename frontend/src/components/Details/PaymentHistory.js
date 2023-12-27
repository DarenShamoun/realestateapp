import React from 'react';

const PaymentHistory = ({ payments }) => (
  <div className="w-full lg:w-1/2 px-4">
    <div className="bg-gray-700 shadow rounded p-4 mb-4 lg:mb-0">
      <h2 className="text-xl text-white mb-4">Payment History</h2>
      {payments.length > 0 ? (
        <ul className="space-y-2">
          {payments.map((payment, index) => (
            <li key={index} className="text-gray-300">
              <p>Date: {payment.date}</p>
              <p>Amount: ${payment.amount}</p>
            </li>
          ))}
        </ul>
      ) : <p className="text-gray-300">No payment history available</p>}
    </div>
  </div>
);

export default PaymentHistory;
