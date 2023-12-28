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
          // Assuming you want the tenant of the most recent lease
          const recentLease = leasesData[0]; 
          if (recentLease.tenant_id) {
            const tenantData = await getTenant(recentLease.tenant_id);
            setTenant(tenantData);
          }
        }
        
        const paymentsData = await getPayments({ unitId });
        setPayments(paymentsData);
  
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
  
  return { unit, tenant, payments, leases, isLoading, error };
};
