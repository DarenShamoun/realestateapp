import React from 'react';
import { useUnitDetails } from '@/hooks/useUnitDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import TenantDetails from '@/components/Details/TenantDetails';
import LeaseDetails from '@/components/Details/LeaseDetails';
import RentDetails from '@/components/Details/RentDetails';
import FinancialHistory from '@/components/Details/FinancialHistory';
import CreateLeaseModal from '@/components/Modals/CreateLeaseModal';
import CreatePaymentModal from '@/components/Modals/CreatePaymentModal';
import CreateRentModal from '@/components/Modals/CreateRentModal';

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
  const [isCreateRentModalOpen, setCreateRentModalOpen] = React.useState(false);

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

        {/* Tenant Details */}
        <TenantDetails 
          tenant={tenant} 
        />

        {/* Lease Details */}
        <LeaseDetails 
          leases={leases} 
          onOpenCreateLease={() => setCreateLeaseModalOpen(true)} 
        />

        {/* Rent Details */}
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
        {/* Financial History */}
        <FinancialHistory
          payments={payments}
          rentHistory={rentHistory}
          leases={leases}
          onOpenCreatePayment={() => setCreatePaymentModalOpen(true)}
          onOpenCreateRent={() => setCreateRentModalOpen(true)}
        />

        {/* Financial Overview */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="bg-gray-700 shadow rounded p-4">
            <h2 className="text-xl text-white mb-4">Financial Overview</h2>
            <div className="h-[420px] bg-gray-700 rounded">
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
        leaseId={leases[0]?.id}
      />
      <CreateRentModal 
        isOpen={isCreateRentModalOpen} 
        onClose={() => setCreateRentModalOpen(false)}
        leaseId={leases[0]?.id}
      />
    </div>
  );
};

export default UnitDetails;
