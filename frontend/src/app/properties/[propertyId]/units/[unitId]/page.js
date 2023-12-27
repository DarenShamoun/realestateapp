'use client';

import React from 'react';
import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';
import UnitDetails from '@/components/Details/UnitDetails';

const UnitDetailPage = ({ params }) => {
  const { unitId } = params;

  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow ml-64 relative">
          <Navbar />
          <UnitDetails unitId={unitId} />
        </main>
      </div>
    </>
  );
};

export default UnitDetailPage;
