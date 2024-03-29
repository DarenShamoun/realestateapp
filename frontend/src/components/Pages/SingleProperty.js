import React from 'react';
import { useState } from 'react';
import { usePropertyDetails } from '@/Hooks/useSinglePropertyDetails';
import PieChartPlot from '@/components/Charts/PieChartPlot';
import AreaChartPlot from '../Charts/AreaChartPlot';
import UnitCard from '@/components/Cards/UnitCard';
import FinancialCard from '@/components/Cards/FinancialCard';
import CreateUnitModal from '../Modals/CreateUnitModal';
import CreateExpenseModal from '../Modals/CreateExpenseModal';

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
    areaChartData,
    areaKeys,
    isLoading, 
    error
  } = usePropertyDetails(property_id);
  const [isCreateUnitModalOpen, setCreateUnitModalOpen] = React.useState(false);
  const [isCreateExpenseModalOpen, setIsCreateExpenseModalOpen] = useState(false);

  const openCreateUnitModal = () => setCreateUnitModalOpen(true);
  const closeCreateUnitModal = () => setCreateUnitModalOpen(false);

  const openCreateExpenseModal = () => setIsCreateExpenseModalOpen(true);
  const closeCreateExpenseModal = () => setIsCreateExpenseModalOpen(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!property) {
    return <div>No property found.</div>;
  }

  console.log('pie chart data', pieChartData);
  
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
          <AreaChartPlot 
            data={areaChartData} 
            areaKeys={areaKeys} 
            xAxisKey="monthYear" 
            title="6-Month Financial Overview"
          />
        </div>
      </section>

      {/* Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {units.map(unit => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
      
      {/* Add Unit Button */}
      <div className="flex justify-center pb-4">
        <button 
          onClick={openCreateUnitModal} 
          className="bg-green-400 hover:bg-green-500 text-gray-800 font-bold py-2 px-4 rounded mt-4"
        >
          Add Unit
        </button>
        
      <div className="w-4"></div>
        <button 
          onClick={openCreateExpenseModal} 
          className="bg-red-400 hover:bg-red-500 text-gray-800 font-bold py-2 px-4 rounded mt-4"
        >
          Add Expense
        </button>
      </div>


      {/* Create Unit Modal */}
      {isCreateUnitModalOpen && (
        <CreateUnitModal
          isOpen={isCreateUnitModalOpen}
          onClose={closeCreateUnitModal}
          propertyId={property_id}
        />
      )}

        {/* Create Expense Modal */}
        {isCreateExpenseModalOpen && (
        <CreateExpenseModal
          isOpen={isCreateExpenseModalOpen}
          onClose={closeCreateExpenseModal}
          properties={[property]} // Pass the current property as an array
          units={units}
          context="unit"
        />
      )}

    </section>
  );
};

export default PropertyDetails;
