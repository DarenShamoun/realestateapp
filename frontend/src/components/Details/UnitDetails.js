'use client';

import React from 'react';
import { useUnitDetails } from '@/hooks/useUnitDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import TenantDetails from '@/components/Details/TenantDetails';
import LeaseDetails from '@/components/Details/LeaseDetails';
import RentDetails from '@/components/Details/RentDetails';
import PaymentHistory from '@/components/Details/PaymentHistory';
import CreateLeaseModal from '@/components/Modals/CreateLeaseModal';
import CreatePaymentModal from '@/components/Modals/CreatePaymentModal';

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

  const [isCreateLeaseModalOpen, setCreateLeaseModalOpen] = React.useState(false);
  const [isCreatePaymentModalOpen, setCreatePaymentModalOpen] = React.useState(false);

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
        <LeaseDetails leases={leases} onOpenCreateLease={() => setCreateLeaseModalOpen(true)} />
        <RentDetails 
          rentDetails={currentMonthRent} 
          totalRent={currentMonthRent?.total_rent} 
          rentDate={currentMonthRent?.date} 
        />
        <CreateLeaseModal 
        isOpen={isCreateLeaseModalOpen} 
        onClose={() => setCreateLeaseModalOpen(false)}
        unitId={unit_id}
        />
      </section>
  
      <section className="flex flex-wrap -mx-4 my-4">
      {/* Payment History */}
      <PaymentHistory
          payments={payments}
          rentHistory={rentHistory}
          onOpenCreatePayment={() => setCreatePaymentModalOpen(true)}
        />        
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
      <CreatePaymentModal 
        isOpen={isCreatePaymentModalOpen} 
        onClose={() => setCreatePaymentModalOpen(false)}
        leaseId={leases[0]?.id} // Assuming you want to use the lease ID of the first lease
      />
    </div>
  );
};

export default UnitDetails;
