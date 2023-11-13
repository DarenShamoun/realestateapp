import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css'; // Make sure the path to your globals.css is correct

export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
