import React from 'react';

const RentDetails = ({ rentDetails, totalRent, rentDate }) => {
  const formatCurrency = (value) => value ? `$${value.toFixed(2)}` : 'N/A';

  return (
    <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/4">
      <h2 className="text-xl text-white">Rent Details</h2>
      {rentDate && <p className="text-gray-300">Rent Date: {rentDate}</p>}
      {rentDetails && Object.keys(rentDetails).length > 0 ? (
        <>
          <p className="text-gray-300">Base Rent: {formatCurrency(rentDetails.rent)}</p>
          <p className="text-gray-300">Trash: {formatCurrency(rentDetails.trash)}</p>
          <p className="text-gray-300">Water & Sewer: {formatCurrency(rentDetails.water_sewer)}</p>
          <p className="text-gray-300">Parking: {formatCurrency(rentDetails.parking)}</p>
          <p className="text-gray-300">Debt: {formatCurrency(rentDetails.debt)}</p>
          <p className="text-gray-300">Breaks: {formatCurrency(rentDetails.breaks)}</p>
          <p className="text-gray-300 font-bold">Total Rent: {formatCurrency(totalRent)}</p>
        </>
      ) : (
        <p className="text-gray-300">Rent details not available for this unit.</p>
      )}
    </div>
  );
};

export default RentDetails;
