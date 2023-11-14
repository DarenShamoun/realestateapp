import React from 'react';
import DashboardPage from './dashboard/page'; // Import the Dashboard component

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Real Estate Management Dashboard</h1>
      <DashboardPage /> {/* Render the Dashboard component */}
    </div>
  );
}
