/**
 * Renders a page displaying a list of properties.
 * 
 * @returns {JSX.Element} The rendered Properties component.
 */
'use client'

import { useAllPropertyDetails } from '@/hooks/useAllPropertyDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from '@/components/Charts/PieChartPlot';
import PropertyCard from '@/components/Cards/PropertyCard';

const Properties = () => {
  const {
    properties,
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
    isLoading,
    error
  } = useAllPropertyDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const barKeys = [
    { name: "Income", color: "#82ca9d" },
    { name: "Expenses", color: "#FA8072" }
  ];

  return (
    <section>
      <div className="flex justify-between items-center p-2">
        <h2 className="text-2xl text-white font-bold">Properties{":"} {currentMonth} {"/"} {currentYear}</h2>
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
        <div className="w-1/2 h-[300px] bg-gray-700 rounded">
          <PieChartPlot data={pieChartData} />
        </div>
        <div className="w-1/2 h-[300px] bg-gray-700 rounded">
          <BarChartPlot data={barChartData} barKeys={barKeys} xAxisKey="name" />
        </div>
      </section>

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            isManagementMode={false}
          />
        ))}
      </div>
    </section>
  );
};

// FinancialCard Component
const FinancialCard = ({ title, amount }) => {
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  const updatedTitle = title.replace('Monthly', monthName);

  return (
    <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
      <div className="flex flex-col justify-end h-full">
        <p className="text-white font-bold self-start">{updatedTitle}</p>
        <p className="py-4 text-green-300 font-bold self-start">${amount}</p>
      </div>
    </div>
  );
};

export default Properties;
