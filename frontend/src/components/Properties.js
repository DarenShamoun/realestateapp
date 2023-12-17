'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties } from '../api/propertyService';
import AddPropertyModal from './Modals/AddPropertyModal';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getProperties().then(data => {
      setProperties(data);
    }).catch(error => {
      console.error('Error fetching properties:', error);
    });
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">Properties</h2>
        <button onClick={handleAddClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {properties.map(property => (
          <Link key={property.id} href={`/properties/${property.id}`} className="property-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
              <h3 className="text-white font-bold">{property.name}</h3>
              <p className="text-gray-300">{property.address}</p>
              <p className="text-gray-300">{property.property_type}</p>
              <p className="text-gray-300">Built in {property.year_built}</p>
              <p className="text-gray-300">{property.square_footage} Square Feet</p>
          </Link>
        ))}
      </div>
      <AddPropertyModal show={showModal} onClose={handleCloseModal} />
    </section>

  );
};

export default Properties;
