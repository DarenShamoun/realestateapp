import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo, formatDate } from '@/Utils/DateManagment';

export const useHomePageDetails = () => {
    const [properties, setProperties] = useState([]);
    const [currentMonth] = useState(getCurrentMonth());
    const [currentYear] = useState(getCurrentYear());
    const [currentDate] = useState(getCurrentDate().toISOString().split('T')[0]);
    const [lastMonth] = useState(getDateMonthsAgo(1).getMonth() + 1);
    const [lastYear] = useState(getDateMonthsAgo(1).getFullYear());
    const [lastMonthDate] = useState(getDateMonthsAgo(1));
    const [monthlyTotalIncome, setMonthlyTotalIncome] = useState(0);
    const [monthlyTotalExpenses, setMonthlyTotalExpenses] = useState(0);
    const [monthlyNetProfit, setMonthlyNetProfit] = useState(0);
    const [monthlyExpectedIncome, setMonthlyExpectedIncome] = useState(0);
    const [lastMonthTotalIncome, setLastMonthTotalIncome] = useState(0);
    const [lastMonthTotalExpenses, setLastMonthTotalExpenses] = useState(0);
    const [lastMonthNetProfit, setLastMonthNetProfit] = useState(0);
    const [lastMonthExpectedIncome, setLastMonthExpectedIncome] = useState(0);
    const [YTDTotalIncome, setYTDTotalIncome] = useState(0);
    const [YTDTotalExpenses, setYTDTotalExpenses] = useState(0);
    const [YTDNetProfit, setYTDNetProfit] = useState(0);
    const [YTDExpectedIncome, setYTDExpectedIncome] = useState(0);
    const [radarChartData, setRadarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [barKeys, setBarKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomePageDetails = async () => {
            try {
                const propertiesData = await getProperties();
                let totalIncome = 0;
                let totalExpenses = 0;
                const radarData = [];
                const barData = {};

                for (const property of propertiesData) {
                    const propertyPayments = await getPayments({ property_id: property.id });
                    const propertyExpenses = await getExpenses({ property_id: property.id });

                    const propertyIncome = propertyPayments.reduce((acc, payment) => acc + payment.amount, 0);
                    const propertyExpense = propertyExpenses.reduce((acc, expense) => acc + expense.amount, 0);

                    totalIncome += propertyIncome;
                    totalExpenses += propertyExpense;

                    radarData.push({
                        property: property.name,
                        income: propertyIncome,
                        expenses: propertyExpense,
                    });

                    // Process bar chart data
                    propertyPayments.forEach(payment => {
                        const monthYear = formatDate(payment.date, 'YYYY-MM');
                        barData[monthYear] = barData[monthYear] || { Income: 0, Expenses: 0 };
                        barData[monthYear].Income += payment.amount;
                    });

                    propertyExpenses.forEach(expense => {
                        const monthYear = formatDate(expense.date, 'YYYY-MM');
                        barData[monthYear] = barData[monthYear] || { Income: 0, Expenses: 0 };
                        barData[monthYear].Expenses += expense.amount;
                    });
                }

                // Set total income, expenses, and net profit
                setMonthlyTotalIncome(totalIncome);
                setMonthlyTotalExpenses(totalExpenses);
                setMonthlyNetProfit(totalIncome - totalExpenses);

                // Set radar chart data
                setRadarChartData(radarData);

                // Prepare bar chart data
                const formattedBarData = Object.keys(barData).map(monthYear => ({
                    monthYear,
                    ...barData[monthYear]
                })).sort((a, b) => a.monthYear.localeCompare(b.monthYear));
                setBarChartData(formattedBarData);

                // Set bar chart keys
                setBarKeys([
                    { name: "Income", color: "#82ca9d" },
                    { name: "Expenses", color: "#FA8072" }
                ]);

                const sixMonthsAgo = getDateMonthsAgo(6).toISOString().split('T')[0];
        
                const twelveMonthsAgo = getDateMonthsAgo(12).toISOString().split('T')[0];

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

                const lastMonthRents = await getRents({
                month: lastMonth,
                year: lastYear
                });

                const lastMonthExpenses = await getExpenses({
                month: lastMonth,
                year: lastYear
                });

                const lastMonthPayments = await getPayments({
                month: lastMonth,
                year: lastYear
                });

                const YTDrents = await getRents({
                start_date: twelveMonthsAgo,
                end_date: currentDate
                });
        
                const YTDexpenses = await getExpenses({ 
                start_date: twelveMonthsAgo,
                end_date: currentDate
                });
        
                const YTDpayments = await getPayments({
                start_date: twelveMonthsAgo,
                end_date: currentDate
                });

                const MonthlyTotalIncome = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
                setMonthlyTotalIncome(MonthlyTotalIncome);
        
                const MonthlyTotalExpenses = CurrentMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
                setMonthlyTotalExpenses(MonthlyTotalExpenses);
        
                const MonthlyNetProfit = MonthlyTotalIncome - MonthlyTotalExpenses;
                setMonthlyNetProfit(MonthlyNetProfit);
        
                const MonthlyExpectedIncome = CurrentMonthRents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
                setMonthlyExpectedIncome(MonthlyExpectedIncome);        
                
                const lastMonthTotalIncome = lastMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
                setLastMonthTotalIncome(lastMonthTotalIncome);

                const lastMonthTotalExpenses = lastMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
                setLastMonthTotalExpenses(lastMonthTotalExpenses);

                const lastMonthNetProfit = lastMonthTotalIncome - lastMonthTotalExpenses;
                setLastMonthNetProfit(lastMonthNetProfit);

                const lastMonthExpectedIncome = lastMonthRents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
                setLastMonthExpectedIncome(lastMonthExpectedIncome);

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

            } catch (error) {
                console.error('Failed to fetch property details:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchHomePageDetails();
    }, []);

    return {
        properties,
        currentDate,
        currentMonth,
        currentYear,
        lastMonthDate,
        monthlyTotalIncome,
        monthlyTotalExpenses,
        monthlyNetProfit,
        monthlyExpectedIncome,
        lastMonthTotalIncome,
        lastMonthTotalExpenses,
        lastMonthNetProfit,
        lastMonthExpectedIncome,
        radarChartData,
        pieChartData,
        barChartData,
        barKeys,
        isLoading,
        error
    };
};
