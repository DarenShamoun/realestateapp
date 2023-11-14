import React, { useEffect, useState } from 'react';
import { getProperty } from '../../api/propertyService'; // Adjusted import path

const PropertyDetails = ({ propertyId }) => {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProperty(propertyId);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };
    
    fetchData();
  }, [propertyId]);

  return property ? (
    <div className="p-4 border rounded shadow-lg">
      <h3 className="text-lg font-bold">{property.name}</h3>
      <p>Type: {property.property_type}</p>
      {/* Additional property details */}
    </div>
  ) : (
    <p>Loading property details...</p>
  );
};
