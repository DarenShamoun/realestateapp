'use client';

import React from 'react';
import Link from 'next/link';

const ManagementCard = ({ name, link, description }) => {
  return (
    <Link href={link} className="management-card bg-gray-700 shadow rounded p-4 cursor-pointer hover:bg-gray-600 transition ease-in-out duration-150">
      <div>
        <h3 className="text-white font-bold">{name}</h3>
        <p className="text-gray-300 mt-2">{description}</p>
      </div>
    </Link>
  );
};

export default ManagementCard;