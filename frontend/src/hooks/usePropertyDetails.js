import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getUnits } from '@/api/unitService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo } from '@/Utils/DateManagment';

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

        // Preparing Bar Chart Data
        const barData = [];
        for (let i = 0; i < 6; i++) {
          const month = new Date();
          month.setMonth(currentMonth - i - 1);

          const monthlyIncome = YTDpayments.filter(p => {
            const paymentMonth = new Date(p.date).getMonth() + 1;
            const paymentYear = new Date(p.date).getFullYear();
            return paymentMonth === month.getMonth() + 1 && paymentYear === month.getFullYear();
          }).reduce((acc, payment) => acc + payment.amount, 0);

          const monthlyExpenses = YTDexpenses.filter(e => {
            const expenseMonth = new Date(e.date).getMonth() + 1;
            const expenseYear = new Date(e.date).getFullYear();
            return expenseMonth === month.getMonth() + 1 && expenseYear === month.getFullYear();
          }).reduce((acc, expense) => acc + expense.amount, 0);

          const formattedMonthYear = `${String(month.getMonth() + 1).padStart(2, '0')}/${month.getFullYear().toString().substr(2, 2)}`;
          barData.push({
            name: formattedMonthYear,
            Income: monthlyIncome,
            Expenses: monthlyExpenses
          });
        }
        setBarChartData(barData.reverse());

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
