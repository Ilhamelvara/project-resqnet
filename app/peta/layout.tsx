import React from 'react';
import Navbar from '../../components/Navbar';

export default function PetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#eaddb9] overflow-hidden">
      <Navbar 
        searchPlaceholder="Cari lokasi atau jenis bencana..." 
        buttonText="Buat Laporan" 
        notificationCount={3}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
