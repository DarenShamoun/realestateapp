'use client'

import React, { useEffect, useState } from 'react';
import { getProperties } from '../api/propertyService';

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
      <div className="flex m-4 gap-2">
        {properties.map(property => (
          <div key={property.id} className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div>
              <p className="text-gray-900 font-bold">{property.name}</p>
              <p className="py-4 font-bold">${property.income}</p>
              <p className="text-green-300">{property.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Properties;
