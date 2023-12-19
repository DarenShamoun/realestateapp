'use client';

import React, { useEffect, useState } from 'react';
import { getUnit } from '@/api/unitService';
import { getTenant } from '@/api/tenantService';
import { getPaymentsByUnitId } from '@/api/paymentService';
import { getLeasesByUnitId } from '@/api/leaseService';

const UnitDetails = ({ unitId }) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unitData = await getUnit(unitId);
        setUnit(unitData);

        if (unitData.tenant && unitData.tenant.id) {
          const tenantData = await getTenant(unitData.tenant.id);
          setTenant(tenantData);
        }

        const paymentsData = await getPaymentsByUnitId(unitId);
        setPayments(paymentsData);

        const leasesData = await getLeasesByUnitId(unitId);
        setLeases(leasesData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnitDetails();
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

      {/* Tenant Details Section */}
      <div className="bg-gray-700 shadow rounded p-4 mb-4">
        <h2 className="text-xl text-white">Tenant Details</h2>
        {tenant ? (
          <>
            <p className="text-gray-300">Name: {tenant.full_name}</p>
            <p className="text-gray-300">Primary Phone: {tenant.primary_phone}</p>
            <p className="text-gray-300">Secondary Phone: {tenant.secondary_phone || 'N/A'}</p>
            <p className="text-gray-300">Contact Notes: {tenant.contact_notes || 'None'}</p>
            {/* Other tenant details */}
          </>
        ) : <p className="text-gray-300">No tenant details available</p>}
      </div>
      
      {/* Lease Details Section */}
      {leases && leases.length > 0 && (
        <div className="bg-gray-700 shadow rounded p-4 mb-4">
          <h2 className="text-xl text-white">Lease Details</h2>
          {leases.map((lease, index) => (
            <div key={index} className="text-gray-300">
              <p>Start Date: {lease.start_date}</p>
              <p>End Date: {lease.end_date || 'N/A'}</p>
              <p>Base Rent: ${lease.monthly_rent.toFixed(2)}</p>
              <p>Deposit: ${lease.deposit ? lease.deposit.toFixed(2) : 'N/A'}</p>
              <p>Terms: {lease.terms || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Rent Details Section */}
      {unit && unit.rent_details && (
        <div className="bg-gray-700 shadow rounded p-4 mb-4">
          <h2 className="text-xl text-white">Rent Details</h2>
          <p className="text-gray-300">Base Rent: ${unit.rent_details.rent.toFixed(2)}</p>
          <p className="text-gray-300">Trash: ${unit.rent_details.trash.toFixed(2)}</p>
          <p className="text-gray-300">Water & Sewer: ${unit.rent_details.water_sewer.toFixed(2)}</p>
          <p className="text-gray-300">Parking: ${unit.rent_details.parking.toFixed(2)}</p>
          <p className="text-gray-300">Debt: ${unit.rent_details.debt.toFixed(2)}</p>
          <p className="text-gray-300">Breaks: ${unit.rent_details.breaks.toFixed(2)}</p>
          <p className="text-gray-300 font-bold">Total Rent: ${unit.total_rent.toFixed(2)}</p>
        </div>
      )}

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
