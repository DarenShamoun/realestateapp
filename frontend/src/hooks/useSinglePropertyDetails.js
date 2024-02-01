import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getTenants } from '@/api/tenantService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo, formatDate } from '@/Utils/DateManagment';

export const usePropertyDetails = (property_id) => {
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [currentMonth] = useState(getCurrentMonth());
  const [currentYear] = useState(getCurrentYear());
  const [currentDate] = useState(getCurrentDate().toISOString().split('T')[0]);
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
  const [barKeys, setBarKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const sixMonthsAgo = getDateMonthsAgo(6);

        const twelveMonthsAgo = getDateMonthsAgo(12);

        const propertyData = await getProperties({ property_id: property_id });
        if (propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        const unitsData = await getUnits({ property_id: property_id });
        for (let unit of unitsData) {
          if (unit.is_occupied) {
            const tenantData = await getTenants({ unit_id: unit.id });
            unit.tenant = tenantData.length > 0 ? tenantData[0] : null;
          }
        }
        unitsData.sort((a, b) => a.unit_number.localeCompare(b.unit_number, undefined, { numeric: true }));
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

        // Preparing Bar Chart Data
        const barData = mergeBarChartData(YTDpayments, YTDexpenses, YTDrents);
        setBarChartData(barData);      

        // Preparing Bar Chart Keys
        const barKeys = [
          { name: "Income", color: "#82ca9d" },
          { name: "Expenses", color: "#FA8072" }
        ];
        setBarKeys(barKeys);

        // Preparing Pie Chart Data
        if (CurrentMonthPayments && CurrentMonthRents) {
          const rentPaidThisMonth = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
          const remainingRent = MonthlyExpectedIncome - rentPaidThisMonth;

          const pieData = [
            { name: "Rent Paid", value: rentPaidThisMonth },
            { name: "Remaining Rent", value: Math.max(0, remainingRent) }
          ];
          setPieChartData(pieData);
        }

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

  const mergeBarChartData = (payments, expenses, rents) => {
    const combinedData = {};
  
    // Use YYYY-MM format for sorting
    payments.forEach(payment => {
        const monthYearForSorting = formatDate(payment.date, 'YYYY-MM');
        combinedData[monthYearForSorting] = {
            ...combinedData[monthYearForSorting],
            monthYearForSorting,
            Income: (combinedData[monthYearForSorting]?.Income || 0) + payment.amount
        };
    });
  
    expenses.forEach(expense => {
        const monthYearForSorting = formatDate(expense.date, 'YYYY-MM');
        combinedData[monthYearForSorting] = {
            ...combinedData[monthYearForSorting],
            monthYearForSorting,
            Expenses: (combinedData[monthYearForSorting]?.Expenses || 0) + expense.amount
        };
    });
  
    // Sort data based on YYYY-MM format
    const sortedData = Object.values(combinedData).sort((a, b) => a.monthYearForSorting.localeCompare(b.monthYearForSorting));
  
    // Convert to MM-YY format for display
    return sortedData.map(item => {
        const [year, month] = item.monthYearForSorting.split('-');
        return {
            ...item,
            monthYear: `${month}-${year.substring(2)}` // MM-YY format
        };
    });
};

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
    barKeys,
    isLoading, 
    error };
};
