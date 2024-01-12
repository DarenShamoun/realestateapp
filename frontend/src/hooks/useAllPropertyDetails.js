import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';

export const useAllPropertyDetails = () => {
  const [properties, setProperties] = useState([]);
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
  const [barKeys, setBarKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    const fetchAllPropertyDetails = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const propertiesData = await getProperties();
        setProperties(propertiesData);

        const YTDrents = await getRents({
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });
  
        const YTDexpenses = await getExpenses({ 
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });
  
        const YTDpayments = await getPayments({
          start_date: twelveMonthsAgo.toISOString().split('T')[0],
          end_date: currentDate
        });

        const CurrentMonthRents = await getRents({
          month: currentMonth,
          year: currentYear
        });

        const CurrentMonthExpenses = await getExpenses({
          month: currentMonth,
          year: currentYear
        });

        const CurrentMonthPayments = await getPayments({
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

        // Preparing Pie Chart Data
        let rentPaidThisMonth = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
        let remainingRent = MonthlyExpectedIncome - rentPaidThisMonth;
        remainingRent = Math.max(0, remainingRent);

        const pieData = [
          { name: "Rent Paid", value: rentPaidThisMonth },
          { name: "Remaining Rent", value: remainingRent }
        ];
        setPieChartData(pieData);

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

        const barKeys = [
          { name: "Income", color: "#82ca9d" },
          { name: "Expenses", color: "#FA8072" }
        ];
        setBarKeys(barKeys);

      } catch (error) {
        console.error('Failed to fetch property details:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
              
    fetchAllPropertyDetails();
  }, []);

  return {
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
  };
};