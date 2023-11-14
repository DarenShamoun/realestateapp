import React from 'react';
import Header from './components/Header'; // Adjust the path if necessary
import Footer from './components/Footer'; // Adjust the path if necessary
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
