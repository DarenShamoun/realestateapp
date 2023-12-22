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


const Landing = () => {
  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Total income</p>
              <p className="py-4 font-bold">$30,000 </p>
              <p className="text-green-300">+34.5%</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Total expenses</p>
              <p className="py-4 font-bold">$30,000 </p>
              <p className="text-green-300">+34.5%</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Net profit</p>
              <p className="py-4 font-bold">$30,000 </p>
              <p className="text-green-300">+34.5%</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Total returns</p>
              <p className="py-4 font-bold ">$30,000 </p>
              <p className="text-green-300">+34.5%</p>
            </div>
          </div>
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
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"><PieChartPlot/></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"><LineChartPlot/></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"><RadarChartPlot/></div>
      </section>
    </>
  );
};

export default Landing;
