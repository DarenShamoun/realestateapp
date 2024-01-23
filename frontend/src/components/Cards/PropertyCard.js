'use client';

import React from 'react';
import Link from 'next/link';

const PropertyCard = ({ property, isManagementMode, onEdit, onDelete }) => {
  const cardContent = (
    <>
      <h3 className="text-white font-bold">{property.name}</h3>
      <p className="text-gray-300">{property.address}</p>
      <p className="text-gray-300">{property.property_type}</p>
      <p className="text-gray-300">Built in {property.year_built}</p>
      <p className="text-gray-300">{property.square_footage} Square Feet</p>
    </>
  );

  return (
    <Link href={`/properties/${property.id}`} className="property-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
      {cardContent}
    </Link>
  );
};

export default PropertyCard;
