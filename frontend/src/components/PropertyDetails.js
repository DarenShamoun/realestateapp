'use client';

import React, { useEffect, useState } from 'react';
import { getProperty } from '../api/propertyService';

const PropertyDetails = ({ propertyId }) => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getProperty(propertyId);
        setProperty(data);
      } catch (error) {
        console.error('Failed to fetch property:', error);
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
    <div>
      <h1>{property.name}</h1>
      <p>{property.address}</p>
      {/* Render more details */}
    </div>
  );
};

export default PropertyDetails;
