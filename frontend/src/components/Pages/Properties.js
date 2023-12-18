'use client'

import React, { useEffect, useState } from 'react';
import { getProperties } from '@/api/propertyService';
import PropertyCard from '@/components/Cards/PropertyCard';

const Properties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties().then(data => {
      setProperties(data);
    }).catch(error => {
      console.error('Error fetching properties:', error);
    });
  }, []);

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">Properties</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {properties.map(property => (
        <PropertyCard
          key={property.id}
          property={property}
          isManagementMode={false}
        />
        ))}
      </div>
    </section>
  );
};

export default Properties;
