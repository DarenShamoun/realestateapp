import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo, formatDate } from '@/Utils/DateManagment';

export const useHomePageDetails = () => {
    const [properties, setProperties] = useState([]);
    const [financialDataByProperty, setFinancialDataByProperty] = useState([]);
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
        const fetchFinancialDataForProperty = async (propertyId) => {
            const YTDpayments = await getPayments({ property_id: propertyId, start_date: dates.twelveMonthsAgo, end_date: dates.currentDate });
            const YTDexpenses = await getExpenses({ property_id: propertyId, start_date: dates.twelveMonthsAgo, end_date: dates.currentDate });
            const YTDrents = await getRents({ property_id: propertyId, start_date: dates.twelveMonthsAgo, end_date: dates.currentDate });

            const lastMonthPayments = YTDpayments.filter(payment => {
                const paymentDate = new Date(payment.date);
                return paymentDate.getMonth() === dates.currentMonth && paymentDate.getFullYear() === dates.currentYear;
            });

            const lastMonthExpenses = YTDexpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === dates.currentMonth && expenseDate.getFullYear() === dates.currentYear;
            });

            const lastMonthRents = YTDrents.filter(rent => {
                const rentDate = new Date(rent.date);
                return rentDate.getMonth() === dates.currentMonth && rentDate.getFullYear() === dates.currentYear;
            });

            const CurrentMonthPayments = YTDpayments.filter(payment => {
                const paymentDate = new Date(payment.date);
                return paymentDate.getMonth() === dates.currentMonth && paymentDate.getFullYear() === dates.currentYear;
            });

            const CurrentMonthExpenses = YTDexpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === dates.currentMonth && expenseDate.getFullYear() === dates.currentYear;
            });

            const CurrentMonthRents = YTDrents.filter(rent => {
                const rentDate = new Date(rent.date);
                return rentDate.getMonth() === dates.currentMonth && rentDate.getFullYear() === dates.currentYear;
            });

            return { 
                propertyId, 
                YTDpayments, YTDexpenses, YTDrents, 
                lastMonthPayments, lastMonthExpenses, lastMonthRents, 
                CurrentMonthPayments, CurrentMonthExpenses, CurrentMonthRents 
            };
        };

        const fetchHomePageDetails = async () => {
            try {    
                const propertiesData = await getProperties();
                setProperties(propertiesData);

                const financialDataPromises = propertiesData.map(property => fetchFinancialDataForProperty(property.id));
                const financialResults = await Promise.all(financialDataPromises);
                setFinancialDataByProperty(financialResults);

                // Initialize grand totals
                let grandTotals = {
                    CurrentMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                    lastMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                    YTD: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                };

                // Initialize chart data
                let radarChartData = [];
                let pieChartData = { "Rent Paid": 0, "Remaining Rent": 0 };
                let barChartData = {};

                // Aggregate data for each time period across all properties
                financialResults.forEach(({ 
                    CurrentMonthPayments, CurrentMonthExpenses, CurrentMonthRents, 
                    lastMonthPayments, lastMonthExpenses, lastMonthRents, 
                    YTDpayments, YTDexpenses, YTDrents 
                }) => {
                    // Calculate totals for the current month
                    grandTotals.CurrentMonth.totalIncome += sumAmounts(CurrentMonthPayments);
                    grandTotals.CurrentMonth.totalExpenses += sumAmounts(CurrentMonthExpenses);
                    grandTotals.CurrentMonth.netProfit += sumNetProfit(CurrentMonthPayments, CurrentMonthExpenses);
                    grandTotals.CurrentMonth.expectedIncome += sumExpectedIncome(CurrentMonthRents);

                    // Calculate totals for the last month
                    grandTotals.lastMonth.totalIncome += sumAmounts(lastMonthPayments);
                    grandTotals.lastMonth.totalExpenses += sumAmounts(lastMonthExpenses);
                    grandTotals.lastMonth.netProfit += sumNetProfit(lastMonthPayments, lastMonthExpenses);
                    grandTotals.lastMonth.expectedIncome += sumExpectedIncome(lastMonthRents);

                    // Calculate totals for YTD
                    grandTotals.YTD.totalIncome += sumAmounts(YTDpayments);
                    grandTotals.YTD.totalExpenses += sumAmounts(YTDexpenses);
                    grandTotals.YTD.netProfit += sumNetProfit(YTDpayments, YTDexpenses);
                    grandTotals.YTD.expectedIncome += sumExpectedIncome(YTDrents);
                });
                setFinancialData(grandTotals);

                financialResults.forEach((financialData) => {
                    // Process radar chart data
                    radarChartData.push({
                        property: propertiesData.find(p => p.id === financialData.propertyId).name,
                        income: sumAmounts(financialData.YTDpayments),
                        expenses: sumAmounts(financialData.YTDexpenses)
                    });
    
                    // Process pie chart data
                    pieChartData["Rent Paid"] += sumAmounts(financialData.CurrentMonthPayments);
                    pieChartData["Remaining Rent"] += sumExpectedIncome(financialData.CurrentMonthRents) - sumAmounts(financialData.CurrentMonthPayments);
    
                    // Process bar chart data
                    processBarChartData(barChartData, financialData);
                });
    
                setChartData({
                    radar: radarChartData,
                    pie: [
                        { name: "Rent Paid", value: pieChartData["Rent Paid"] },
                        { name: "Remaining Rent", value: pieChartData["Remaining Rent"] }
                    ],
                    bar: Object.values(barChartData).sort((a, b) => a.monthYearForSorting.localeCompare(b.monthYearForSorting)).map(item => ({
                        monthYear: formatDate(item.monthYearForSorting, 'MM-YY'),
                        Income: item.Income,
                        Expenses: item.Expenses
                    })),
                    barKeys: [{ name: "Income", color: "#82ca9d" }, { name: "Expenses", color: "#FA8072" }]
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

    const sumAmounts = (data) => data.reduce((acc, item) => acc + item.amount, 0);
    const sumExpectedIncome = (rents) => rents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
    const sumNetProfit = (income, expenses) => sumAmounts(income) - sumAmounts(expenses);

    const processBarChartData = (barChartData, financialData) => {
        const processData = (data, key) => {
            data.forEach(item => {
                const monthYearForSorting = formatDate(item.date, 'YYYY-MM');
                barChartData[monthYearForSorting] = {
                    ...barChartData[monthYearForSorting],
                    monthYearForSorting,
                    [key]: (barChartData[monthYearForSorting]?.[key] || 0) + item.amount
                };
            });
        };
    
        processData(financialData.YTDpayments, 'Income');
        processData(financialData.YTDexpenses, 'Expenses');
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
