"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

// --- MOCK DATA ---
const rooms = [
  "Siaga Bencana Alam dan Gempa",
  "Tips dan Kesehatan Darurat",
  "Sharing Room",
  "Berbagi Info Bencana Alam",
  "Peduli Korban Bencana"
];

const channels = [
  "pengumuman",
  "diskusi-umum",
  "tips-menghadapi-gempa",
  "info-bencana-terbaru",
  "balai-diskusi"
];

const chatMessages = [
  {
    id: 1,
    author: "Lail",
    time: "Hari ini 08.20",
    text: "Ada info terbaru tentang gempa di Cianjur?",
    avatar: "https://ui-avatars.com/api/?name=Lail&background=0D8ABC&color=fff&size=100",
  },
  {
    id: 2,
    author: "Soke",
    time: "Hari ini 08.25",
    text: "Di daerahku aman, Lail. Cuma banyak kerusakan bangunan. Mudah-mudahan korban selamat.",
    avatar: "https://ui-avatars.com/api/?name=Soke&background=FF5722&color=fff&size=100",
    likes: 17,
    comments: 10
  },
  {
    id: 3,
    author: "Hesty",
    time: "Hari ini 08.20",
    text: "Gempa terasa banget di Bandung juga. Ada yang butuh bantuan, ga? Kirimkan info terbaru ya.",
    avatar: "https://ui-avatars.com/api/?name=Hesty&background=4CAF50&color=fff&size=100",
  },
  {
    id: 4,
    author: "Tigor",
    time: "Hari ini 08.20",
    text: "Semoga cepat pulih ya di Cianjur.",
    avatar: "https://ui-avatars.com/api/?name=Tigor&background=9C27B0&color=fff&size=100",
    likes: 20
  },
  {
    id: 5,
    author: "Han",
    time: "Hari ini 08.20",
    text: "Untuk donasi, aku udah kirim ke posko terdekat. Mudah-mudahan bisa membantu mereka yang membutuhkan.",
    avatar: "https://ui-avatars.com/api/?name=Han&background=795548&color=fff&size=100",
    likes: 15,
    comments: 10
  },
  {
    id: 6,
    author: "Mas Lino",
    time: "Hari ini 08.20",
    text: "Ada update untuk orang yang butuh makanan dan obat?",
    avatar: "https://ui-avatars.com/api/?name=MasLino&background=607D8B&color=fff&size=100",
  }
];

const onlineMembers = ["Lail", "Soke", "Hesty", "Tigor", "Han", "Mas Lino"];
const offlineMembers = ["Bahar Safar", "Laut", "Alex", "Ayla"];

