import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-gray-900 selection:bg-[#D4AF37] selection:text-[#0B192C]">
      {/* Global Luxury Store Header */}
      <Header />

      {/* Store Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Luxury Store Footer */}
      <Footer />
    </div>
  );
};
