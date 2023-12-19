'use client';

import React, { useEffect, useState } from 'react';
import { getUnit } from '@/api/unitService';
// Import additional services as needed for fetching tenant, payment history, etc.

const UnitDetails = ({ unitId }) => {
  const [unit, setUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch unit details
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unitData = await getUnit(unitId);
        setUnit(unitData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (unitId) {
      fetchUnitDetails();
    }
  }, [unitId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!unit) {
    return <div>No unit details found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Unit {unit.unit_number}</h1>
      {/* Unit Details Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Unit Details</h2>
        {/* Display unit details here */}
      </div>

      {/* Tenant Details Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Tenant Details</h2>
        {/* Fetch and display tenant details here */}
      </div>

      {/* Payment History Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Payment History</h2>
        {/* Fetch and display payment history here */}
      </div>

      {/* Chart Section (Optional) */}
      <div className="bg-gray-700 shadow rounded p-4">
        <h2 className="text-xl text-white">Financial Overview</h2>
        {/* Incorporate a chart component here */}
      </div>
    </div>
  );
};

export default UnitDetails;
