// frontend/app/components/Header.js
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-lg p-4 flex justify-between">
      <Link href="/" className="text-xl font-bold">Real Estate Dashboard</Link>
      <div>
        {/* User profile and search functionality can go here */}
      </div>
    </header>
  );
};

export default Header;
