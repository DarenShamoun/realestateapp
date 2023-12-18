'use client';

import React from 'react';
import Link from 'next/link';

const UnitCard = ({ unit }) => {
  return (
    <div className="unit-card bg-gray-700 shadow rounded p-4 hover:bg-gray-600 transition ease-in-out duration-150">
      <h3 className="text-white font-bold">Unit {unit.unit_number}</h3>
      <p className="text-gray-300">Occupied: {unit.is_occupied ? 'Yes' : 'No'}</p>
      <p className="text-gray-300">Total Rent: ${unit.total_rent}</p>
      {/* Additional unit details */}
      <Link href={`/units/${unit.id}`} className="text-blue-500 hover:text-blue-700">View Details</Link>
    </div>
  );
};

export default UnitCard;
