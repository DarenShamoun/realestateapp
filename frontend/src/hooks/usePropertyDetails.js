import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';

export const usePropertyDetails = (property_id) => {
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyTotalIncome, setMonthlyTotalIncome] = useState(0);
  const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState(0);
  const [monthlyNetProfit, setMonthlyNetProfit] = useState(0);
  const [monthlyExpectedIncome, setMonthlyExpectedIncome] = useState(0);
  const [YTDTotalIncome, setYTDTotalIncome] = useState(0);
  const [YTDTotalExpenses, setYTDTotalExpenses] = useState(0);
  const [YTDNetProfit, setYTDNetProfit] = useState(0);
  const [YTDExpectedIncome, setYTDExpectedIncome] = useState(0);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const propertyData = await getProperties({ property_id: property_id });
        if (propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        const unitsData = await getUnits({ property_id: property_id });
        unitsData.sort((a, b) => a.unit_number.localeCompare(b.unit_number, undefined, {numeric: true}));
        setUnits(unitsData);

        const YTDrents = await getRents({
          property_id: property_id,
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });

        const YTDexpenses = await getExpenses({ 
          property_id: property_id,
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });

        const YTDpayments = await getPayments({
          property_id: property_id,
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });

        const CurrentMonthRents = await getRents({
          property_id: property_id,
          month: currentMonth,
          year: currentYear
        });

        const CurrentMonthExpenses = await getExpenses({
          property_id: property_id,
          month: currentMonth,
          year: currentYear
        });

        const CurrentMonthPayments = await getPayments({
          property_id: property_id,
          month: currentMonth,
        });

        const MonthlyTotalIncome = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
        setMonthlyTotalIncome(MonthlyTotalIncome);

        const MonthlyTotalExpenses = CurrentMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        setMonthlyTotalExpenses(MonthlyTotalExpenses);

        const MonthlyNetProfit = MonthlyTotalIncome - MonthlyTotalExpenses;
        setMonthlyNetProfit(MonthlyNetProfit);

        const MonthlyExpectedIncome = CurrentMonthRents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
        setMonthlyExpectedIncome(MonthlyExpectedIncome);

        const YTDTotalIncome = YTDpayments.reduce((acc, payment) => acc + payment.amount, 0);
        setYTDTotalIncome(YTDTotalIncome);

        const YTDTotalExpenses = YTDexpenses.reduce((acc, expense) => acc + expense.amount, 0);
        setYTDTotalExpenses(YTDTotalExpenses);

        const YTDNetProfit = YTDTotalIncome - YTDTotalExpenses;
        setYTDNetProfit(YTDNetProfit);

        const YTDExpectedIncome = YTDrents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
        setYTDExpectedIncome(YTDExpectedIncome);

      } catch (error) {
        console.error('Failed to fetch property details:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (property_id) {
      fetchPropertyDetails();
    }
  }, [property_id]);

  return { 
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
    isLoading, 
    error };
};
