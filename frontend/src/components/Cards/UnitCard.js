'use client';

import React from 'react';
import Link from 'next/link';

const UnitCard = ({ unit, isManagementMode, onEdit, onDelete }) => {
  const displayTotalRent = (totalRent) => totalRent ? totalRent.toFixed(2) : '0.00';

  const cardContent = (
    <>
      <h3 className="text-white font-bold">Unit {unit.unit_number}</h3>
      <p className="text-gray-300">Occupied: {unit.is_occupied ? 'Yes' : 'No'}</p>
      {unit.is_occupied && unit.tenant && (
        <p className="text-gray-300">Tenant: {unit.tenant.full_name}</p>
      )}
      <p className="text-gray-300">Total Rent: ${displayTotalRent(unit.total_rent)}</p>
    </>
  );

  return isManagementMode ? (
    <div
      className="unit-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150"
      onClick={() => onEdit(unit)}
    >
      {cardContent}
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={(e) => { e.stopPropagation(); onEdit(unit); }} className="text-blue-500 hover:text-blue-700">Edit</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(unit.id); }} className="text-red-500 hover:text-red-700">Delete</button>
      </div>
    </div>
  ) : (
    <Link href={`/units/${unit.id}`} className="unit-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
      {cardContent}
    </Link>
  );
};

export default UnitCard;
