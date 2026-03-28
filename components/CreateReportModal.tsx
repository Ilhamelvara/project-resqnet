"use client";

import React, { useState } from 'react';
import { Loader2, X, ImageIcon } from 'lucide-react';
import api from '../utils/api';

const CATEGORIES = [
  { id: 'info', label: 'Informasi' },
  { id: 'evacuation', label: 'Evakuasi' },
  { id: 'medical', label: 'Medis' },
  { id: 'food', label: 'Logistik' },
  { id: 'shelter', label: 'Tempat Tinggal' },
];

export default function CreateReportModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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
