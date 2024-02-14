'use client'

import AreaChartPlot from "@/components/Charts/AreaChartPlot";
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from "@/components/Charts/PieChartPlot";
import LineChartPlot from "@/components/Charts/LineChartPlot";
import RadarChartPlot from "@/components/Charts/RadarChartPlot";
import { useHomePageDetails } from '@/Hooks/useHomePageDetails';
import FinancialCard from '@/components/Cards/FinancialCard';

const Landing = () => {
  const {
    properties,
    financialData,
    chartData,
    isLoading,
    error,
    dates
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
            title="Total Income"
            amount={financialData.CurrentMonth.totalIncome}
            previousAmount={financialData.lastMonth.totalIncome}
            startDate={dates.currentMonthStart} 
            endDate={dates.currentMonthEnd}
          />
          <FinancialCard 
            title="Expected Income" 
            amount={financialData.CurrentMonth.expectedIncome} 
            previousAmount={financialData.lastMonth.expectedIncome}
            startDate={dates.currentMonthStart}
            endDate={dates.currentMonthEnd}
          />
          <FinancialCard 
            title="Total Expenses" 
            amount={financialData.CurrentMonth.totalExpenses} 
            previousAmount={financialData.lastMonth.totalExpenses}
            startDate={dates.currentMonthStart} 
            endDate={dates.currentMonthEnd}
          />
          <FinancialCard 
            title="Net Profit" 
            amount={financialData.CurrentMonth.netProfit} 
            previousAmount={financialData.lastMonth.netProfit}
            startDate={dates.currentMonthStart} 
            endDate={dates.currentMonthEnd}
          />
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[500px] bg-gray-700 rounded">
          <AreaChartPlot data={chartData.area} areaKeys={chartData.barKeys} xAxisKey="monthYear" title="Income VS Expenses"/>
        </div>
        <div className="w-1/2 h-[500px] bg-gray-700 rounded">
          <BarChartPlot data={chartData.bar} barKeys={chartData.barKeys} xAxisKey="monthYear" title="6-Month Financial Overview"/>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <PieChartPlot data={chartData.pie} title="Rent Status Overview"/>
        </div>
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <LineChartPlot data={chartData.bar} lineKeys={chartData.lineKeys} xAxisKey="monthYear" title="Overview Of Profits"/>
        </div>
        <div className=" w-1/3 h-[400px] bg-gray-700 rounded">
          <RadarChartPlot data={chartData.radar} title="Property Income Breakdown"/>
        </div>
      </section>
    </>
  );
};

export default Landing;
