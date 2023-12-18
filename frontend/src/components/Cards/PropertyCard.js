'use client';

import React from 'react';
import Link from 'next/link';

const PropertyCard = ({ property, onEdit, onDelete, isManagementMode }) => {
  const cardContent = (
    <>
      <h3 className="text-white font-bold">{property.name}</h3>
      <p className="text-gray-300">{property.address}</p>
      <p className="text-gray-300">{property.property_type}</p>
      <p className="text-gray-300">Built in {property.year_built}</p>
      <p className="text-gray-300">{property.square_footage} Square Feet</p>
      {isManagementMode && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-500 hover:text-red-700 mt-2">
          Delete
        </button>
      )}
    </>
  );

  return isManagementMode ? (
    <div
      className="property-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150"
      onClick={() => onEdit(property)}
    >
      {cardContent}
    </div>
  ) : (
    <Link href={`/properties/${property.id}`} className="property-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
      {cardContent}
    </Link>
  );
};

export default PropertyCard;
