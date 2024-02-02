import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo, formatDate } from '@/Utils/DateManagment';

export const useHomePageDetails = () => {
    const [properties, setProperties] = useState([]);
    const [financialData, setFinancialData] = useState({
        CurrentMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
        lastMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
        YTD: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
    });
    const [chartData, setChartData] = useState({
        radar: [],
        pie: [],
        bar: [],
        barKeys: [{ name: "Income", color: "#82ca9d" }, { name: "Expenses", color: "#FA8072" }],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dates, setDates] = useState({
        currentDate: getCurrentDate().toISOString().split('T')[0],
        currentMonth: getCurrentMonth(),
        currentYear: getCurrentYear(),
        lastMonth: getDateMonthsAgo(1).getMonth() + 1,
        lastYear: getDateMonthsAgo(1).getFullYear(),
        lastMonthDate: getDateMonthsAgo(1),
        sixMonthsAgo: getDateMonthsAgo(6).toISOString().split('T')[0],
        twelveMonthsAgo: getDateMonthsAgo(12).toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchHomePageDetails = async () => {
            try {    
                const propertiesData = await getProperties();
                setProperties(propertiesData);

                const CurrentMonthRents = await getRents({
                month: dates.currentMonth,
                year: dates.currentYear
                });
        
                const CurrentMonthExpenses = await getExpenses({
                month: dates.currentMonth,
                year: dates.currentYear
                });
        
                const CurrentMonthPayments = await getPayments({
                month: dates.currentMonth,
                });

                const lastMonthRents = await getRents({
                month: dates.lastMonth,
                year: dates.lastYear
                });

                const lastMonthExpenses = await getExpenses({
                month: dates.lastMonth,
                year: dates.lastYear
                });

                const lastMonthPayments = await getPayments({
                month: dates.lastMonth,
                year: dates.lastYear
                });

                const YTDrents = await getRents({
                start_date: dates.twelveMonthsAgo,
                end_date: dates.currentDate
                });
        
                const YTDexpenses = await getExpenses({ 
                start_date: dates.twelveMonthsAgo,
                end_date: dates.currentDate
                });
        
                const YTDpayments = await getPayments({
                start_date: dates.twelveMonthsAgo,
                end_date: dates.currentDate
                });

                const MonthlyTotalIncome = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
                const MonthlyTotalExpenses = CurrentMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
                const MonthlyNetProfit = MonthlyTotalIncome - MonthlyTotalExpenses;
                const MonthlyExpectedIncome = CurrentMonthRents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
                
                const lastMonthTotalIncome = lastMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
                const lastMonthTotalExpenses = lastMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);
                const lastMonthNetProfit = lastMonthTotalIncome - lastMonthTotalExpenses;
                const lastMonthExpectedIncome = lastMonthRents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);

                const YTDTotalIncome = YTDpayments.reduce((acc, payment) => acc + payment.amount, 0);
                const YTDTotalExpenses = YTDexpenses.reduce((acc, expense) => acc + expense.amount, 0);
                const YTDNetProfit = YTDTotalIncome - YTDTotalExpenses;
                const YTDExpectedIncome = YTDrents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);

                setFinancialData({
                    CurrentMonth: {
                        totalIncome: MonthlyTotalIncome,
                        totalExpenses: MonthlyTotalExpenses,
                        netProfit: MonthlyNetProfit,
                        expectedIncome: MonthlyExpectedIncome
                    },
                    lastMonth: {
                        totalIncome: lastMonthTotalIncome,
                        totalExpenses: lastMonthTotalExpenses,
                        netProfit: lastMonthNetProfit,
                        expectedIncome: lastMonthExpectedIncome
                    },
                    YTD: {
                        totalIncome: YTDTotalIncome,
                        totalExpenses: YTDTotalExpenses,
                        netProfit: YTDNetProfit,
                        expectedIncome: YTDExpectedIncome
                    }
                });

                // Preparing Pie Chart Data
                let rentPaidThisMonth = CurrentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);
                let remainingRent = MonthlyExpectedIncome - rentPaidThisMonth;
                remainingRent = Math.max(0, remainingRent);

                const pieData = [
                { name: "Rent Paid", value: rentPaidThisMonth },
                { name: "Remaining Rent", value: remainingRent }
                ];

                // Preparing Bar Chart Data
                const barData = mergeBarChartData(YTDpayments, YTDexpenses);
                const barKeys = [
                    { name: "Income", color: "#82ca9d" },
                    { name: "Expenses", color: "#FA8072" }
                ];

                // Preparing Radar Chart Data
                const radarData = [];
                for (let i = 0; i < propertiesData.length; i++) {
                    const property = propertiesData[i];
                    const propertyIncome = YTDpayments.filter(p => p.property_id === property.id).reduce((acc, payment) => acc + payment.amount, 0);
                    const propertyExpenses = YTDexpenses.filter(e => e.property_id === property.id).reduce((acc, expense) => acc + expense.amount, 0);
                    radarData.push({
                        property: property.name,
                        income: propertyIncome,
                        expenses: propertyExpenses
                    });
                }

                setChartData({
                    radar: radarData,
                    pie: pieData,
                    bar: barData,
                    barKeys
                });
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

    const mergeBarChartData = (payments, expenses) => {
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
        properties,
        financialData,
        chartData,
        isLoading,
        error,
        dates
    };
};
