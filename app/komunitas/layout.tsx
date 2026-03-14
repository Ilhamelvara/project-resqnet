import React from 'react';
import Navbar from '../../components/Navbar';

export default function KomunitasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#eaddb9]">
      <Navbar 
        searchPlaceholder="Cari diskusi, anggota, atau topik..."
        buttonText="Bagikan Kampanye" 
        notificationCount={99}
      />
      
      {/* Remove max-w restriction for full width chat experience, just add padding */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
