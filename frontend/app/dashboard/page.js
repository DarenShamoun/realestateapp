"use client"

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PropertyGrid from '../components/PropertyGrid';
import PropertyDetails from '../components/dashboard/PropertyDetails';
import { getProperties } from '../api/propertyService';

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-4">
        {selectedProperty ? (
          <PropertyDetails propertyId={selectedProperty.id} />
        ) : (
          <PropertyGrid properties={properties} onPropertySelect={setSelectedProperty} />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
