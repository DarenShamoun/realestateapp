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
                const sixMonthsAgo = getDateMonthsAgo(6).toISOString().split('T')[0];
        
                const twelveMonthsAgo = getDateMonthsAgo(12).toISOString().split('T')[0];
        
                const propertiesData = await getProperties();
                setProperties(propertiesData);

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

                // Preparing Bar Chart Data
                const barData = mergeBarChartData(YTDpayments, YTDexpenses);
                setBarChartData(barData);      
    
                const barKeys = [
                    { name: "Income", color: "#82ca9d" },
                    { name: "Expenses", color: "#FA8072" }
                ];
                setBarKeys(barKeys);

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
                setRadarChartData(radarData);

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