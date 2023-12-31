import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';

export const usePropertyDetails = (property_id) => {
  const [financialData, setFinancialData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    expectedMonthlyIncome: 0,
    totalDebt: 0,
    chartData: []
  });
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyData = await getProperties({ property_id: property_id });
        if (propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        const unitsData = await getUnits({ property_id: property_id });
        unitsData.sort((a, b) => a.unit_number.localeCompare(b.unit_number, undefined, {numeric: true}));
        setUnits(unitsData);

        const rents = await getRents({ property_id });
        const expenses = await getExpenses({ property_id });
        const payments = await getPayments({ property_id });

        const totalIncome = payments.reduce((acc, payment) => acc + payment.amount, 0);
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const netProfit = totalIncome - totalExpenses;

        const expectedMonthlyIncome = rents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
        const totalDebt = rents.reduce((acc, rent) => acc + rent.debt, 0);

        const chartData = prepareChartData(rents, expenses, payments);

        setFinancialData({ totalIncome, totalExpenses, netProfit, expectedMonthlyIncome, totalDebt, chartData });
      } catch (error) {
        console.error('Failed to fetch property details:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (property_id) {
      fetchData();
    }
  }, [property_id]);

  const prepareChartData = (rents, expenses, payments) => {
    // Combine and format data for charting purposes
    // Example: Aggregate data by month/year, calculate monthly income/expenses, etc.
    // Return an array of data suitable for rendering in BarChartPlot or other chart components
  };

  return { ...financialData, property, units, isLoading, error };
};
