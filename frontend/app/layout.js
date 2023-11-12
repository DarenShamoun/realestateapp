import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Real Estate Management App',
  description: 'Manage your properties, tenants, leases, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
