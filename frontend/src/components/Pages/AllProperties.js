'use client'

import React, { useState } from 'react';
import { useAllPropertyDetails } from '@/Hooks/useAllPropertiesDetails';
import BarChartPlot from "@/components/Charts/BarChartPlot";
import PieChartPlot from '@/components/Charts/PieChartPlot';
import PropertyCard from '@/components/Cards/PropertyCard';
import FinancialCard from '@/components/Cards/FinancialCard';
import CreatePropertyModal from '@/components/Modals/CreatePropertyModal';
import CreateExpenseModal from '../Modals/CreateExpenseModal';

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
  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false); // New state for expense modal

  const openCreatePropertyModal = () => setIsCreatePropertyModalOpen(true);
  const closeCreatePropertyModal = () => setIsCreatePropertyModalOpen(false);

  const openCreateExpenseModal = () => setIsCreateExpenseModalOpen(true);
  const closeCreateExpenseModal = () => setIsCreateExpenseModalOpen(false);

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
            <PieChartPlot data={pieChartData} title={`Rent Status for: ${currentMonth} / ${currentYear}`} />
        </div>
        <div className="w-1/2 h-[450px] bg-gray-700 rounded">
          <BarChartPlot data={barChartData} barKeys={barKeys} xAxisKey="monthYear" title="6-Month Financial Overview" />
        </div>
      </section>

      {/* Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>

      {/* Add Property Button */}
      <div className="flex justify-center pb-4">
        <button 
          onClick={openCreatePropertyModal} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Property
        </button>
        
      <div className="w-4"></div>
        <button 
          onClick={openCreateExpenseModal} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Expense
        </button>
      </div>

      {/* Create Property Modal */}
      {isCreatePropertyModalOpen && (
        <CreatePropertyModal
          isOpen={isCreatePropertyModalOpen}
          onClose={closeCreatePropertyModal}
        />
      )}

      {/* Add Expense Button */}
      {isCreateExpenseModalOpen && (
        <CreateExpenseModal
          isOpen={isCreateExpenseModalOpen}
          onClose={closeCreateExpenseModal}
          properties={properties}
          context="property"
        />
      )}

    </section>
  );
};

export default Properties;
