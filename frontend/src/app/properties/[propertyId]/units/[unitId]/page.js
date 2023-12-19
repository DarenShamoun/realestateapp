'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';
import UnitDetails from '@/components/Pages/UnitDetails'

const UnitDetailPage = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          <UnitDetails />
        </main>
      </div>
    </>
  );
};

export default UnitDetailPage;
