import { useState, useEffect } from 'react';
import { getUnits } from '@/api/unitService';
import { getTenants } from '@/api/tenantService';
import { getPayments } from '@/api/paymentService';
import { getLeases } from '@/api/leaseService';
import { getRents } from '@/api/rentService';

export const useUnitDetails = (unit_id) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [currentMonthRent, setCurrentMonthRent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const unitData = await getUnits({ unit_id });
        setUnit(unitData);
  
        const leasesData = await getLeases({ unit_id });
        setLeases(leasesData);

        if (leasesData && leasesData.length > 0) {
          const recentLease = leasesData[0]; 
          if (recentLease.tenant_id) {
            const tenantData = await getTenants(recentLease.tenant_id);
            setTenant(tenantData[0]);
          }
        }

        const rentFilters = { unit_id: unit_id, month: currentMonth, year: currentYear };
        const rentsData = await getRents(rentFilters);

        if (rentsData.length > 0) {
          setCurrentMonthRent(rentsData[0]);
        }

        const paymentsData = await getPayments({ unit_id });
        setPayments(paymentsData);
      } catch (err) {
        console.error('Error fetching unit details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnitDetails();
  }, [unit_id]);

  return { unit, tenant, payments, leases, currentMonthRent, isLoading, error };
};
