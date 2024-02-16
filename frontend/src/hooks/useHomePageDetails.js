import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';
import { 
    getCurrentDate, getCurrentMonth, getStartOfCurrentMonth, getEndOfCurrentMonth, getCurrentYear, 
    getDateMonthsAgo, getStartOfMonthMonthsAgo, getEndOfMonthMonthsAgo,
    formatDate 
} from '@/Utils/DateManagment';

export const useHomePageDetails = () => {
    // State variables
    const [dates, setDates] = useState({
        currentDate: formatDate(getCurrentDate(), 'YYYY-MM-DD'),
        currentMonthStart: formatDate(getStartOfCurrentMonth(), 'YYYY-MM-DD'),
        currentMonthEnd: formatDate(getEndOfCurrentMonth(), 'YYYY-MM-DD'),
        lastMonthStart: formatDate(getStartOfMonthMonthsAgo(1), 'YYYY-MM-DD'),
        lastMonthEnd: formatDate(getEndOfMonthMonthsAgo(1), 'YYYY-MM-DD'),
        sixMonthsAgoStart: formatDate(getStartOfMonthMonthsAgo(6), 'YYYY-MM-DD'),
        sixMonthsAgoEnd: formatDate(getEndOfMonthMonthsAgo(6), 'YYYY-MM-DD'),
        twelveMonthsAgoStart: formatDate(getStartOfMonthMonthsAgo(12), 'YYYY-MM-DD'),
        twelveMonthsAgoEnd: formatDate(getEndOfMonthMonthsAgo(12), 'YYYY-MM-DD')
    });
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
        barKeys: [],
        area: [],
        line: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    // Fetch data
    useEffect(() => {
        const fetchHomePageDetails = async () => {
            try {    
                const propertiesData = await getProperties();
                setProperties(propertiesData);

                const financialDataPromises = propertiesData.map(property => fetchFinancialDataForProperty(property.id));
                const financialResults = await Promise.all(financialDataPromises);
                setFinancialDataByProperty(financialResults);

                // Initialize grand totals for all properties
                let grandTotals = {
                    CurrentMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                    lastMonth: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                    YTD: { totalIncome: 0, totalExpenses: 0, netProfit: 0, expectedIncome: 0 },
                };

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

                // Initialize chart data
                let radarChartData = [];
                let areaChartData = [];
                let barChartData = {};
                let pieChartData = { "Rent Paid": 0, "Remaining Rent": 0 };

                // Process chart data for each property
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

                Object.values(barChartData).sort((a, b) => a.monthYearForSorting.localeCompare(b.monthYearForSorting)).forEach(item => {
                    areaChartData.push({
                      monthYear: item.monthYear,
                      Income: item.Income,
                      Expenses: item.Expenses
                    });
                });

                setChartData({
                    radar: radarChartData,
                    pie: [
                      { name: "Rent Paid", value: pieChartData["Rent Paid"] },
                      { name: "Remaining Rent", value: pieChartData["Remaining Rent"] }
                    ],
                    bar: Object.values(barChartData).sort((a, b) => a.monthYearForSorting.localeCompare(b.monthYearForSorting))
                      .map(item => ({
                        monthYear: item.monthYear,
                        Income: item.Income,
                        Expenses: item.Expenses
                      })),
                    area: areaChartData,
                    barKeys: [{ name: "Income", color: "#82ca9d" }, { name: "Expenses", color: "#FA8072" }],
                    lineKeys: [{ name: "Income", stroke: "#82ca9d" }, { name: "Expenses", stroke: "#FA8072" }],
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

    // Helper functions
    const sumAmounts = (data) => data.reduce((acc, item) => acc + item.amount, 0);
    const sumExpectedIncome = (rents) => rents.reduce((acc, rent) => acc + (rent.total_rent - rent.debt), 0);
    const sumNetProfit = (income, expenses) => sumAmounts(income) - sumAmounts(expenses);

    // Fetch financial data for a single property
    const fetchFinancialDataForProperty = async (propertyId) => {
        const YTDpayments = await getPayments({ property_id: propertyId, start_date: dates.twelveMonthsAgoStart, end_date: dates.currentDate });
        const YTDexpenses = await getExpenses({ property_id: propertyId, start_date: dates.twelveMonthsAgoStart, end_date: dates.currentDate });
        const YTDrents = await getRents({ property_id: propertyId, start_date: dates.twelveMonthsAgoStart, end_date: dates.currentDate });
    
        const lastMonthPayments = YTDpayments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate >= new Date(dates.lastMonthStart) && paymentDate <= new Date(dates.lastMonthEnd);
        });

        const lastMonthExpenses = YTDexpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(dates.lastMonthStart) && expenseDate <= new Date(dates.lastMonthEnd);
        });

        const lastMonthRents = YTDrents.filter(rent => {
            const rentDate = new Date(rent.date);
            return rentDate >= new Date(dates.lastMonthStart) && rentDate <= new Date(dates.lastMonthEnd);
        });

        const CurrentMonthPayments = YTDpayments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate >= new Date(dates.currentMonthStart) && paymentDate <= new Date(dates.currentMonthEnd);
        });

        const CurrentMonthExpenses = YTDexpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= new Date(dates.currentMonthStart) && expenseDate <= new Date(dates.currentMonthEnd);
        });

        const CurrentMonthRents = YTDrents.filter(rent => {
            const rentDate = new Date(rent.date);
            return rentDate >= new Date(dates.currentMonthStart) && rentDate <= new Date(dates.currentMonthEnd);
        });

        return { 
            propertyId, 
            YTDpayments, YTDexpenses, YTDrents, 
            lastMonthPayments, lastMonthExpenses, lastMonthRents, 
            CurrentMonthPayments, CurrentMonthExpenses, CurrentMonthRents 
        };
    };

    // Process Bar chart data
    const processBarChartData = (barChartData, financialData) => {
        const processData = (data, key) => {
            data.forEach(item => {
                // Format date in 'YYYY-MM' for sorting and 'MM-YY' for display
                const monthYearForSorting = formatDate(item.date, 'YYYY-MM');
                const monthYearForDisplay = formatDate(item.date, 'MM-YY');
    
                barChartData[monthYearForSorting] = {
                    ...barChartData[monthYearForSorting],
                    monthYearForSorting,
                    monthYear: monthYearForDisplay, // Used for display in the chart
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
        financialDataByProperty,
        chartData,
        isLoading,
        error,
        dates
    };
};
