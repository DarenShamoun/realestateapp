'use client';

import React, { useEffect, useState } from 'react';
import { getProperty } from '@/api/propertyService';
import { getUnitsByPropertyId } from '@/api/unitService';
import UnitCard from '@/components/Cards/UnitCard';

const PropertyDetails = ({ propertyId }) => {
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const propertyData = await getProperty(propertyId);
        setProperty(propertyData);

        const unitsData = await getUnitsByPropertyId(propertyId);
        setUnits(unitsData);
      } catch (error) {
        console.error('Failed to fetch property details:', error);
        setError(error);
      }
      setIsLoading(false);
    };

    if (propertyId) {
      fetchData();
    }
  }, [propertyId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!property) {
    return <div>No property found.</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl text-white font-bold">{property.name}</h2>
        </div>
        <p className="text-lg text-gray-300 mb-2 p-4">{property.address}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {units.map(unit => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
    </section>
  );
};

export default PropertyDetails;
