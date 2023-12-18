'use client';

import React from 'react';
import Link from 'next/link';

const PropertyCard = ({ property, isManagementMode, onEdit, onDelete }) => {
  return (
    <div className="property-card bg-gray-700 shadow rounded p-4 hover:bg-gray-600 transition ease-in-out duration-150">
      <h3 className="text-white font-bold">{property.name}</h3>
      <p className="text-gray-300">{property.address}</p>
      <p className="text-gray-300">{property.property_type}</p>
      <p className="text-gray-300">Built in {property.year_built}</p>
      <p className="text-gray-300">{property.square_footage} Square Feet</p>
      {isManagementMode ? (
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={() => onEdit(property)} className="text-blue-500 hover:text-blue-700">Edit</button>
          <button onClick={() => onDelete(property.id)} className="text-red-500 hover:text-red-700">Delete</button>
        </div>
      ) : (
        <Link href={`/properties/${property.id}`} className="text-blue-500 hover:text-blue-700">View Details</Link>
      )}
    </div>
  );
};

export default PropertyCard;
