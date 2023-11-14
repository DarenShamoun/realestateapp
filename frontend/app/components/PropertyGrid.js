import React from 'react';

const PropertyGrid = ({ properties, onPropertySelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {properties.map((property) => (
        <div 
          key={property.id} 
          className="p-4 border rounded shadow-lg cursor-pointer hover:bg-gray-100"
          onClick={() => onPropertySelect(property)}
        >
          <h3 className="text-lg font-bold">{property.name}</h3>
          <p>Type: {property.property_type}</p>
          {/* Additional property details */}
        </div>
      ))}
    </div>
  );
};

export default PropertyGrid;
