"use client";

import React, { useState, useEffect } from 'react';
import { getProperties } from '@/api/propertyService';
import { generateRentStubs } from '@/api/documentService';

const RentStubGeneratorCard = () => {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleGenerateClick = async () => {
    if (propertyId && month && year) {
      try {
        const blob = await generateRentStubs(propertyId, month, year);
        
        // Ensure blob is not empty and has size
        if (blob.size > 0) {
            const fileURL = window.URL.createObjectURL(blob);
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `RentStubs_${propertyId}_${month}_${year}.pdf`);
            document.body.appendChild(fileLink);
            fileLink.click();
            window.URL.revokeObjectURL(fileURL); // Clean up to avoid memory leaks
            fileLink.parentNode.removeChild(fileLink);
          } else {
            console.error('Received empty file blob');
          }
      } catch (error) {
        console.error('Error generating rent stubs:', error);
      }
    }
  };


  return (
    <div className="bg-gray-700 shadow rounded p-4 h-auto w-full relative">
      <h2 className="text-xl text-white mb-4">Generate Rent Stubs</h2>
      <div>
        <label className="text-white block mb-2">Property</label>
        <select
          className="p-2 rounded bg-gray-800 text-white w-full"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        >
          <option value="">Select Property</option>
          {properties.map(property => (
            <option key={property.id} value={property.id}>{property.name}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-4 my-4">
        <input type="number" value={month} onChange={e => setMonth(e.target.value)} className="p-2 rounded bg-gray-800 text-white" placeholder="Month (MM)" />
        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="p-2 rounded bg-gray-800 text-white" placeholder="Year (YYYY)" />
      </div>
      <button 
        onClick={handleGenerateClick} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded absolute bottom-4 right-4"
      >
        Generate
      </button>
    </div>
  );
};

export default RentStubGeneratorCard;
