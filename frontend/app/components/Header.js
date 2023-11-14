import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Real Estate Dashboard</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/properties">Properties</Link>
            </li>
            <li>
              <Link href="/cash-flow">Cash Flow</Link>
            </li>
            <li>
              <Link href="/expenses">Expenses</Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
