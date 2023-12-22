'use client';

import React, { useEffect, useState } from 'react';
import { getUnit } from '@/api/unitService';
import { getTenant } from '@/api/tenantService';
import { getPayments} from '@/api/paymentService';
import { getRentByDate, getRecentRentByUnitId} from '@/api/rentService';
import { getLeases } from '@/api/leaseService';
import BarChartPlot from "@/components/Charts/BarChartPlot";

const UnitDetails = ({ unitId }) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLastSixMonths = () => {
    const months = [];
    let date = new Date();
    for (let i = 0; i < 6; i++) {
      months.push(new Date(date.setMonth(date.getMonth() - 1)));
    }
    return months.map(d => ({ month: d.getMonth() + 1, year: d.getFullYear() }));
  };

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unitData = await getUnit(unitId);
        setUnit(unitData);

        if (unitData.tenant && unitData.tenant.id) {
          const tenantData = await getTenant(unitData.tenant.id);
          setTenant(tenantData);
        }

        const paymentsData = await getPayments({ unitId });
        setPayments(paymentsData);

        const leasesData = await getLeases({ unitId });
        setLeases(leasesData);

        try {
          const rentData = await getRecentRentByUnitId(unitId);
          if (rentData) {
            setUnit(prevState => ({
              ...prevState,
              rent_details: rentData,
              total_rent: rentData.total_rent
            }));
          }
        } catch (rentError) {
          // Handle the error when rent details are not found
          setUnit(prevState => ({
            ...prevState,
            rent_details: {},
            total_rent: 0
          }));
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchChartData = async () => {
      const lastSixMonths = getLastSixMonths();
      const newChartData = [];
    
      for (const { month, year } of lastSixMonths) {
        try {
          const paymentsData = await getPayments({ unitId, year, month });
          const paymentTotal = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    
          let rentTotal = 0;
          try {
            const rentData = await getRentByDate(year, month, null, unitId, null);
            rentTotal = rentData.length > 0 ? rentData[0].total_rent : 0;
          } catch (rentError) {
            // If no rent data found for the month, set rentTotal to 0
            rentTotal = 0;
          }
    
          const debt = rentTotal - paymentTotal;
          newChartData.push({ name: `${month}/${year}`, Payment: paymentTotal, Debt: debt });
        } catch (error) {
          console.error(`Error fetching data for month ${month}, year ${year}:`, error);
        }
      }
    
      setChartData(newChartData);
    };
        
    fetchUnitDetails();
    fetchChartData();
  }, [unitId]);

  // Function to safely format currency values
  const formatCurrency = (value) => value ? `$${value.toFixed(2)}` : 'N/A';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!unit) {
    return <div>No unit details found.</div>;
  }

  // Prepare chart data for the BarChartPlot component
  const paymentChartData = payments.map(payment => ({
    name: new Date(payment.date).toLocaleDateString('en-US'),
    Amount: payment.amount,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Unit {unit.unit_number}</h1>

      {/* Main Section */}
      <section className="flex flex-wrap gap-4 justify-center">
        {/* Tenant Details Card */}
        <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/3">
          <h2 className="text-xl text-white">Tenant Details</h2>
          {tenant ? (
            <>
              <p className="text-gray-300">Name: {tenant.full_name}</p>
              <p className="text-gray-300">Primary Phone: {tenant.primary_phone}</p>
              <p className="text-gray-300">Secondary Phone: {tenant.secondary_phone || 'N/A'}</p>
              <p className="text-gray-300">Contact Notes: {tenant.contact_notes || 'None'}</p>
            </>
          ) : <p className="text-gray-300">No tenant details available</p>}
        </div>

        {/* Lease Details Card */}
        <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/4">
          <h2 className="text-xl text-white">Lease Details</h2>
          {leases && leases.length > 0 ? (
            leases.map((lease, index) => (
              <div key={index} className="text-gray-300 mb-2">
                <p>Start Date: {lease.start_date}</p>
                <p>End Date: {lease.end_date || 'N/A'}</p>
                <p>Base Rent: ${lease.monthly_rent.toFixed(2)}</p>
                <p>Deposit: {lease.deposit ? `$${lease.deposit.toFixed(2)}` : 'N/A'}</p>
                <p>Terms: {lease.terms || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No current lease agreement.</p>
          )}
        </div>

      {/* Rent Details Card */}
      <div className="bg-gray-700 shadow rounded p-4 h-auto w-1/4">
        <h2 className="text-xl text-white">Rent Details</h2>
        {unit.rent_details && Object.keys(unit.rent_details).length > 0 ? (
          <>
            <p className="text-gray-300">Base Rent: {formatCurrency(unit.rent_details.rent)}</p>
            <p className="text-gray-300">Trash: {formatCurrency(unit.rent_details.trash)}</p>
            <p className="text-gray-300">Water & Sewer: {formatCurrency(unit.rent_details.water_sewer)}</p>
            <p className="text-gray-300">Parking: {formatCurrency(unit.rent_details.parking)}</p>
            <p className="text-gray-300">Debt: {formatCurrency(unit.rent_details.debt)}</p>
            <p className="text-gray-300">Breaks: {formatCurrency(unit.rent_details.breaks)}</p>
            <p className="text-gray-300 font-bold">Total Rent: {formatCurrency(unit.total_rent)}</p>
          </>
        ) : (
          <p className="text-gray-300">Rent details not available for this unit.</p>
        )}
      </div>
      </section>

      {/* Payment History and Financial Overview Section */}
      <section className="flex flex-wrap -mx-4 my-4">
        {/* Payment History Card */}
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

        {/* Financial Overview Card with Bar Chart */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-700 shadow rounded p-4">
            <h2 className="text-xl text-white mb-4">Financial Overview</h2>
            <div className="h-[300px] bg-gray-700 rounded">
              <BarChartPlot data={chartData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnitDetails;
