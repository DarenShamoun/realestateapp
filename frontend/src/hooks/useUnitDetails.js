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
  
        const leasesData = await getLeases({ unit_id, is_active: true });
        setLeases(leasesData);
    
        if (leasesData && leasesData.length > 0 && leasesData[0].is_active) {
          const tenantData = await getTenants({ tenant_id: leasesData[0].tenant_id });
          setTenant(tenantData[0]);
        }

        const CurrentMonthRentFilters = { unit_id: unit_id, month: currentMonth, year: currentYear };
        const CurrentMonthRentData = await getRents(CurrentMonthRentFilters);

        if (CurrentMonthRentData.length > 0) {
          setCurrentMonthRent(CurrentMonthRentData[0]);
        }

        const paymentsData = await getPayments({ lease_id: leasesData[0].id });
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
