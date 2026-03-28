import React from 'react';
import Navbar from '../../components/Navbar';

export default function PetaBencanaIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#f4ece1] overflow-hidden">
      <Navbar 
        searchPlaceholder="Cari info petabencana.id..." 
        buttonText="Lihat Data Lapangan"
        notificationCount={0}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
