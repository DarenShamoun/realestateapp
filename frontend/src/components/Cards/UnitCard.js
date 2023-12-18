'use client';

import React from 'react';
import Link from 'next/link';

const UnitCard = ({ unit }) => {
  const displayTotalRent = (totalRent) => {
    return totalRent ? totalRent.toFixed(2) : '0.00';
  };

  return (
    <Link href={`/units/${unit.id}`} className="unit-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
      <div>
        <h3 className="text-white font-bold">Unit {unit.unit_number}</h3>
        <p className="text-gray-300">Occupied: {unit.is_occupied ? 'Yes' : 'No'}</p>
        {unit.is_occupied && unit.tenant && (
          <p className="text-gray-300">Tenant: {unit.tenant.full_name}</p>
        )}
        <p className="text-gray-300">Total Rent: ${displayTotalRent(unit.total_rent)}</p>
        {/* Additional unit details */}
      </div>
    </Link>
  );
};

export default UnitCard;