'use client';

import React from 'react';
import ManagementCard from '@/components/Cards/ManagementCard';

const Management = () => {
  const managementSections = [
    {
      name: 'Properties',
      link: '/management/properties',
      description: 'Add, edit, or remove managed properties.'
    },
    {
      name: 'Units',
      link: '/management/units',
      description: 'Manage individual units within properties.'
    },
    {
      name: 'Tenants',
      link: '/management/tenants',
      description: 'Keep track of tenant information and records.'
    },
    {
      name: 'Leases',
      link: '/management/leases',
      description: 'Oversee leasing agreements and terms.'
    },
    {
      name: 'Payments',
      link: '/management/payments',
      description: 'Monitor incoming and outgoing payments.'
    },
    {
      name: 'Expenses',
      link: '/management/expenses',
      description: 'Record and categorize property expenses.'
    },
    {
      name: 'Rents',
      link: '/management/rents',
      description: 'Track rental rates and changes over time.'
    },
    // Add more sections as needed with appropriate descriptions
  ];

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl text-white font-bold">Management Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {managementSections.map((section) => (
          <ManagementCard
            key={section.name}
            name={section.name}
            link={section.link}
            description={section.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Management;
