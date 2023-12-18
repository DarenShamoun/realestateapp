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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-4">{property.name}</h1>
      <p className="text-lg text-gray-300 mb-6">{property.address}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(unit => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
};

export default PropertyDetails;
