import React from 'react';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from '@/components/Charts/PieChartPlot';
import UnitCard from '@/components/Cards/UnitCard';
import FinancialCard from '@/components/Cards/FinancialCard';

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
    pieChartData,
    barChartData,
    barKeys,
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

      {/* Chart Section */}
      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[450px] bg-gray-700 rounded">
          <PieChartPlot data={pieChartData} title="Rent Status Overview"/>
        </div>
        <div className="w-1/2 h-[450px] bg-gray-700 rounded">
          <BarChartPlot data={barChartData} barKeys={barKeys} xAxisKey="name" title="6-Month Financial Overview"/>
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

export default PropertyDetails;
