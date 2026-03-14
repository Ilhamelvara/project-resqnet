"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, RefreshCw, ChevronDown, AlertTriangle, Plus, X, Waves, Droplets, Flame, Mountain, Wind, ImageIcon, Camera } from 'lucide-react';
import { ArrowBigUp, MessageSquare, Repeat2, MoreHorizontal, User, MapPin, Trash2 } from 'lucide-react';
import api from '../../utils/api';

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
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
              <span>{category}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{report.user?.name || 'Anonim'}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{timeAgo(report.createdAt)}</span>
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

// ---- Create Report Modal ----
function CreateReportModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'info',
    lat: '', lng: '', damageLevel: 'medium', coordinationNeed: 'none',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      files.forEach(file => fd.append('images', file));
      
      await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat laporan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#1a513c]">Buat Laporan Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-3 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Laporan</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required
              placeholder="Contoh: Banjir di Jl. Merdeka..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={3}
              placeholder="Jelaskan situasi secara detail..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]">
                {CATEGORIES.filter(c => c.id).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tingkat Kerusakan</label>
              <select value={form.damageLevel} onChange={e => setForm(p => ({ ...p, damageLevel: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]">
                <option value="light">Ringan</option>
                <option value="medium">Sedang</option>
                <option value="heavy">Berat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Latitude</label>
              <input type="number" step="any" value={form.lat} onChange={e => setForm(p => ({ ...p, lat: e.target.value }))} required
                placeholder="-6.200000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Longitude</label>
              <input type="number" step="any" value={form.lng} onChange={e => setForm(p => ({ ...p, lng: e.target.value }))} required
                placeholder="106.816666"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kebutuhan Koordinasi</label>
            <select value={form.coordinationNeed} onChange={e => setForm(p => ({ ...p, coordinationNeed: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a513c]">
              <option value="none">Tidak ada</option>
              <option value="evacuation">Evakuasi</option>
              <option value="medical">Medis</option>
              <option value="food">Logistik / Makanan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Kejadian</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1a513c] hover:bg-gray-50 transition-all text-gray-400 hover:text-[#1a513c]">
                  <ImageIcon size={24} />
                  <span className="text-[10px] font-bold mt-1">Tambah</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-medium">Maksimal 5 foto. Format JPG, PNG.</p>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-[#1a513c] hover:bg-[#133c2c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={18} className="animate-spin" />Menyimpan...</> : 'Kirim Laporan'}
          </button>
        </form>
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
  const [showModal, setShowModal] = useState(false);

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

  const handleRefresh = () => {
    setPage(1);
    fetchReports(1, activeCategory, true);
  };

  return (
    <div className="space-y-6">
      {/* Composer / Create Report Bar */}
      <div className="bg-[#fcf8ec] rounded-xl p-5 border border-[#eaddb9] shadow-sm">
        <h2 className="text-xl font-bold text-[#1a513c] mb-4">Apa yang ingin anda bagikan hari ini?</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => user ? setShowModal(true) : alert('Login terlebih dahulu.')}
            className="flex-1 bg-[#f4ece1] border border-[#d6c7b0] rounded-full py-3 px-6 text-gray-500 text-left hover:bg-[#eaddb9] transition-colors cursor-pointer"
          >
            Laporkan kejadian bencana di sekitar Anda...
          </button>
          <button
            onClick={() => user ? setShowModal(true) : alert('Login terlebih dahulu.')}
            className="bg-[#f08519] hover:bg-[#d97715] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus size={18} /> Laporan
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
          {user && (
            <button onClick={() => setShowModal(true)}
              className="mt-4 bg-[#1a513c] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#133c2c] transition-colors">
              Jadilah yang pertama melapor
            </button>
          )}
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

      {/* Modal */}
      {showModal && <CreateReportModal onClose={() => setShowModal(false)} onCreated={handleRefresh} />}
    </div>
  );
}
