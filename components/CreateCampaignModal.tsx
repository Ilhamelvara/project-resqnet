"use client";

import React, { useState } from 'react';
import { X, Loader2, Image as ImageIcon, Calendar, Target, FileText, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCampaignModal({ onClose, onCreated }: CreateCampaignModalProps) {
  const [loading, setLoading] = useState(false);
  const [disasters, setDisasters] = useState<{ id: string; title: string }[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    disasterEventId: '',
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    imageUrl: ''
  });

  React.useEffect(() => {
    // Fetch active disasters for the dropdown
    api.get('/disasters')
      .then(res => setDisasters(res.data.data || []))
      .catch(() => setError('Gagal memuat daftar bencana.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.disasterEventId) {
      setError('Silakan pilih kejadian bencana terkait.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/campaigns', {
        ...formData,
        targetAmount: Number(formData.targetAmount.replace(/\D/g, '')),
        deadline: new Date(formData.deadline).toISOString()
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat kampanye.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#d6c7b0] animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaddb9] bg-[#fcf8ec]">
          <h2 className="text-xl font-bold text-[#1a513c]">Buat Kampanye Baru</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#f08519]" /> Kejadian Bencana
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium bg-white"
                value={formData.disasterEventId}
                onChange={(e) => setFormData({ ...formData, disasterEventId: e.target.value })}
              >
                <option value="">Pilih Kejadian Bencana...</option>
                {disasters.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <FileText size={16} className="text-[#f08519]" /> Judul Kampanye
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Bantuan Logistik Gempa Cianjur"
                className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Target size={16} className="text-[#f08519]" /> Target Dana (Rp)
                </label>
                <input
                  required
                  type="text"
                  placeholder="Isi angka saja..."
                  className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium"
                  value={formData.targetAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, targetAmount: Number(val).toLocaleString('id-ID') });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Calendar size={16} className="text-[#f08519]" /> Batas Waktu
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#f08519]" /> URL Gambar Sampul
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi Lengkap</label>
              <textarea
                required
                rows={4}
                placeholder="Ceritakan alasan penggalangan dana ini..."
                className="w-full px-4 py-3 rounded-xl border border-[#d6c7b0] focus:ring-2 focus:ring-[#f4b820] outline-none font-medium resize-none shadow-inner bg-gray-50"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-[#d6c7b0] text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 rounded-xl bg-[#1a513c] text-white font-bold shadow-lg hover:bg-[#154030] transition-all disabled:opacity-50 flex items-center justify-center gap-2 border-b-4 border-[#0d2a1f] active:border-b-0 active:translate-y-1"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Memproses...</> : 'Publikasikan Kampanye'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
