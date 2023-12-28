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

        if (unitData.tenant_id) {
          const leaseData = await getLease(unitData.id);
          const tenantData = await getTenant(leaseData.tenant_id);
          setTenant(tenantData);
        }
        
        const paymentsData = await getPayments({ unitId });
        setPayments(paymentsData);

        const leasesData = await getLeases({ unitId });
        setLeases(leasesData);

        const rentData = await getRecentRentByUnitId(unitId);
        if (rentData) {
          unitData.rent_details = rentData;
          unitData.total_rent = rentData.total_rent;
          setUnit(unitData);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnitDetails();
  }, [unitId]);

  return { unit, tenant, payments, leases, isLoading, error };
};
