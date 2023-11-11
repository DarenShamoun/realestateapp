import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold">Real Estate App</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/properties">Properties</Link>
                    {/* Add more navigation links as needed */}
                </div>
            </nav>
        </header>
    );
};

export default Header;
