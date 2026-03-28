"use client";

import React from 'react';

export default function PetaBencanaIdPage() {
  return (
    <div className="w-full h-full bg-[#f4ece1] flex flex-col">
      <iframe 
        src="https://petabencana.id" 
        className="w-full h-full border-none shadow-inner"
        title="PetaBencana.id"
        allow="geolocation"
      />
    </div>
  );
}
