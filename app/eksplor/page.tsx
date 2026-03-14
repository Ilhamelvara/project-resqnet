"use client";

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, MapPin, Clock, Layers, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

// ---- Types ----
interface GempaItem {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
}

interface AutoGempa extends GempaItem {
  Shakemap?: string;
}

const BMKG_PROXY = 'https://data.bmkg.go.id/DataMKG/TEWS/';

const getMagnitudeColor = (mag: number) => {
  if (mag >= 7) return { bg: 'bg-red-700', text: 'text-red-700', border: 'border-red-700', badge: 'bg-red-700' };
  if (mag >= 6) return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', badge: 'bg-red-500' };
  if (mag >= 5) return { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', badge: 'bg-orange-500' };
  return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500', badge: 'bg-yellow-500' };
};

const getMagnitudeLabel = (mag: number) => {
  if (mag >= 7) return 'Kuat Sekali';
  if (mag >= 6) return 'Kuat';
  if (mag >= 5) return 'Sedang';
  return 'Kecil';
};

export default function EksplorMapPage() {
  const [latestEq, setLatestEq] = useState<AutoGempa | null>(null);
  const [recentList, setRecentList] = useState<GempaItem[]>([]);
  const [feltList, setFeltList] = useState<GempaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'terkini' | 'dirasakan'>('terkini');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [autoRes, terkiniRes, dirasakanRes] = await Promise.all([
        fetch(BMKG_PROXY + 'autogempa.json'),
        fetch(BMKG_PROXY + 'gempaterkini.json'),
        fetch(BMKG_PROXY + 'gempadirasakan.json'),
      ]);

      const autoData = await autoRes.json();
      const terkiniData = await terkiniRes.json();
      const dirasakanData = await dirasakanRes.json();

      setLatestEq(autoData?.Infogempa?.gempa || null);
      setRecentList(terkiniData?.Infogempa?.gempa || []);
      setFeltList(dirasakanData?.Infogempa?.gempa || []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch BMKG data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentList = activeTab === 'terkini' ? recentList : feltList;

  return (
    <div className="flex flex-col gap-8">

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1a513c] mb-4 tracking-tight">
          Eksplor Map
        </h1>
        <p className="text-[#1a513c] text-lg font-semibold leading-relaxed">
          Data Gempa Bumi Terkini dari <span className="text-[#f08519]">BMKG</span> — Badan Meteorologi, Klimatologi, dan Geofisika Indonesia
        </p>
      </div>

      {/* Latest Earthquake Hero Card */}
      {latestEq && (() => {
        const mag = parseFloat(latestEq.Magnitude);
        const col = getMagnitudeColor(mag);
        const isTsunami = !latestEq.Potensi?.toLowerCase().includes('tidak berpotensi');
        return (
          <div className={`relative bg-[#fcf8ec] rounded-2xl border-2 ${col.border} shadow-lg overflow-hidden`}>
            {isTsunami && (
              <div className="bg-red-600 text-white text-center py-2 font-bold text-sm flex items-center justify-center gap-2">
                <AlertTriangle size={16} /> BERPOTENSI TSUNAMI — WASPADA
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">

                {/* Magnitude Badge */}
                <div className={`${col.bg} text-white rounded-2xl p-6 flex flex-col items-center justify-center min-w-[120px] shadow-md`}>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Magnitudo</span>
                  <span className="text-5xl font-black">{latestEq.Magnitude}</span>
                  <span className="text-xs font-bold mt-1">{getMagnitudeLabel(mag)}</span>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={18} className="text-[#f08519]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Gempa Terbaru BMKG</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{latestEq.Wilayah}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#f4ece1] rounded-xl p-3 border border-[#d6c7b0]">
                      <p className="text-xs font-bold text-gray-500 mb-1">Tanggal & Jam</p>
                      <p className="font-bold text-gray-900 text-sm">{latestEq.Tanggal}</p>
                      <p className="font-semibold text-gray-700 text-sm">{latestEq.Jam}</p>
                    </div>
                    <div className="bg-[#f4ece1] rounded-xl p-3 border border-[#d6c7b0]">
                      <p className="text-xs font-bold text-gray-500 mb-1">Kedalaman</p>
                      <p className="font-bold text-gray-900">{latestEq.Kedalaman}</p>
                    </div>
                    <div className="bg-[#f4ece1] rounded-xl p-3 border border-[#d6c7b0]">
                      <p className="text-xs font-bold text-gray-500 mb-1">Koordinat</p>
                      <p className="font-bold text-gray-900 text-sm">{latestEq.Lintang}</p>
                      <p className="font-semibold text-gray-700 text-sm">{latestEq.Bujur}</p>
                    </div>
                    <div className={`rounded-xl p-3 border ${isTsunami ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                      <p className="text-xs font-bold text-gray-500 mb-1">Status Tsunami</p>
                      <p className={`font-bold text-sm ${isTsunami ? 'text-red-700' : 'text-green-700'}`}>
                        {isTsunami ? '⚠️ Berpotensi' : '✓ Tidak Berpotensi'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Loading Skeleton */}
      {loading && !latestEq && (
        <div className="bg-[#fcf8ec] rounded-2xl border border-[#d6c7b0] p-8 flex items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#f08519]" />
          <span className="font-bold text-gray-600">Memuat data BMKG...</span>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-[#1a513c]">{recentList.length}</p>
          <p className="text-sm font-bold text-gray-600 mt-1">Gempa Signifikan</p>
          <p className="text-xs text-gray-400">Bulan Terakhir</p>
        </div>
        <div className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-[#f08519]">{feltList.length}</p>
          <p className="text-sm font-bold text-gray-600 mt-1">Gempa Dirasakan</p>
          <p className="text-xs text-gray-400">Terbaru</p>
        </div>
        <div className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-red-600">
            {recentList.filter(g => !g.Potensi?.toLowerCase().includes('tidak')).length + feltList.filter(g => !g.Potensi?.toLowerCase().includes('tidak')).length}
          </p>
          <p className="text-sm font-bold text-gray-600 mt-1">Potensi Tsunami</p>
          <p className="text-xs text-gray-400">Dalam Data</p>
        </div>
      </div>

      {/* List Section with Tabs */}
      <div className="bg-[#fcf8ec] rounded-2xl border border-[#d6c7b0] overflow-hidden shadow-sm">
        {/* Tab Header */}
        <div className="flex border-b border-[#d6c7b0] bg-[#f4ece1]">
          <button onClick={() => setActiveTab('terkini')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'terkini' ? 'text-[#1a513c] bg-[#fcf8ec] border-b-2 border-[#1a513c]' : 'text-gray-600 hover:text-gray-900'}`}>
            🌍 M≥5.0 Terkini ({recentList.length})
          </button>
          <button onClick={() => setActiveTab('dirasakan')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'dirasakan' ? 'text-[#1a513c] bg-[#fcf8ec] border-b-2 border-[#1a513c]' : 'text-gray-600 hover:text-gray-900'}`}>
            🫨 Gempa Dirasakan ({feltList.length})
          </button>
        </div>

        {/* Refresh + Timestamp Row */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-[#d6c7b0]">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
            <Clock size={14} />
            {lastUpdate ? `Diperbarui: ${lastUpdate.toLocaleTimeString('id-ID')}` : 'Memuat...'}
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-[#1a513c] hover:text-[#f08519] transition-colors disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* List Items */}
        <div className="divide-y divide-[#f0e8d8]">
          {currentList.length === 0 && (
            <div className="text-center py-12 text-gray-400 font-semibold">
              {loading ? 'Memuat data...' : 'Tidak ada data'}
            </div>
          )}
          {currentList.map((gempa, idx) => {
            const mag = parseFloat(gempa.Magnitude);
            const col = getMagnitudeColor(mag);
            const isTsunami = !gempa.Potensi?.toLowerCase().includes('tidak berpotensi');
            const key = `${gempa.DateTime}-${idx}`;
            const isExpanded = expanded === key;

            return (
              <div key={key} className="hover:bg-[#f9f5ea] transition-colors">
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                >
                  {/* Magnitude pill */}
                  <div className={`${col.badge} text-white font-black text-sm rounded-lg px-3 py-2 min-w-[60px] text-center shrink-0 shadow-sm`}>
                    M{gempa.Magnitude}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{gempa.Wilayah}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                        <Clock size={12} />{gempa.Tanggal}, {gempa.Jam}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                        <Layers size={12} />{gempa.Kedalaman}
                      </span>
                      {isTsunami && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle size={10} /> Berpotensi Tsunami
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-400 shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-4 bg-[#f9f5ea]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500">Koordinat</p>
                        <p className="font-bold text-gray-800 text-sm">{gempa.Lintang}, {gempa.Bujur}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Kedalaman</p>
                        <p className="font-bold text-gray-800 text-sm">{gempa.Kedalaman}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Potensi Tsunami</p>
                        <p className={`font-bold text-sm ${isTsunami ? 'text-red-600' : 'text-green-600'}`}>{gempa.Potensi}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">Skala</p>
                        <p className={`font-bold text-sm ${col.text}`}>{getMagnitudeLabel(mag)}</p>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${gempa.Coordinates}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#1a513c] hover:text-[#f08519] transition-colors underline"
                    >
                      <MapPin size={14} /> Lihat di Google Maps
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Source Attribution */}
      <p className="text-center text-xs text-gray-400 font-semibold">
        Sumber data: <a href="https://www.bmkg.go.id" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#1a513c]">BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</a> — Diperbarui otomatis setiap 5 menit
      </p>

    </div>
  );
}
