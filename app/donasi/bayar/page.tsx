"use client";

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { Minus, Plus, Home, Smartphone, QrCode, Store } from 'lucide-react';

export default function DonasiBayarPage() {
  const [amount, setAmount] = useState<number>(500000);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const quickAmounts = [100000, 200000, 300000, 400000, 500000];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(Number(val));
  };

  const adjustAmount = (modifier: number) => {
    setAmount(prev => Math.max(0, prev + modifier));
  };

  return (
    <div className="min-h-screen bg-[#eaddb9] font-sans text-gray-800 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Main Wrapper */}
        <div className="bg-[#f2ead3] rounded-2xl border border-[#d6c7b0] overflow-hidden shadow-sm p-8">
          
          <h1 className="text-2xl font-bold text-[#1a513c] mb-6">Bantu Korban Gempa Cianjur Kembali Bangkit</h1>

          {/* Header Info Card */}
          <div className="flex gap-6 mb-8">
            <img 
              src="https://images.unsplash.com/photo-1548281315-99d7508ca4ff?q=80&w=600&auto=format&fit=crop" 
              alt="Gempa Cianjur" 
              className="w-[380px] h-[200px] object-cover rounded-xl border border-gray-300"
            />
            <div className="flex flex-col justify-center">
               <h2 className="text-xl font-bold text-[#1a513c] mb-4">Bantu Korban Gempa Cianjur Kembali Bangkit</h2>
               <div className="flex gap-12">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Target Rp 500.000.000</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Terkumpul Rp 250.000.000</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">

            {/* Section 1: Jumlah Donasi */}
            <div className="border border-gray-400 rounded-xl bg-[#fcf8ec] overflow-hidden">
               <div className="p-4 border-b border-gray-300">
                  <h3 className="text-xl font-bold text-gray-900">Jumlah Donasi</h3>
               </div>
               
               <div className="p-6 pt-4">
                 {/* Input Block */}
                 <div className="flex items-center bg-[#f4b820] rounded-xl px-4 py-3 mb-4 shadow-sm">
                    <span className="text-2xl font-bold mr-2 text-gray-900">Rp</span>
                    <input 
                       type="text" 
                       value={amount === 0 ? '' : amount.toLocaleString('id-ID')}
                       onChange={handleManualInput}
                       className="bg-transparent text-2xl font-bold outline-none flex-1 text-gray-900 placeholder-gray-800"
                       placeholder="0"
                    />
                    <div className="flex gap-4">
                      <button onClick={() => adjustAmount(-50000)} className="hover:bg-black/10 p-1 rounded transition-colors text-black">
                        <Minus size={28} strokeWidth={3} />
                      </button>
                      <button onClick={() => adjustAmount(50000)} className="hover:bg-black/10 p-1 rounded transition-colors text-black">
                        <Plus size={28} strokeWidth={3} />
                      </button>
                    </div>
                 </div>

                 {/* Quick Pills */}
                 <div className="flex flex-wrap gap-4">
                    {quickAmounts.map(preset => (
                       <button 
                         key={preset}
                         onClick={() => setAmount(preset)}
                         className={`px-5 py-2 rounded-full border text-sm font-semibold transition-colors
                           ${amount === preset ? 'bg-gray-200 border-gray-500' : 'bg-transparent border-gray-400 hover:bg-gray-100'}`}
                       >
                         Rp{preset.toLocaleString('id-ID')}
                       </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* Section 2: Informasi Donatur */}
            <div className="border border-gray-400 rounded-xl bg-[#fcf8ec] overflow-hidden">
               <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                 <h3 className="text-xl font-bold text-gray-900 whitespace-nowrap">Atas nama</h3>
                 <input 
                    type="text"
                    disabled={isAnonymous}
                    placeholder="Tulis nama anda..."
                    className="flex-1 bg-transparent border border-gray-300 rounded-md px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f08519] disabled:opacity-50"
                 />
                 <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-bold text-gray-900">Sembunyikan Nama (Donasi Anonim)</span>
                 </label>
               </div>
               
               <div className="border-t border-gray-300 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pesan</h3>
                  <textarea 
                     rows={3}
                     placeholder="Tuliskan pesan dukungan anda..."
                     className="w-full bg-white border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f08519] resize-none"
                  ></textarea>
               </div>
            </div>

            {/* Section 3: Diberikan Untuk */}
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Diberikan Untuk</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Cards Mockup (Using placeholder div colors/icons since 3D assets are pending) */}
                  <button className="bg-[#fcf8ec] border-[3px] border-[#f08519] rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:bg-[#f4ebe1] transition-colors h-40">
                     <span className="text-5xl">💊</span>
                     <span className="font-bold text-gray-900 text-sm">Kebutuhan Medis</span>
                  </button>
                  <button className="bg-[#fcf8ec] border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:border-gray-400 transition-colors h-40">
                     <span className="text-5xl">🍞</span>
                     <span className="font-bold text-gray-900 text-sm">Logistik & Makanan</span>
                  </button>
                  <button className="bg-[#fcf8ec] border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:border-gray-400 transition-colors h-40">
                     <span className="text-5xl">⛺</span>
                     <span className="font-bold text-gray-900 text-sm">Tempat Pengungsian</span>
                  </button>
                  <button className="bg-[#fcf8ec] border border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:border-gray-400 transition-colors h-40">
                     <span className="text-5xl">📦</span>
                     <span className="font-bold text-gray-900 text-sm">Semua Kebutuhan</span>
                  </button>
               </div>
            </div>

            {/* Section 4: Metode Pembayaran */}
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Metode Pembayaran</h3>
               <div className="flex flex-wrap gap-3">
                  <button className="bg-[#f08519] text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
                     <span className="bg-white/20 p-1 rounded"><Home size={16} /></span>
                     BANK
                  </button>
                  <button className="bg-[#f08519] text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
                     <span className="bg-white/20 p-1 rounded"><Home size={16} /></span>
                     E-WALLET
                  </button>
                  <button className="bg-[#f08519] text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
                     <span className="bg-white/20 p-1 rounded"><Home size={16} /></span>
                     QRIS
                  </button>
                  <button className="bg-[#f08519] text-white font-bold py-2 px-6 rounded-md shadow flex items-center gap-2">
                     <span className="bg-white/20 p-1 rounded"><Home size={16} /></span>
                     MINIMARKET
                  </button>
               </div>
            </div>

            {/* Section 5: Summary & Submit */}
            <div className="border border-gray-400 rounded-xl bg-[#fcf8ec] p-6 mt-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-4">Detail Donasi</h3>
               
               <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-900">Jumlah Donasi</span>
                  <span className="text-xl font-bold text-gray-900">Rp{amount.toLocaleString('id-ID')}</span>
               </div>
               
               <button className="w-full bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold text-xl py-4 rounded-xl shadow-md border border-[#dca315] transition-colors">
                  Lanjutkan Pembayaran
               </button>
            </div>

          </div>
          
        </div>

      </main>
    </div>
  );
}
