import React from 'react';
import { formatDate } from '@/Utils/DateManagment';

const LeaseDetails = ({ leases, onOpenCreateLease, onOpenEditLease }) => (
  <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/4 relative">
    <div className="flex justify-between items-center">
      <h2 className="text-xl text-white">Lease Details</h2>
      {/* Edit Lease Button */}
      <button 
        onClick={() => onOpenEditLease(leases[0])} // Assuming you want to edit the first lease
        className="ml-4"
      >
        <img src="/edit-button.svg" alt="Edit" className="h-4 w-4" />
      </button>
    </div>
    
    {leases && leases.length > 0 ? (
      leases.map((lease, index) => (
        <div key={index} className="text-gray-300 mb-2">
          <p>Base Rent: ${lease.monthly_rent.toFixed(2)}</p>
          <p>Deposit: {lease.deposit ? `$${lease.deposit.toFixed(2)}` : 'N/A'}</p>
          <p>Terms: {lease.terms || 'N/A'}</p>
          <p>Start Date: {formatDate(lease.start_date, "MM-DD-YYYY")}</p>
          <p>End Date: {lease.end_date || 'N/A'}</p>
        </div>
      ))
    ) : (
      <>
        <p className="text-gray-300">No current lease agreement.</p>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={onOpenCreateLease}
        >
          Create Lease
        </button>
      </>
    )}
  </div>
);

export default LeaseDetails;
