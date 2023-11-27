import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
