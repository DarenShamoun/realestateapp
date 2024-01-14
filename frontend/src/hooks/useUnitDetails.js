import { useState, useEffect } from 'react';
import { getUnits } from '@/api/unitService';
import { getTenants } from '@/api/tenantService';
import { getPayments } from '@/api/paymentService';
import { getLeases } from '@/api/leaseService';
import { getRents } from '@/api/rentService';
import { getCurrentDate, getCurrentMonth, getCurrentYear, getDateMonthsAgo } from '@/components/Utils/DateManagment';

export const useUnitDetails = (unit_id) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPaymentsHistory] = useState([]);
  const [leases, setLeases] = useState([]);
  const [currentMonthRent, setCurrentMonthRent] = useState(null);
  const [rentHistory, setRentHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const currentDate = getCurrentDate();
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();
        const endDate = currentDate.toISOString().split('T')[0];

        const sixMonthsAgo = getDateMonthsAgo(6);

        const unitData = await getUnits({ unit_id });
        setUnit(unitData);
  
        const leasesData = await getLeases({ unit_id });
        setLeases(leasesData);

        if (leasesData && leasesData.length > 0 && leasesData[0].is_active) {
          const tenantData = await getTenants({ lease_id: leasesData[0].id });
          setTenant(tenantData[0]);

          const rentFilters = { unit_id: unit_id, month: currentMonth, year: currentYear };
          const rentsData = await getRents(rentFilters);
          if (rentsData.length > 0) {
            setCurrentMonthRent(rentsData[0]);
          }

          const paymentsHistoryData = await getPayments({
            lease_id: leasesData[0].id,
            start_date: sixMonthsAgo.toISOString().split('T')[0]
          });
          const sortedPaymentsHistory = paymentsHistoryData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setPaymentsHistory(sortedPaymentsHistory);

          const rentHistoryData = await getRents({
            unit_id: unit_id,
            start_date: sixMonthsAgo.toISOString().split('T')[0],
            end_date: endDate
          });
          setRentHistory(rentHistoryData.sort((a, b) => new Date(b.date) - new Date(a.date)));

          const mergedData = mergeFinancialData(sortedPaymentsHistory, rentHistoryData);
          setChartData(mergedData);  
        }
      } catch (err) {
        console.error('Error fetching unit details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnitDetails();
  }, [unit_id]);

  const mergeFinancialData = (payments, rentHistory) => {
    const combinedData = {};
  
    rentHistory.forEach(rent => {
      const monthYear = new Date(rent.date).toISOString().substr(0, 7);
      combinedData[monthYear] = {
        ...combinedData[monthYear],
        monthYear,
        Balance: rent.debt,
      };
    });
  
    payments.forEach(payment => {
      const monthYear = new Date(payment.date).toISOString().substr(0, 7);
      combinedData[monthYear] = {
        ...combinedData[monthYear],
        monthYear,
        Payment: (combinedData[monthYear]?.Payment || 0) + payment.amount
      };
    });
  
    return Object.values(combinedData).sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  };

  return { unit, tenant, payments, rentHistory, leases, currentMonthRent, chartData, isLoading, error };
};
