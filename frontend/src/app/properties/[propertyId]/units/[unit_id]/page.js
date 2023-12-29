'use client';

import React from 'react';
import Sidebar from '@/components/Navigation/Sidebar';
import Navbar from '@/components/Navigation/Navbar';
import UnitDetails from '@/components/Details/UnitDetails';

const UnitDetailPage = ({ params }) => {
  const { unit_id } = params;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow ml-64 relative">
        <Navbar />
        <UnitDetails unit_id={unit_id} />
      </main>
    </div>
  );
};

export default UnitDetailPage;
