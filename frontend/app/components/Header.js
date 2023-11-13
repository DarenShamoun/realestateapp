import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav>
        {/* Navigation links */}
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
