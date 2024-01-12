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
  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <FinancialCard title="Total income" amount={0} />
          <FinancialCard title="Total expenses" amount={0} />
          <FinancialCard title="Net profit" amount={0} />
          <FinancialCard title="Total returns" amount={0} />
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
          <div className="w-1/2 h-[300px] bg-gray-700 rounded">
            <AreaChartPlot/>
          </div>
          <div className="w-1/2 h-[300px] bg-gray-700 rounded">
            <BarChartPlot/>
          </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[300px] bg-gray-700 rounded"><PieChartPlot/></div>
        <div className=" w-1/3 h-[300px] bg-gray-700 rounded"><LineChartPlot/></div>
        <div className=" w-1/3 h-[300px] bg-gray-700 rounded"><RadarChartPlot/></div>
      </section>
    </>
  );
};

export default Landing;
