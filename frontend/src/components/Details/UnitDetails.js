import React from 'react';
import { useEffect, useState } from 'react';
import { useUnitDetails } from '@/hooks/useUnitDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import TenantDetails from './TenantDetails';
import LeaseDetails from './LeaseDetails';
import RentDetails from './RentDetails';
import PaymentHistory from './PaymentHistory';

// Function to get the last six months from the current date
const getLastSixMonths = () => {
  const months = [];
  let date = new Date();
  for (let i = 0; i < 6; i++) {
    months.push(new Date(date.setMonth(date.getMonth() - 1)));
  }
  return months.map(d => ({ month: d.getMonth() + 1, year: d.getFullYear() }));
};

const UnitDetails = ({ unitId }) => {
  const { unit, tenant, payments, leases, isLoading, error } = useUnitDetails(unitId);

  const [chartData, setChartData] = useState([]);
  useEffect(() => {

    // Fetches payment and rent data for the last six months
    const fetchChartData = async () => {
      const lastSixMonths = getLastSixMonths();
      let newChartData = [];
    
      for (const { month, year } of lastSixMonths) {
        try {
          const paymentsData = await getPayments({ unitId, year, month });
          const paymentTotal = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    
          // Fetch rent data for the month
          let totalRent = 0;
          try {
            const rentData = await getRentByDate(year, month, null, unitId, null);
            totalRent = rentData.length > 0 ? rentData[0].total_rent : 0;
          } catch (rentError) {
            // No rent data found for the month, set totalRent to 0
          }
    
          // Add to chart data if there is a payment or rent for the month
          if (paymentTotal > 0 || totalRent > 0) {
            newChartData.push({ name: `${month}/${year}`, Payment: paymentTotal, Balance: totalRent });
          }
        } catch (error) {
          console.error(`Error fetching data for month ${month}, year ${year}:`, error);
        }
      }
    
      // Reverse the order for past to present display and limit to last six months
      newChartData = newChartData.reverse().slice(0, 6);
      setChartData(newChartData);
    };

    fetchChartData();
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
  
      <section className="flex flex-wrap gap-4 justify-center">
        {/* Unit Details */}
        <TenantDetails tenant={tenant} />
        <LeaseDetails leases={leases} />
        <RentDetails 
          rentDetails={unit.rent_details} 
          totalRent={unit.total_rent} 
          rentDate={unit.rent_date} 
        />
      </section>
  
      <section className="flex flex-wrap -mx-4 my-4">
        {/* Payment History */}
        <PaymentHistory payments={payments} />

        {/* Financial Overview */}
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
