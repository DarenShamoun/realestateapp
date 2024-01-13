/**
 * Renders the Home page component.
 * 
 * @returns {JSX.Element} The rendered Home page component.
 */
'use client'

import AreaChartPlot from "@/components/Charts/AreaChartPlot";
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from "@/components/Charts/PieChartPlot";
import LineChartPlot from "@/components/Charts/LineChartPlot";
import RadarChartPlot from "@/components/Charts/RadarChartPlot";
import { useHomePageDetails } from '@/hooks/useHomePageDetails';
import FinancialCard from '@/components/Cards/FinancialCard';

const Landing = () => {
  const {
    properties,
    currentDate,
    lastMonthDate,
    monthlyTotalIncome,
    monthlyTotalExpenses,
    monthlyNetProfit,
    monthlyExpectedIncome,
    lastMonthTotalIncome,
    lastMonthTotalExpenses,
    lastMonthNetProfit,
    lastMonthExpectedIncome,
    pieChartData,
    barChartData,
    barKeys,
    isLoading,
    error
  } = useHomePageDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!properties) {
    return <div>No properties found.</div>;
  }

  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <FinancialCard
            title="Total income for"
            amount={monthlyTotalIncome}
            previousAmount={lastMonthTotalIncome}
            startDate={lastMonthDate} 
            endDate={currentDate}
          />
          <FinancialCard 
            title="Expected Income" 
            amount={monthlyExpectedIncome} 
            previousAmount={lastMonthExpectedIncome}
            startDate={lastMonthDate}
            endDate={currentDate}
          />
          <FinancialCard 
            title="Total expenses" 
            amount={monthlyTotalExpenses} 
            previousAmount={lastMonthTotalExpenses}             
            startDate={lastMonthDate} 
            endDate={currentDate}
          />
          <FinancialCard 
            title="Net profit" 
            amount={monthlyNetProfit} 
            previousAmount={lastMonthNetProfit} 
            startDate={lastMonthDate} 
            endDate={currentDate}
          />
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
          <div className="w-1/2 h-[400px] bg-gray-700 rounded">
            <AreaChartPlot/>
          </div>
          <div className="w-1/2 h-[400px] bg-gray-700 rounded">
            <BarChartPlot data={barChartData} barKeys={barKeys} xAxisKey="name" title="6-Month Financial Overview"/>
          </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <PieChartPlot data={pieChartData} title="Rent Status Overview"/>
        </div>
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <LineChartPlot/>
        </div>
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <RadarChartPlot/>
        </div>
      </section>
    </>
  );
};

export default Landing;
