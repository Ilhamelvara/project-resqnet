"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, RefreshCw, ChevronDown, AlertTriangle, Plus, X, Waves, Droplets, Flame, Mountain, Wind, ImageIcon, Camera } from 'lucide-react';
import { ArrowBigUp, MessageSquare, Repeat2, MoreHorizontal, User, MapPin, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useReportModal } from "../../contexts/ReportModalContext";

// ---- Types ----
interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  damageLevel: string;
  coordinationNeed: string;
  lat: number;
  lng: number;
  images: string[];
  upvoteCount: number;
  status: string;
  createdAt: string;
  user?: { id: string; name: string; avatarUrl?: string };
}

// ---- Constants ----
const CATEGORIES = [
  { id: '', label: 'Semua' },
  { id: 'info', label: 'Informasi' },
  { id: 'evacuation', label: 'Evakuasi' },
  { id: 'medical', label: 'Medis' },
  { id: 'food', label: 'Logistik' },
  { id: 'shelter', label: 'Tempat Tinggal' },
];

const DAMAGE_COLORS: Record<string, string> = {
  light: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  medium: 'bg-orange-100 text-orange-700 border-orange-300',
  heavy: 'bg-red-100 text-red-700 border-red-300',
};
const DAMAGE_LABELS: Record<string, string> = { light: 'Ringan', medium: 'Sedang', heavy: 'Berat' };
const COORD_LABELS: Record<string, string> = { evacuation: '🚨 Evakuasi', medical: '🏥 Medis', food: '🍱 Logistik', none: '' };


function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
}

function formatTime(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateStr));
  } catch (e) {
    return dateStr;
  }
}

// ---- PostCard with real data ----
function ReportPostCard({ report, onUpvote, onDelete, currentUserId }: { 
  report: Report; 
  onUpvote: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId?: string | number | null;
}) {
  const category = CATEGORIES.find(c => c.id === report.category)?.label || report.category;
  const damage = DAMAGE_LABELS[report.damageLevel];
  const coord = COORD_LABELS[report.coordinationNeed];
  const isOwner = currentUserId && report.user?.id === currentUserId;

  return (
    <div className="bg-[#fcf8ec] rounded-xl p-5 mb-4 border border-[#eaddb9] shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f08519] rounded-full flex items-center justify-center text-white shrink-0 font-bold text-lg">
            {report.user?.avatarUrl
              ? <img src={report.user.avatarUrl} className="w-full h-full rounded-full object-cover" />
              : (report.user?.name?.[0]?.toUpperCase() || <User className="w-6 h-6" />)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1a513c] leading-tight">{report.title}</h3>
            <div className="text-sm text-gray-700 font-semibold mt-1 flex items-center gap-2 flex-wrap">
              <span>{formatTime(report.createdAt)}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{report.user?.name || 'Anonim'}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {damage && <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${DAMAGE_COLORS[report.damageLevel]}`}>{damage}</span>}
          {coord && <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">{coord}</span>}
        </div>
      </div>

      {/* Image */}
      {report.images && report.images.length > 0 && (
        <div className="w-full h-[280px] rounded-lg overflow-hidden mb-4">
          <img src={report.images[0]} alt={report.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Description */}
      <p className="text-gray-800 text-base mb-4 font-medium leading-relaxed">{report.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-4 py-1 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 bg-[#f4ece1]">#{category.toLowerCase()}</span>
        {damage && <span className="px-4 py-1 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 bg-[#f4ece1]">#{DAMAGE_LABELS[report.damageLevel]?.toLowerCase()}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => onUpvote(report.id)}
          className="flex items-center gap-2 bg-[#f08519] hover:bg-[#d97715] text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors"
        >
          <ArrowBigUp className="w-5 h-5 fill-white" />
          <span>Dukung • {report.upvoteCount}</span>
          <ArrowBigUp className="w-5 h-5 fill-white rotate-180" />
        </button>

        {report.lat && report.lng && (
          <a href={`https://www.google.com/maps?q=${report.lat},${report.lng}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 border border-[#f08519] text-[#f08519] hover:bg-[#f08519] hover:text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors">
            <MapPin className="w-4 h-4" />
            Lokasi
          </a>
        )}

        {isOwner && (
          <button
            onClick={() => onDelete(report.id)}
            className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}


// ---- Dashboard Main ----
export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('');
  const { openModal } = useReportModal();

  const fetchReports = useCallback(async (pg: number, cat: string, reset = false) => {
    try {
      reset ? setLoading(true) : setLoadingMore(true);
      const params = new URLSearchParams({ page: String(pg) });
      if (cat) params.append('category', cat);
      const res = await api.get(`/reports?${params.toString()}`);
      const { data, pagination } = res.data;
      setReports(prev => reset ? (data || []) : [...prev, ...(data || [])]);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchReports(1, activeCategory, true);
  }, [activeCategory, fetchReports]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReports(next, activeCategory, false);
  };

  const handleUpvote = async (id: string) => {
    if (!user) { alert('Login terlebih dahulu untuk mendukung laporan.'); return; }
    try {
      const res = await api.post(`/reports/${id}/upvote`);
      setReports(prev => prev.map(r => r.id === id ? { ...r, upvoteCount: res.data.data.upvoteCount } : r));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus laporan.');
    }
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
    fetchReports(1, activeCategory, true);
  }, [activeCategory, fetchReports]);

  useEffect(() => {
    window.addEventListener('report-created', handleRefresh);
    return () => window.removeEventListener('report-created', handleRefresh);
  }, [handleRefresh]);

  return (
    <div className="space-y-6">
      {/* Composer / Create Report Bar */}
      <div className="bg-[#fcf8ec] rounded-xl p-5 border border-[#eaddb9] shadow-sm">
        <h2 className="text-xl font-bold text-[#1a513c] mb-4">Apa yang ingin anda bagikan hari ini?</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={openModal}
            className="flex-1 bg-[#f4ece1] border border-[#d6c7b0] rounded-full py-3 px-6 text-gray-500 text-left hover:bg-[#eaddb9] transition-colors cursor-pointer font-semibold"
          >
            Apa yang terjadi di sekitar Anda? Buat postingan...
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap items-center">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full border text-sm font-bold transition-all
              ${activeCategory === cat.id
                ? 'bg-[#1a513c] text-white border-[#1a513c]'
                : 'bg-[#fcf8ec] text-gray-700 border-[#d6c7b0] hover:border-[#1a513c] hover:text-[#1a513c]'}`}>
            {cat.label}
          </button>
        ))}
        <button onClick={handleRefresh}
          className="ml-auto p-2 rounded-full border border-[#d6c7b0] text-gray-500 hover:text-[#1a513c] hover:border-[#1a513c] transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#1a513c]" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <AlertTriangle size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">Belum ada laporan untuk kategori ini.</p>
        </div>
      ) : (
        <>
          {reports.map(r => (
            <ReportPostCard 
              key={r.id} 
              report={r} 
              onUpvote={handleUpvote} 
              onDelete={handleDelete}
              currentUserId={user?.id}
            />
          ))}

          {page < totalPages && (
            <div className="text-center pb-4">
              <button onClick={handleLoadMore} disabled={loadingMore}
                className="flex items-center gap-2 mx-auto bg-[#fcf8ec] hover:bg-[#f4ece1] text-[#1a513c] font-bold py-3 px-8 rounded-xl border border-[#d6c7b0] transition-colors disabled:opacity-60">
                {loadingMore ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
