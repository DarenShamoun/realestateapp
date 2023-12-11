import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="bg-gray-700 text-white w-64 min-h-screen p-5">
      <ul>
        <li className="mb-6">
          <Link href="/">Home</Link>
        </li>
        <li className="mb-6">
          <Link href="/properties">Properties</Link>
        </li>
        <li className="mb-6">
          <Link href="/tenants">Tenants</Link>
        </li>
        <li className="mb-6">
          <Link href="/financials">Financials</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
