import React from 'react';
import { useUnitDetails } from '@/hooks/useUnitDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import TenantDetails from '@/components/Details/TenantDetails';
import LeaseDetails from '@/components/Details/LeaseDetails';
import RentDetails from '@/components/Details/RentDetails';
import PaymentHistory from '@/components/Details/PaymentHistory';

const UnitDetails = ({ unit_id }) => {
  const { 
    unit, 
    tenant, 
    payments, 
    rentHistory, 
    leases, 
    currentMonthRent, 
    chartData, 
    isLoading, 
    error 
  } = useUnitDetails(unit_id);

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
      <h1 className="text-3xl font-bold text-white mb-4">Unit {unit[0].unit_number}</h1>
      <section className="flex flex-wrap gap-4 justify-center">
        {/* Unit Details */}
        <TenantDetails tenant={tenant} />
        <LeaseDetails leases={leases} />
        <RentDetails 
          rentDetails={currentMonthRent} 
          totalRent={currentMonthRent?.total_rent} 
          rentDate={currentMonthRent?.date} 
        />
      </section>
  
      <section className="flex flex-wrap -mx-4 my-4">
      {/* Payment History */}
      <PaymentHistory payments={payments} rentHistory={rentHistory} />
        {/* Financial Overview */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-700 shadow rounded p-4">
            <h2 className="text-xl text-white mb-4">Financial Overview</h2>
            <div className="h-[300px] bg-gray-700 rounded">
              <BarChartPlot 
                data={chartData} 
                barKeys={[{ name: "Payment", color: "#82ca9d" }, { name: "Balance", color: "#FA8072" }]} 
                xAxisKey="monthYear" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UnitDetails;
