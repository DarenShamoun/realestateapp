// Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 min-w-[250px] bg-gradient-to-b from-gray-700 to-gray-900 p-5 shadow-xl">
      <nav className="mt-10">
        {[
          { name: 'Home', href: '/' },
          { name: 'Properties', href: '/properties' },
          { name: 'Tenants', href: '/tenants' },
          { name: 'Financials', href: '/financials' },
        ].map((link) => (
          // Update Link usage here as per new Next.js documentation
          <Link key={link.name} href={link.href}>
            <span className="block cursor-pointer mb-6 p-3 rounded-lg transition duration-300 ease-in-out transform hover:translate-x-2 hover:bg-gray-600 hover:shadow">
              {link.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
