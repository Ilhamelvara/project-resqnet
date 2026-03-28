"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Map as MapIcon, 
  Users, 
  HeartHandshake, 
  ArrowRight,
  Loader2,
  Home,
  Mountain,
  Flame,
  Wind,
  Plus
} from 'lucide-react';
import api from '../../../utils/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// --- Types ---
interface Disaster {
  id: string;
  type: string;
  title: string;
  severity: string;
  lat: number;
  lng: number;
  region: string;
  occurredAt: string;
  reports?: any[];
  campaigns?: any[];
}

export default function DisasterDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [disaster, setDisaster] = useState<Disaster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    api.get(`/disasters/${id}`)
      .then(res => {
        setDisaster(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Gagal memuat detail bencana.');
        setLoading(false);
      });
  }, [id]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'earthquake': return <Home className="text-white" />;
      case 'flood': return (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
      );
      case 'landslide': return <Mountain className="text-white" />;
      case 'volcano':
      case 'fire': return <Flame className="text-white" fill="currentColor" />;
      case 'tsunami':
      case 'hurricane':
      case 'wind': return <Wind className="text-white" />;
      default: return <AlertTriangle className="text-white" />;
    }
  };

  const getBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-700';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-[#71A850]';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4ece1] gap-4">
        <Loader2 className="w-12 h-12 text-[#1a513c] animate-spin" />
        <p className="font-bold text-[#1a513c]">Memuat data...</p>
      </div>
    );
  }

  if (error || !disaster) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4ece1] gap-6 text-center px-4">
        <AlertTriangle size={64} className="text-red-500 opacity-50" />
        <div>
          <h2 className="text-2xl font-bold text-[#1a513c]">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mt-2">{error || 'Detail bencana tidak ditemukan.'}</p>
        </div>
        <button onClick={() => router.push('/peta')} className="bg-[#1a513c] text-white px-8 py-3 rounded-full font-bold shadow-lg"> Kembali ke Peta </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/peta')}
          className="p-3 bg-white rounded-full shadow hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <ChevronLeft size={24} className="text-[#1a513c]" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded text-white tracking-widest ${getBadgeColor(disaster.severity)}`}>
              {disaster.severity}
            </span>
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
               <MapPin size={12} /> {disaster.region}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a513c] leading-tight">{disaster.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Disaster Info Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#eaddb9] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcf8ec] -mr-12 -mt-12 rounded-full opacity-50"></div>
             <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
               <div className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center shadow-lg ${getBadgeColor(disaster.severity)}`}>
                  {getIconForType(disaster.type)}
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis</p>
                    <p className="text-lg font-bold text-[#1a513c] capitalize">{disaster.type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Waktu Kejadian</p>
                    <p className="text-lg font-bold text-[#1a513c]">
                       {format(new Date(disaster.occurredAt), 'dd MMM yyyy', { locale: localeId })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase">
                       Terkendali
                    </span>
                  </div>
               </div>
             </div>
          </div>

          {/* Associated Reports Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1a513c] flex items-center gap-2">
                   <Users size={24} className="text-[#f08519]" /> Laporan Masyarakat
                </h2>
                <button className="text-sm font-bold text-[#f08519] hover:underline flex items-center gap-1">
                   Lihat Semua <ArrowRight size={14} />
                </button>
             </div>

             {disaster.reports?.length === 0 ? (
                <div className="bg-[#fcf8ec] rounded-2xl p-12 text-center border-2 border-dashed border-[#eaddb9]">
                   <Users size={48} className="mx-auto text-gray-300 mb-4" />
                   <p className="font-bold text-gray-500">Belum ada laporan lapangan untuk kejadian ini.</p>
                </div>
             ) : (
                <div className="grid gap-4">
                   {disaster.reports?.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-2xl p-5 border border-[#eaddb9] shadow-sm hover:shadow-md transition-shadow flex gap-4">
                         {r.images?.[0] ? (
                            <img src={r.images[0]} className="w-24 h-24 rounded-xl object-cover" />
                         ) : (
                            <div className="w-24 h-24 bg-[#f4ece1] rounded-xl flex items-center justify-center text-gray-400">
                               <MapIcon size={24} />
                            </div>
                         )}
                         <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">{r.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{r.description}</p>
                            <div className="flex items-center gap-3 mt-3">
                               <span className="text-[10px] font-black uppercase text-gray-400">
                                  Oleh {r.user?.name || 'Anonim'}
                               </span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                               <span className="text-[10px] font-black uppercase text-gray-400">
                                  {format(new Date(r.createdAt), 'dd MMM')}
                               </span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* Connected Campaigns Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1a513c] flex items-center gap-2">
                   <HeartHandshake size={24} className="text-red-500" /> Penggalangan Dana
                </h2>
                <button 
                  onClick={() => router.push('/donasi')}
                  className="text-sm font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                   Donasi Sekarang <ArrowRight size={14} />
                </button>
             </div>

             {disaster.campaigns?.length === 0 ? (
                <div className="bg-[#fcf8ec] rounded-2xl p-12 text-center border-2 border-dashed border-[#eaddb9]">
                   <HeartHandshake size={48} className="mx-auto text-gray-300 mb-4" />
                   <p className="font-bold text-gray-500">Belum ada kampanye donasi untuk kejadian ini.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {disaster.campaigns?.map((c: any) => (
                      <div 
                        key={c.id} 
                        onClick={() => router.push(`/donasi?campaign=${c.id}`)}
                        className="bg-white rounded-2xl p-5 border border-[#eaddb9] shadow-sm hover:shadow-md transition-all cursor-pointer group group-hover:-translate-y-1"
                      >
                         <h4 className="font-bold text-[#1a513c] mb-2 group-hover:text-[#f08519] transition-colors">{c.title}</h4>
                         <div className="space-y-3">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-red-500 transition-all duration-1000" 
                                 style={{ width: `${Math.min(100, (Number(c.collectedAmount) / Number(c.targetAmount)) * 100)}%` }}
                               ></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                               <span className="text-red-600">Terumpul Rp {Number(c.collectedAmount).toLocaleString('id-ID')}</span>
                               <span className="text-gray-400">Target Rp {Number(c.targetAmount).toLocaleString('id-ID')}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           {/* Mini Map Visual (Placeholder-ish) */}
           <div className="bg-[#a3cbea] rounded-3xl overflow-hidden shadow-sm border border-[#d6c7b0] h-64 relative group">
              <img src="/peta.png" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Marker at center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                 <div className={`${getBadgeColor(disaster.severity)} p-2 rounded-full text-white shadow-xl animate-bounce`}>
                    {getIconForType(disaster.type)}
                 </div>
                 <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-${disaster.severity === 'medium' ? 'yellow' : disaster.severity === 'critical' ? 'red' : 'green'}-500 -mt-1`}></div>
              </div>
              
              <a 
                href={`https://www.google.com/maps?q=${disaster.lat},${disaster.lng}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#1a513c] px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:bg-[#f4ece1] transition-colors flex items-center gap-2"
              >
                 <MapPin size={14} /> Buka Google Maps
              </a>
           </div>

           {/* Quick Actions */}
           <div className="bg-[#1a513c] rounded-3xl p-6 text-white shadow-xl space-y-4">
              <h3 className="text-xl font-bold mb-2 tracking-tight">Butuh Bantuan Segera?</h3>
              <p className="text-sm opacity-90 leading-relaxed font-medium">Bantu laporkan data terkini lapangan atau dukung secara finansial melalui platform ini.</p>
              <div className="space-y-3 pt-2">
                 <button className="w-full py-3 bg-[#f08519] hover:bg-[#d97715] rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Plus size={20} /> Buat Laporan Baru
                 </button>
                 <button 
                   onClick={() => router.push('/donasi')}
                   className="w-full py-3 border-2 border-white/30 hover:bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                 >
                    <HeartHandshake size={20} /> Salurkan Donasi
                 </button>
              </div>
           </div>

           {/* Shared Context Meta */}
           <div className="bg-white rounded-3xl p-6 border border-[#eaddb9] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#1a513c] font-bold">
                 <Clock size={18} />
                 <span>Riwayat Perkembangan</span>
              </div>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-[#f4ece1]">
                 <div className="relative">
                    <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{format(new Date(disaster.occurredAt), 'dd MMM yyyy')}</p>
                    <p className="text-sm font-bold text-gray-800">Kejadian Terdeteksi</p>
                 </div>
                 <div className="relative">
                    <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#f08519] border-4 border-white shadow-sm"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Baru Saja</p>
                    <p className="text-sm font-bold text-gray-800">Platform Koordinasi ResQNet Dibuka</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