export default function KomunitasPage() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Banner Message */}
      <div className="bg-[#eaddb9] border border-[#d6c7b0] rounded-xl p-6 md:p-8 shrink-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a513c] mb-2 leading-tight">
          Selamat Datang <br className="hidden sm:block" /> di Komunitas ResQNet
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-800">
          Diskusi secara terbuka di Komunitas
        </p>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 min-h-0 flex-1">
        
        {/* --- LEFT COLUMN: Navigation & Profile --- */}
        <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-6 min-h-0">
          
          {/* Rooms Navigation */}
          <div className="bg-[#eaddb9] rounded-xl border border-[#d6c7b0] p-4 flex flex-col gap-3 shadow-sm">
             {rooms.map((room, idx) => (
               <button 
                 key={idx} 
                 className="flex items-center justify-between bg-[#fcf8ec] p-4 rounded-lg border border-[#d6c7b0] shadow-sm hover:shadow-md hover:border-[#f08519] transition-all text-left group"
               >
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0"></div>
                    <span className="font-bold text-[#1a513c] text-sm md:text-base leading-tight group-hover:text-[#f08519] transition-colors">{room}</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
               </button>
             ))}
          </div>

          {/* Profile Card */}
          <div className="bg-[#eaddb9] rounded-xl border border-[#d6c7b0] p-5 shadow-sm mt-auto shrink-0 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 rounded-full border-2 border-[#1a513c] p-0.5 relative overflow-hidden">
                 <img src={chatMessages[0].avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
               </div>
               <span className="text-2xl font-bold text-[#f08519]">Lail</span>
            </div>
            
            <button className="w-full bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold py-3 rounded-lg shadow-sm border border-[#dca315] transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* --- MIDDLE COLUMN: Active Chat Feed --- */}
        <div className="md:col-span-2 lg:col-span-6 flex flex-col min-h-0">
          <div className="bg-[#eaddb9] rounded-xl border border-[#d6c7b0] p-6 h-full flex flex-col shadow-sm">
             
             {/* Chat Header */}
             <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-[#d6c7b0] pb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0"></div>
                <h2 className="text-lg md:text-xl font-bold text-[#1a513c]">Siaga Bencana Alam dan Gempa</h2>
             </div>

             {/* Channels Tabs */}
             <div className="flex flex-col gap-2 mb-6 shrink-0">
                {channels.map((ch) => (
                  <button 
                    key={ch}
                    className={`text-left px-4 py-2 rounded-md font-bold text-sm border transition-colors ${
                      ch === 'balai-diskusi' 
                        ? 'bg-[#dca315] text-[#1a513c] border-[#c08d10]' 
                        : 'bg-white text-gray-800 border-[#d6c7b0] hover:bg-gray-50'
                    }`}
                  >
                    # {ch}
                  </button>
                ))}
             </div>

             {/* Messages Area */}
             <div className="flex-1 pb-4">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Pesan</h3>
               
               <div className="flex flex-col gap-6">
                 {chatMessages.map((msg) => (
                   <div key={msg.id} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full border border-gray-300 p-0.5 shrink-0 bg-white overflow-hidden">
                        <img src={msg.avatar} alt={msg.author} className="w-full h-full rounded-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                           <span className="font-bold text-[#f08519]">{msg.author}</span>
                           <span className="font-bold text-[#1a513c]">•</span>
                           <span className="text-sm font-bold text-[#1a513c]">{msg.time}</span>
                        </div>
                        <p className="text-gray-900 font-bold text-[15px] leading-snug mb-2">
                           {msg.text}
                        </p>
                        
                        {/* Status/Interactions row if exists */}
                        {(msg.likes || msg.comments) && (
                          <div className="flex items-center gap-3">
                            {msg.likes && (
                              <div className="flex items-center justify-center min-w-[50px] px-2 py-0.5 bg-white border border-[#f08519] rounded-full text-xs font-bold text-[#f08519]">
                                {/* Assuming custom layout for metric pill */}
                                <span className="w-3 h-1 bg-[#dca315] rounded mr-1 inline-block"></span>
                                {msg.likes}
                              </div>
                            )}
                            {msg.comments && (
                              <div className="flex items-center justify-center min-w-[50px] px-2 py-0.5 bg-white border border-[#f08519] rounded-full text-xs font-bold text-[#f08519]">
                                 <span className="w-3 h-1 bg-gray-400 rounded mr-1 inline-block"></span>
                                 {msg.comments}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
             </div>

          </div>
        </div>

        {/* --- RIGHT COLUMN: Members List --- */}
        <div className="md:col-span-1 lg:col-span-3 flex flex-col min-h-0">
          <div className="bg-[#eaddb9] rounded-xl border border-[#d6c7b0] p-6 h-full flex flex-col shadow-sm">
            
            {/* Online Members */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Anggota</h2>
              <div className="flex flex-col gap-4">
                 {onlineMembers.map((member, i) => (
                   <div key={`on-${i}`} className="flex items-center gap-4 relative">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border border-gray-300 bg-white overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=${member.replace(" ", "+")}&background=random&color=fff&size=100`} alt={member} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="font-bold text-[#f08519]">{member}</span>
                      
                      {/* Divider line except last element visually mocked */}
                      <div className="absolute bottom-[-8px] left-14 right-0 border-b border-gray-300"></div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Offline Members */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Offline</h2>
              <div className="flex flex-col gap-4">
                 {offlineMembers.map((member, i) => (
                   <div key={`off-${i}`} className="flex items-center gap-4 relative">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border border-gray-300 bg-white opacity-70 overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=${member.replace(" ", "+")}&background=b0b0b0&color=fff&size=100`} alt={member} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex flex-col leading-tight">
                         <span className="font-bold text-[#f08519]">{member}</span>
                         {i === 0 && <span className="font-bold text-xs text-gray-800">Offline</span>}
                      </div>

                      <div className="absolute bottom-[-8px] left-14 right-0 border-b border-gray-300"></div>
                   </div>
                 ))}
              </div>
            </div>

          </div>
        </div>

      </div>
      
    </div>
  );
}
