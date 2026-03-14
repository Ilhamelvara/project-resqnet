import React from 'react';
import Navbar from '../../components/Navbar';
import Script from 'next/script';

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#eaddb9]">
      {/* Midtrans Snap.js - required for payment popup */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''}
        strategy="beforeInteractive"
      />
      <Navbar 
        buttonText="Bagikan Kampanye" 
        notificationCount={99}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
