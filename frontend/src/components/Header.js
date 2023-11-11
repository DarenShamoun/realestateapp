import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <div className="flex items-center">
                    <Link href="/">
                        <a className="text-xl font-bold">Real Estate App</a>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard"><a>Dashboard</a></Link>
                    <Link href="/properties"><a>Properties</a></Link>
                    {/* Add more navigation links as needed */}
                </div>
            </nav>
        </header>
    );
};

export default Header;
