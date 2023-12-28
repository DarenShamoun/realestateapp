import { useState, useEffect } from 'react';
import { getUnit } from '@/api/unitService';
import { getTenant } from '@/api/tenantService';
import { getPayments } from '@/api/paymentService';
import { getLeases } from '@/api/leaseService';
import { getRecentRentByUnitId } from '@/api/rentService';

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
        const unitData = await getUnit(unitId);
        setUnit(unitData);
  
        const leasesData = await getLeases({ unitId });
        setLeases(leasesData);
  
        if (leasesData && leasesData.length > 0) {
          const recentLease = leasesData[0]; 
          if (recentLease.tenant_id) {
            const tenantData = await getTenant(recentLease.tenant_id);
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
    
        const rentData = await getRecentRentByUnitId(unitId);
        if (rentData) {
          unitData.rent_details = rentData;
          unitData.total_rent = rentData.total_rent;
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

  // Function to get the last six months from the current date
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
