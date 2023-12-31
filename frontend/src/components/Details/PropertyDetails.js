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
    currentMonth,
    currentYear,
    monthlyTotalIncome,
    monthlyTotalExpenses,
    monthlyNetProfit,
    monthlyExpectedIncome,
    YTDTotalIncome,
    YTDTotalExpenses,
    YTDNetProfit,
    YTDExpectedIncome,
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
      <div className="flex justify-between items-center p-2">
        <h2 className="text-2xl text-white font-bold">{property.name} {":"} {currentMonth} {"/"} {currentYear}</h2>
        <p className="text-lg text-gray-300 mb-1 p-1">{property.address}</p>
      </div>

      {/* Monthly Financial Summary */}
      <div className="flex m-4 gap-2">
        <FinancialCard title="Monthly Total Income" amount={monthlyTotalIncome} />
        <FinancialCard title="Monthly Expected Income" amount={monthlyExpectedIncome} />
        <FinancialCard title="Monthly Total Expenses" amount={monthlyTotalExpenses} />
        <FinancialCard title="Monthly Net Profit" amount={monthlyNetProfit} />
      </div>

      {/* YTD Financial Summary */}
      <div className="flex m-4 gap-2">
        <FinancialCard title="YTD Total Income" amount={YTDTotalIncome} />
        <FinancialCard title="YTD Expected Income" amount={YTDExpectedIncome} />
        <FinancialCard title="YTD Total Expenses" amount={YTDTotalExpenses} />
        <FinancialCard title="YTD Net Profit" amount={YTDNetProfit} />
      </div>

      {/* Chart */}
      <section className="flex my-4 px-4 gap-3">
          <div className="w-1/2 h-[300px] bg-gray-700 rounded">
              <PieChartPlot/>
          </div>
          <div className="w-1/2 h-[300px] bg-gray-700 rounded">
              <BarChartPlot/>
          </div>
      </section>

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
const FinancialCard = ({ title, amount }) => {
  const monthName = new Date().toLocaleString('default', { month: 'long' });
  const year = new Date().getFullYear();

  const updatedTitle = title.replace('YTD', year).replace('Monthly', monthName);

  return (
    <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
      <div className="flex flex-col justify-end h-full">
        <p className="text-white font-bold self-start">{updatedTitle}</p>
        <p className="py-4 text-green-300 font-bold self-start">${amount}</p>
      </div>
    </div>
  );
};

export default PropertyDetails;
