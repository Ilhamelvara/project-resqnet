"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Home, 
  Mountain, 
  Flame, 
  Wind, 
  AlertTriangle, 
  HeartHandshake, 
  Users,
  Plus,
  Minus,
  X,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Types
interface Disaster {
  id: string;
  type: string;
  title: string;
  severity: string;
  lat: number;
  lng: number;
  region: string;
  occurredAt: string;
}

export default function PetaBencana() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Data State
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDisaster, setNewDisaster] = useState({
    type: 'earthquake',
    title: '',
    severity: 'medium',
    lat: '',
    lng: '',
    region: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Sidebar Filter State
  const [filters, setFilters] = useState({
    gempaBumi: true,
    banjir: true,
    longsor: true,
    kebakaran: true,
    anginPutingBeliung: true,
  });

  // Fetch data
  const fetchDisasters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/disasters');
      if (response.data && response.data.data) {
        setDisasters(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch disasters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  // Handle Form Submit
  const handleCreateDisaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitLoading(true);

    try {
      if (!user) {
         throw new Error("Anda harus login untuk melaporkan kejadian.");
      }

      await api.post('/disasters', {
        ...newDisaster,
        lat: parseFloat(newDisaster.lat),
        lng: parseFloat(newDisaster.lng),
        occurredAt: new Date().toISOString()
      });

      setIsModalOpen(false);
      setNewDisaster({ type: 'earthquake', title: '', severity: 'medium', lat: '', lng: '', region: '' });
      fetchDisasters(); // Refresh map
    } catch (err: any) {
      console.error("Create disaster error", err);
      setSubmitError(err.response?.data?.message || err.message || "Gagal melaporkan kejadian");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper functions for markers
  const getIconForType = (type: string) => {
    switch (type) {
      case 'earthquake': return <Home size={18} />;
      case 'flood': return (
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.3 0 2.3-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>
      );
      case 'landslide': return <Mountain size={18} />;
      case 'volcano':
      case 'fire': return <Flame size={18} fill="currentColor" />;
      case 'tsunami':
      case 'hurricane':
      case 'wind': return <Wind size={18} />;
      default: return <AlertTriangle size={18} />;
    }
  };

  const getColorForSeverity = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-700';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-[#71A850]'; // Greenish
      default: return 'bg-gray-500';
    }
  };

  const getBorderForSeverity = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-t-red-700';
      case 'high': return 'border-t-red-500';
      case 'medium': return 'border-t-yellow-500';
      case 'low': return 'border-t-[#71A850]';
      default: return 'border-t-gray-500';
    }
  };

  // Static Map Coordinate Projection
  // Assuming map image bounds: Indonesia bounding box roughly
  // Top Left: Lat 6°N, Lng 95°E
  // Bottom Right: Lat 11°S (-11), Lng 141°E
  const calculatePosition = (lat: number, lng: number) => {
    // Math to convert geographic coordinate bounds to 0-100% CSS
    const maxLat = 6;
    const minLat = -11;
    const minLng = 95;
    const maxLng = 141;

    // Clamp values just in case they are way outside Indonesia
    const cLat = Math.min(Math.max(lat, minLat), maxLat);
    const cLng = Math.min(Math.max(lng, minLng), maxLng);

    const leftPercent = ((cLng - minLng) / (maxLng - minLng)) * 100;
    const topPercent = ((maxLat - cLat) / (maxLat - minLat)) * 100;

    return { left: `${leftPercent}%`, top: `${topPercent}%` };
  };

  return (
    <div className="flex h-full w-full bg-[#f4ece1] relative">
      
      {/* Sidebar - Left Side */}
      <aside className="w-[320px] lg:w-[380px] bg-[#eaddb9] h-full overflow-y-auto flex flex-col hide-scrollbar border-r border-[#d6c7b0]">
        
        {/* Header Title */}
        <div className="p-6 pb-2">
          <h2 className="text-2xl font-bold text-[#1a513c]">Peta Bencana</h2>
        </div>

        {/* Filters Container */}
        <div className="p-4 space-y-4">
          
          {/* Card 1: Filter Lokasi */}
          <div className="bg-[#fcf8ec] p-4 rounded-xl border border-[#d6c7b0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1a513c] mb-3">Filter</h3>
            <div className="space-y-3">
               <input 
                  type="text" 
                  placeholder="Kota/Kabupaten" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#f08519]"
               />
               <input 
                  type="text" 
                  placeholder="Provinsi/Daerah Istimewa" 
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#f08519]"
               />
            </div>
          </div>

          {/* Card 2: Jenis Bencana */}
          <div className="bg-[#fcf8ec] p-4 rounded-xl border border-[#d6c7b0] shadow-sm">
            <h3 className="text-lg font-bold text-[#1a513c] mb-3">Jenis Bencana</h3>
            <div className="space-y-2">
              
              <label className="flex items-center gap-3 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm hover:border-[#f08519] transition-colors">
                <input type="checkbox" className="hidden" checked={filters.gempaBumi} onChange={(e) => setFilters(prev => ({...prev, gempaBumi: e.target.checked}))} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${filters.gempaBumi ? 'bg-[#f08519]' : 'bg-gray-300'}`}>
                   <Home size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">Gempa Bumi</span>
              </label>

              <label className="flex items-center gap-3 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm hover:border-[#f08519] transition-colors">
                <input type="checkbox" className="hidden" checked={filters.banjir} onChange={(e) => setFilters(prev => ({...prev, banjir: e.target.checked}))} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${filters.banjir ? 'bg-[#f08519]' : 'bg-gray-300'}`}>
                   {getIconForType('flood')}
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">Banjir</span>
              </label>

              <label className="flex items-center gap-3 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm hover:border-[#f08519] transition-colors">
                <input type="checkbox" className="hidden" checked={filters.longsor} onChange={(e) => setFilters(prev => ({...prev, longsor: e.target.checked}))} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${filters.longsor ? 'bg-[#f08519]' : 'bg-gray-300'}`}>
                   <Mountain size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">Longsor</span>
              </label>

              <label className="flex items-center gap-3 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm hover:border-[#f08519] transition-colors">
                <input type="checkbox" className="hidden" checked={filters.kebakaran} onChange={(e) => setFilters(prev => ({...prev, kebakaran: e.target.checked}))} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${filters.kebakaran ? 'bg-[#f08519]' : 'bg-gray-300'}`}>
                   <Flame size={14} fill="currentColor" />
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">Kebakaran</span>
              </label>

               <label className="flex items-center gap-3 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm hover:border-[#f08519] transition-colors">
                <input type="checkbox" className="hidden" checked={filters.anginPutingBeliung} onChange={(e) => setFilters(prev => ({...prev, anginPutingBeliung: e.target.checked}))} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${filters.anginPutingBeliung ? 'bg-[#f08519]' : 'bg-gray-300'}`}>
                   <Wind size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1">Angin Puting Beliung</span>
              </label>

            </div>
          </div>

          {/* Card 3: Urgensi */}
          <div className="bg-[#fcf8ec] p-4 rounded-xl border border-[#d6c7b0] shadow-sm">
             <h3 className="text-lg font-bold text-[#1a513c] mb-3">Urgensi</h3>
             <div className="grid grid-cols-2 gap-3">
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm">
                 <div className="w-4 h-4 rounded-full border-4 border-red-700"></div>
                 <span className="text-sm font-bold text-gray-800">Kritis</span>
               </div>
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm">
                 <div className="w-4 h-4 rounded-full border-4 border-red-500"></div>
                 <span className="text-sm font-bold text-gray-800">Tinggi</span>
               </div>
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm">
                 <div className="w-4 h-4 rounded-full border-4 border-yellow-500"></div>
                 <span className="text-sm font-bold text-gray-800">Sedang</span>
               </div>
               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 shadow-sm">
                 <div className="w-4 h-4 rounded-full border-4 border-[#71A850]"></div>
                 <span className="text-sm font-bold text-gray-800">Rendah</span>
               </div>
             </div>
          </div>

          {/* Card 4: Actions */}
          <div className="bg-[#eaddb9] rounded-xl border border-gray-300 shadow-sm p-3 grid grid-cols-2 gap-2 bg-gradient-to-br from-[#f2e6d0] to-[#eaddb9]">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="col-span-2 flex items-center justify-center gap-2 bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold py-2.5 rounded shadow border border-[#dca315] transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              Laporkan Kejadian!
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold py-2.5 rounded shadow border border-[#dca315] transition-colors">
              <HeartHandshake className="w-5 h-5 text-red-600" />
              Donasi
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold py-2.5 rounded shadow border border-[#dca315] transition-colors">
              <Users className="w-5 h-5 text-red-600" />
              Relawan
            </button>
          </div>
          
        </div>
      </aside>

      {/* Map Area - Right Side */}
      <section className="flex-1 relative pb-4 pr-4 pt-16 lg:pt-6 pl-4 flex flex-col">
        
        {/* Top Floating Button Layer */}
        <div className="absolute top-8 right-8 z-10 font-sans flex items-center gap-3">
          {loading && (
             <span className="bg-white px-3 py-1.5 rounded shadow-sm text-sm font-semibold text-gray-600 animate-pulse border border-gray-200">
               Memperbarui peta...
             </span>
          )}
          <button className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-1.5 px-6 border border-gray-300 rounded shadow-sm flex items-center gap-2">
            Tanggal
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-[#a3cbea] rounded-xl shadow-inner overflow-hidden relative border border-gray-300">
           {/* Static Map Image Replacement for implementation (Southeast Asia showing Indonesia/Malaysia as in mockup) */}
           <img 
             src="peta.png" 
             alt="Map Background" 
             className="w-full h-full object-cover mix-blend-multiply opacity-70"
             style={{ objectPosition: '30% 80%' }} 
           />

           {/* Dynamic API Markers Overlay */}
           {disasters.filter(d => {
              switch (d.type) {
                case 'earthquake': return filters.gempaBumi;
                case 'flood': return filters.banjir;
                case 'landslide': return filters.longsor;
                case 'volcano':
                case 'fire': return filters.kebakaran;
                case 'tsunami':
                case 'hurricane':
                case 'wind': return filters.anginPutingBeliung;
                default: return true;
              }
           }).map((d) => {
              const pos = calculatePosition(d.lat, d.lng);
              const bgColor = getColorForSeverity(d.severity);
              const bColor = getBorderForSeverity(d.severity);

              return (
                 <div 
                   key={d.id} 
                   className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center drop-shadow-md group cursor-pointer"
                   style={{ top: pos.top, left: pos.left }}
                 >
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-[45px] opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-lg border border-gray-200 w-48 pointer-events-none z-50">
                       <p className="font-bold text-gray-900 text-sm truncate">{d.title}</p>
                       <p className="text-xs text-gray-600 mt-0.5">{d.region}</p>
                       <div className="flex justify-between items-center mt-2">
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white ${bgColor}`}>{d.severity}</span>
                          <span className="text-[10px] text-gray-500">
                             {format(new Date(d.occurredAt), 'dd MMM yyyy', { locale: id })}
                          </span>
                       </div>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           router.push(`/peta/${d.id}`);
                         }}
                         className="w-full mt-3 bg-[#1a513c] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[#133c2c] transition-colors flex items-center justify-center gap-1"
                       >
                         Lihat Detail <ArrowRight size={10} />
                       </button>
                    </div>

                    <div className={`${bgColor} p-2 rounded-full text-white relative z-10 transition-transform group-hover:scale-110 shadow-md`}>
                      {getIconForType(d.type)}
                    </div>
                    <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] ${bColor} -mt-1 group-hover:translate-y-0.5 transition-transform`}></div>
                 </div>
              );
           })}


           {/* Map Controls */}
           <div className="absolute bottom-6 left-6 flex flex-col bg-white rounded shadow-md overflow-hidden border border-gray-200">
             <button className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black border-b border-gray-200 transition-colors">
               <Plus size={24} />
             </button>
             <button className="p-3 text-gray-600 hover:bg-gray-100 hover:text-black transition-colors">
               <Minus size={24} />
             </button>
           </div>
           
        </div>
      </section>

      {/* --- CREATE DISASTER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-[#fcf8ec] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-[#d6c7b0]">
              
              <div className="flex items-center justify-between p-5 border-b border-[#d6c7b0] bg-[#eaddb9]">
                 <h2 className="text-xl font-bold text-[#1a513c] flex items-center gap-2">
                    <AlertTriangle className="text-[#f08519]" />
                    Laporan Kejadian Bencana
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleCreateDisaster} className="p-6 space-y-4">
                 
                 {submitError && (
                   <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-semibold border border-red-200">
                     {submitError}
                   </div>
                 )}

                 <div>
                    <label className="block text-sm font-bold text-[#1a513c] mb-1">Judul Kejadian</label>
                    <input 
                      required
                      type="text" 
                      value={newDisaster.title}
                      onChange={(e) => setNewDisaster({...newDisaster, title: e.target.value})}
                      placeholder="Contoh: Gempa Bumi M5.6 Cianjur"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519]"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-[#1a513c] mb-1">Jenis Bencana</label>
                       <select 
                         value={newDisaster.type}
                         onChange={(e) => setNewDisaster({...newDisaster, type: e.target.value})}
                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519] bg-white"
                       >
                         <option value="earthquake">Gempa Bumi</option>
                         <option value="flood">Banjir</option>
                         <option value="volcano">Gunung Meletus</option>
                         <option value="tsunami">Tsunami</option>
                         <option value="landslide">Longsor</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-[#1a513c] mb-1">Tingkat Keparahan</label>
                       <select 
                         value={newDisaster.severity}
                         onChange={(e) => setNewDisaster({...newDisaster, severity: e.target.value})}
                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519] bg-white"
                       >
                         <option value="low">Rendah (Low)</option>
                         <option value="medium">Sedang (Medium)</option>
                         <option value="high">Tinggi (High)</option>
                         <option value="critical">Kritis (Critical)</option>
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-[#1a513c] mb-1">Wilayah Terdampak</label>
                    <input 
                      required
                      type="text" 
                      value={newDisaster.region}
                      onChange={(e) => setNewDisaster({...newDisaster, region: e.target.value})}
                      placeholder="Provinsi / Kabupaten"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519]"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-[#1a513c] mb-1">Latitude (Garis Lintang)</label>
                        <input 
                          required
                          type="number" 
                          step="any"
                          value={newDisaster.lat}
                          onChange={(e) => setNewDisaster({...newDisaster, lat: e.target.value})}
                          placeholder="-6.822"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#1a513c] mb-1">Longitude (Garis Bujur)</label>
                        <input 
                          required
                          type="number" 
                          step="any"
                          value={newDisaster.lng}
                          onChange={(e) => setNewDisaster({...newDisaster, lng: e.target.value})}
                          placeholder="107.138"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#f08519]"
                        />
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 italic">* Lat Range: 6 (Utara) d/d -11 (Selatan) <br/>  * Lng Range: 95 (Barat) s/d 141 (Timur)</p>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 bg-[#1a513c] text-white font-bold py-2.5 rounded-lg hover:bg-[#133c2c] transition-colors disabled:opacity-50"
                    >
                      {submitLoading ? 'Menyimpan...' : 'Kirim Laporan'}
                    </button>
                 </div>
              </form>

           </div>
        </div>
      )}

    </div>
  );
}
