'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
          <Link key={property.id} href={`/properties/${property.id}`} className="property-card bg-gray-700 shadow rounded p-4 m-2 cursor-pointer">
              <h3 className="text-white font-bold">{property.name}</h3>
              <p className="text-gray-300">{property.address}</p>
              <p className="text-gray-300">{property.property_type}</p>
              <p className="text-gray-300"> Built in {property.year_built}</p>
              <p className="text-gray-300">{property.square_footage} Square Feet</p>
          </Link>
        ))}
      </div>
    </section>
  );
};


export default Properties;
