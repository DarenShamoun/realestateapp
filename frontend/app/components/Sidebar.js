import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <div className="flex flex-col">
        {/* ... */}
        <nav>
          <ul className="flex flex-col space-y-2">
            <li>
              <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/properties" className="hover:bg-gray-700 p-2 rounded">
                Properties
              </Link>
            </li>
            {/* ... */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
