// frontend\src\components\Details\PropertyDetails.js
import React from 'react';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from '../Charts/PieChartPlot';
import UnitCard from '@/components/Cards/UnitCard';

const PropertyDetails = ({ property_id }) => {
  const {
    property,
    units,
    totalIncome,
    totalExpenses,
    netProfit,
    expectedMonthlyIncome,
    totalDebt,
    isLoading,
    error
  } = usePropertyDetails(property_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!property) {
    return <div>No property found.</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">{property.name}</h2>
        <p className="text-lg text-gray-300 mb-1 p-4">{property.address}</p>
      </div>

      {/* Financial Summary */}
      <div className="flex m-4 gap-2">
        <FinancialCard title="Total Income" amount={totalIncome} />
        <FinancialCard title="Total Expenses" amount={totalExpenses} />
        <FinancialCard title="Net Profit" amount={netProfit} />
        <FinancialCard title="Expected Monthly Income" amount={expectedMonthlyIncome} />
        <FinancialCard title="Total Debt" amount={totalDebt} />
      </div>

      {/* Chart */}
      <div className="p-4">
        <BarChartPlot />
      </div>

      {/* Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {units.map(unit => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </section>
  );
};

// FinancialCard Component
const FinancialCard = ({ title, amount }) => (
  <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
    <div className="flex flex-col justify-end h-full">
      <p className="text-white font-bold self-start">{title}</p>
      <p className="py-4 text-green-500 font-bold self-start">${amount.toLocaleString()}</p>
      {/* You can add percentage change or other metrics here if available */}
    </div>
  </div>
);

export default PropertyDetails;
