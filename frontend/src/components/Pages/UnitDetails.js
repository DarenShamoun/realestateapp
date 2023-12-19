'use client';

import React, { useEffect, useState } from 'react';
import { getUnit } from '@/api/unitService';
import { getTenant } from '@/api/tenantService';
import { getPaymentsByUnitId } from '@/api/paymentService';

const UnitDetails = ({ unitId }) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unitData = await getUnit(unitId);
        setUnit(unitData);

        if (unitData.tenant_id) {
          const tenantData = await getTenant(unitData.tenant_id);
          setTenant(tenantData);
        }

        const paymentsData = await getPaymentsByUnitId(unitId);
        setPayments(paymentsData);
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
        <p className="text-gray-300">Property ID: {unit.property_id}</p>
        <p className="text-gray-300">Is Occupied: {unit.is_occupied ? 'Yes' : 'No'}</p>
        <p className="text-gray-300">Total Rent: ${unit.total_rent}</p>
        {/* Other details as needed */}
      </div>

      {/* Tenant Details Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Tenant Details</h2>
        {tenant ? (
          <>
            <p className="text-gray-300">Name: {tenant.full_name}</p>
            <p className="text-gray-300">Primary Phone: {tenant.primary_phone}</p>
            {/* Other tenant details */}
          </>
        ) : <p className="text-gray-300">No tenant details available</p>}
      </div>

      {/* Payment History Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Payment History</h2>
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <div key={index} className="text-gray-300">
              <p>Date: {payment.date}</p>
              <p>Amount: ${payment.amount}</p>
              {/* Other payment details */}
            </div>
          ))
        ) : <p className="text-gray-300">No payment history available</p>}
      </div>

      {/* Chart Section */}
      <div className="bg-gray-700 shadow rounded p-4">
        <h2 className="text-xl text-white">Financial Overview</h2>
      </div>
    </div>
  );
};

export default UnitDetails;
