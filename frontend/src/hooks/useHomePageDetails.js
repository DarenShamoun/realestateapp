import { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { getExpenses } from '@/api/expenseService';
import { getPayments } from '@/api/paymentService';
import { getRents } from '@/api/rentService';

export const useHomePageDetails = () => {

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
    const [allTimeTotalIncome, setAllTimeTotalIncome] = useState(0);
    const [allTimeTotalExpenses, setAllTimeTotalExpenses] = useState(0);
    const [allTimeNetProfit, setAllTimeNetProfit] = useState(0);
    const [allTimeExpectedIncome, setAllTimeExpectedIncome] = useState(0);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
        
    useEffect(() => {
        const fetchHomePageDetails = async () => {
            try {
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        
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
                year: currentYear
                });

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
        currentMonth,
        currentYear,
        currentDate,
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
        error
    };
};