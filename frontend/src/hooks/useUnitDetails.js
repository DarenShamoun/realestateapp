import { useState, useEffect } from 'react';
import { getUnits } from '@/api/unitService';
import { getTenants } from '@/api/tenantService';
import { getPayments } from '@/api/paymentService';
import { getLeases } from '@/api/leaseService';
import { getRents } from '@/api/rentService';

export const useUnitDetails = (unitId) => {
  const [unit, setUnit] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const unitData = await getUnits({ unitId });
        setUnit(unitData);
  
        const leasesData = await getLeases({ unitId });
        setLeases(leasesData);

        if (leasesData && leasesData.length > 0) {
          const recentLease = leasesData[0]; 
          if (recentLease.tenant_id) {
            const tenantData = await getTenants(recentLease.tenant_id);
            setTenant(tenantData);
          }
        }

        const lastSixMonths = getLastSixMonths();
        const paymentsData = await getPayments({ unitId });
        const filteredPayments = paymentsData
          .filter(payment => lastSixMonths.some(date => 
            new Date(payment.date).getMonth() === date.month - 1 && 
            new Date(payment.date).getFullYear() === date.year))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(filteredPayments);
    
        const rentFilters = { unit_id: unitId };
        const rentsData = await getRents(rentFilters);
        const recentRent = rentsData.length > 0 ? rentsData[0] : null;
        if (recentRent) {
          unitData.rent_details = recentRent;
          unitData.total_rent = recentRent.total_rent;
          setUnit(unitData);
        }
  
      } catch (err) {
        console.error('Error fetching unit details:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnitDetails();
  }, [unitId]);

  const getLastSixMonths = () => {
    const months = [];
    let date = new Date();
    for (let i = 0; i < 6; i++) {
      months.push({ month: date.getMonth() + 1, year: date.getFullYear() });
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };
  
  return { unit, tenant, payments, leases, isLoading, error };
};
