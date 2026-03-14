import React from 'react';
import Navbar from '../../components/Navbar';

export default function EksplorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#eaddb9] via-[#f2cca0] to-[#eaddb9]">
      <Navbar 
        searchPlaceholder="Cari berdasarkan nama daerah..."
        buttonText="Bagikan Map" 
        notificationCount={99}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
        {children}
      </main>
    </div>
  );
}
