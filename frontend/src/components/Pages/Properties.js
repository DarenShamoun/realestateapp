'use client'

import React, { useState } from 'react';
import { useAllPropertyDetails } from '@/Hooks/useAllPropertyDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from '@/components/Charts/PieChartPlot';
import PropertyCard from '@/components/Cards/PropertyCard';
import FinancialCard from '@/components/Cards/FinancialCard';
import CreatePropertyModal from '@/components/Modals/CreatePropertyModal';

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
    barKeys,
    isLoading,
    error
  } = useAllPropertyDetails();
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] = useState(false);

  const openCreatePropertyModal = () => setIsCreatePropertyModalOpen(true);
  const closeCreatePropertyModal = () => setIsCreatePropertyModalOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-center p-2">
        <h2 className="text-2xl text-white font-bold">All Properties{":"} {currentMonth} {"/"} {currentYear}</h2>
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
          <BarChartPlot data={barChartData} barKeys={barKeys} xAxisKey="name" title="6-Month Financial Overview" />
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

      {/* Add Property Button */}
      <div className="flex justify-center pb-4">
        <button 
          onClick={openCreatePropertyModal} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Property
        </button>
      </div>

      {/* Create Property Modal */}
      {isCreatePropertyModalOpen && (
        <CreatePropertyModal
          isOpen={isCreatePropertyModalOpen}
          onClose={closeCreatePropertyModal}
        />
      )}

    </section>
  );
};

export default Properties;
