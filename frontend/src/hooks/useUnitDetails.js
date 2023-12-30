import { useState, useEffect } from 'react';
import { getUnits } from '@/api/unitService';
import { getTenants } from '@/api/tenantService';
import { getPayments } from '@/api/paymentService';
import { getLeases } from '@/api/leaseService';
import { getRents } from '@/api/rentService';

export const useUnitDetails = (unit_id) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPaymentsHistory] = useState([]);
  const [leases, setLeases] = useState([]);
  const [currentMonthRent, setCurrentMonthRent] = useState(null);
  const [rentHistory, setRentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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
          setPaymentsHistory(paymentsHistoryData);

          const rentHistoryData = await getRents({
            unit_id: unit_id,
            start_date: sixMonthsAgo.toISOString().split('T')[0]
          });
          setRentHistory(rentHistoryData);
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

  return { unit, tenant, payments, rentHistory, leases, currentMonthRent, isLoading, error };
};
