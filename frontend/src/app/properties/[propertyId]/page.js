'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';
import PropertyDetails from '@/components/Details/PropertyDetails';

const PropertyDetailPage = () => {
  const pathname = usePathname();
  const property_id = pathname.split('/').pop();

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          <PropertyDetails property_id = {property_id} />
        </main>
      </div>
    </>
  );
};

export default PropertyDetailPage;
