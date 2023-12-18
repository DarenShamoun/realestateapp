'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import PropertyDetails from '@/components/PropertyDetails';

const PropertyDetailPage = () => {
  const pathname = usePathname();
  const propertyId = pathname.split('/').pop();

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          <PropertyDetails propertyId={propertyId} />
        </main>
      </div>
    </>
  );
};

export default PropertyDetailPage;
