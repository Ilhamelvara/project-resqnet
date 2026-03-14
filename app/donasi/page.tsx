"use client";

import React, { useState, useEffect } from 'react';
import { HeartHandshake, ChevronRight, MessageSquare, Heart, Minus, Plus, ChevronUp, ChevronLeft, Landmark, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

// ---- Types ----
interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount: string;
  collectedAmount: string;
  deadline: string;
  status: string;
  org?: { name: string; avatarUrl?: string };
  donations?: { id: string; amount: string; isAnonymous: boolean; user?: { name: string; avatarUrl?: string }; createdAt: string }[];
}

// ---- Donation Form ----
function DonationForm({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(500000);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const quickAmounts = [100000, 200000, 300000, 400000, 500000];
  const categories = [
    { id: 'medis', icon: '💊', label: 'Kebutuhan Medis' },
    { id: 'logistik', icon: '🍞', label: 'Logistik & Makanan' },
    { id: 'pengungsian', icon: '⛺', label: 'Tempat Pengungsian' },
    { id: 'semua', icon: '📦', label: 'Semua Kebutuhan' },
  ];

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(Number(val));
  };

  const handleDonate = async () => {
    setError('');
    if (!user) { setError('Anda harus login untuk melakukan donasi.'); return; }
    if (amount < 10000) { setError('Minimum donasi adalah Rp 10.000'); return; }
    try {
      setSubmitting(true);
      const response = await api.post(`/campaigns/${campaign.id}/donate`, { amount, isAnonymous });
      const { snapToken, redirectUrl } = response.data.data;
      if (typeof window !== 'undefined' && (window as any).snap) {
        (window as any).snap.pay(snapToken, {
          onSuccess: () => { alert('Pembayaran berhasil! Terima kasih 🙏'); onBack(); },
          onPending: () => { alert('Menunggu pembayaran. Cek email Anda.'); onBack(); },
          onError: () => { setError('Pembayaran gagal. Silakan coba lagi.'); },
        });
      } else if (redirectUrl) {
        window.open(redirectUrl, '_blank');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memproses donasi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-[#1a513c]">Form Donasi</h2>
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900">
          <ChevronUp size={18} /> Tutup
        </button>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-lg">{error}</div>}

      {/* Amount */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#fcf8ec] overflow-hidden">
        <div className="p-4 border-b border-[#d6c7b0]"><h3 className="text-lg font-bold">Jumlah Donasi</h3></div>
        <div className="p-5">
          <div className="flex items-center bg-[#f4b820] rounded-xl px-4 py-3 mb-4 shadow-sm">
            <span className="text-2xl font-bold mr-2">Rp</span>
            <input type="text" value={amount === 0 ? '' : amount.toLocaleString('id-ID')} onChange={handleManualInput}
              className="bg-transparent text-2xl font-bold outline-none flex-1" placeholder="0" />
            <button onClick={() => setAmount(p => Math.max(0, p - 50000))} className="hover:bg-black/10 p-1.5 rounded"><Minus size={24} strokeWidth={3} /></button>
            <button onClick={() => setAmount(p => p + 50000)} className="hover:bg-black/10 p-1.5 rounded"><Plus size={24} strokeWidth={3} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map(p => (
              <button key={p} onClick={() => setAmount(p)}
                className={`px-4 py-1.5 rounded-full border text-sm font-semibold transition-colors ${amount === p ? 'bg-gray-200 border-gray-500' : 'border-[#d6c7b0] hover:bg-[#eaddb9]'}`}>
                Rp{p.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Info */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#fcf8ec] overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-[#d6c7b0]">
          <span className="font-bold whitespace-nowrap">Atas nama</span>
          <input type="text" disabled={isAnonymous} defaultValue={user?.name || ''} placeholder="Tulis nama anda..."
            className="flex-1 min-w-0 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f08519] disabled:opacity-50" />
          <label className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setIsAnonymous(v => !v)}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isAnonymous ? 'bg-[#1a513c] border-[#1a513c]' : 'border-gray-400'}`}>
              {isAnonymous && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span className="text-sm font-semibold">Sembunyikan Nama (Anonim)</span>
          </label>
        </div>
        <div className="p-5">
          <p className="font-bold mb-3">Pesan</p>
          <textarea rows={3} placeholder="Tuliskan pesan dukungan anda..."
            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#f08519] resize-none" />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-lg font-bold mb-3">Diberikan Untuk</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-36 border-2 transition-all ${selectedCategory === cat.id ? 'border-[#f08519] bg-[#fff8ee] shadow-md' : 'border-[#d6c7b0] bg-[#fcf8ec] hover:border-gray-400'}`}>
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-bold text-sm text-center">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#fcf8ec] p-6">
        <h3 className="text-lg font-bold mb-4 border-b border-[#d6c7b0] pb-3">Detail Donasi</h3>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold">Jumlah Donasi</span>
          <span className="font-bold text-lg">Rp{amount.toLocaleString('id-ID')}</span>
        </div>
        <button onClick={handleDonate} disabled={submitting}
          className="w-full bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold text-lg py-4 rounded-xl shadow-md border border-[#dca315] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {submitting ? <><Loader2 size={20} className="animate-spin" />Memproses...</> : 'Lanjutkan Pembayaran'}
        </button>
        {!user && <p className="text-center text-sm text-red-500 font-semibold mt-3">* Anda harus login untuk melakukan donasi</p>}
      </div>
    </div>
  );
}

// ---- Campaign Detail View ----
function CampaignDetail({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'kabari'>('ringkasan');
  const [showForm, setShowForm] = useState(false);
  const targetAmount = parseFloat(campaign.targetAmount);
  const collectedAmount = parseFloat(campaign.collectedAmount);
  const progressPercent = Math.min(100, Math.round((collectedAmount / targetAmount) * 100));

  return (
    <div className="bg-[#fcf8ec] rounded-2xl border border-[#d6c7b0] shadow-sm p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#1a513c] mb-5 hover:underline">
        <ChevronLeft size={18} /> Kembali ke Daftar Kampanye
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#1a513c] mb-6">{campaign.title}</h1>

      <div className="w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden mb-6 border border-gray-200 shadow-sm">
        <img src={campaign.imageUrl || 'donasi.png'} alt={campaign.title} className="w-full h-full object-cover" />
      </div>

      {/* Progress */}
      <div className="bg-[#f4ece1] border border-[#d6c7b0] rounded-xl px-5 py-4 mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>Terkumpul: <strong className="text-[#1a513c]">Rp{collectedAmount.toLocaleString('id-ID')}</strong></span>
          <span>Target: <strong>Rp{targetAmount.toLocaleString('id-ID')}</strong></span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-[#f08519] h-3 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-1 text-right">{progressPercent}% tercapai</p>
      </div>

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button onClick={() => setShowForm(v => !v)}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-bold py-3 px-8 rounded-lg shadow-md border border-[#dca315] transition-colors text-lg">
          <HeartHandshake className="w-6 h-6 text-red-600" />
          <span>{showForm ? 'Sembunyikan Form' : 'Donasi Sekarang'}</span>
          <ChevronRight className={`w-5 h-5 opacity-70 transition-transform ${showForm ? 'rotate-90' : ''}`} />
        </button>
        <div className="text-gray-800 font-semibold text-sm bg-[#f4ece1] px-4 py-2 rounded-lg border border-[#d6c7b0]">
          Periode: {new Date(campaign.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {showForm && <DonationForm campaign={campaign} onBack={() => setShowForm(false)} />}

      {!showForm && (
        <>
          <div className="flex border border-[#d6c7b0] rounded-lg overflow-hidden mb-8 bg-[#f4ece1]">
            {(['ringkasan', 'kabari'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center font-bold m-1 rounded-md transition-all capitalize ${activeTab === tab ? 'text-[#1a513c] bg-white shadow-sm border border-[#d6c7b0]' : 'text-gray-700 hover:bg-[#eaddb9] border border-transparent'}`}>
                {tab === 'ringkasan' ? 'Ringkasan' : 'Kabari'}
              </button>
            ))}
          </div>

          <div className="border border-[#d6c7b0] rounded-xl p-6 bg-[#f4ece1] shadow-sm">
            {activeTab === 'ringkasan' && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Deskripsi</h2>
                <p className="text-gray-800 font-medium leading-relaxed mb-8">{campaign.description || 'Tidak ada deskripsi.'}</p>

                <h2 className="text-xl font-bold text-gray-800 mb-6">Penggunaan Dana</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { img: 'kebutuhan.png', title: 'Kebutuhan Medis', desc: 'Penyediaan obat-obatan dan perawatan medis' },
                    { img: 'logistik.png', title: 'Logistik & Makanan', desc: 'Pengelolaan makanan, air bersih, dan kebutuhan sehari-hari' },
                    { img: 'tenda.png', title: 'Tempat Pengungsian', desc: 'Pembangunan tempat tinggal sementara bagi korban' },
                  ].map(item => (
                    <div key={item.title} className="bg-[#fcf8ec] rounded-xl border-2 border-gray-300 p-6 flex flex-col items-center text-center shadow-md hover:border-[#f08519] transition-colors">
                      <div className="w-32 h-32 mb-4"><img src={item.img} alt={item.title} className="w-full h-full object-contain" /></div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-700 font-medium">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {campaign.donations && campaign.donations.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Donatur Terkini</h2>
                    <div className="space-y-3">
                      {campaign.donations.map(d => (
                        <div key={d.id} className="flex items-center gap-3 bg-[#fcf8ec] rounded-xl border border-[#d6c7b0] px-4 py-3">
                          <div className="w-10 h-10 rounded-full bg-[#1a513c] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {d.isAnonymous ? '?' : (d.user?.name?.[0] || '?')}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm">{d.isAnonymous ? 'Hamba Allah' : d.user?.name}</p>
                            <p className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</p>
                          </div>
                          <span className="font-bold text-[#1a513c] text-sm">Rp{parseFloat(d.amount).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            {activeTab === 'kabari' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Kabari</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1a513c] shrink-0">
                    <img src={campaign.org?.avatarUrl || `https://ui-avatars.com/api/?name=${campaign.org?.name || 'Org'}&background=0D8ABC&color=fff&size=100`} alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a513c]">{campaign.org?.name || 'Jawa Barat Rescue'}</h3>
                    <div className="text-sm text-gray-800 font-bold mt-1">Kabar Terbaru &bull; Maret 2026</div>
                  </div>
                </div>
                <div className="w-full h-[400px] mb-4 border-4 border-[#00a8ff] rounded-xl overflow-hidden shadow-sm">
                  <img src="kabari.png" alt="Kabar" className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-800 font-bold text-lg leading-relaxed mb-6">
                  Terima kasih atas donasinya. Warga Cianjur sudah dapat mengungsi dan mendapatkan logistik yang cukup.
                </p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 bg-[#f08519] hover:bg-[#d97715] text-white px-5 py-2 rounded-full font-bold text-sm transition-colors">
                    <Heart className="w-5 h-5 fill-white" /><span>Like &bull; 10k</span>
                  </button>
                  <button className="flex items-center gap-2 bg-[#f08519] hover:bg-[#d97715] text-white px-5 py-2 rounded-full font-bold text-sm transition-colors">
                    <MessageSquare className="w-5 h-5 fill-white" /><span>590</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---- Campaign List Card ----
function CampaignCard({ c, onClick }: { c: Campaign; onClick: () => void }) {
  const target = parseFloat(c.targetAmount);
  const collected = parseFloat(c.collectedAmount);
  const pct = Math.min(100, Math.round((collected / target) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 86400000));

  return (
    <div onClick={onClick} className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#f08519] transition-all cursor-pointer overflow-hidden group">
      <div className="h-48 overflow-hidden">
        <img src={c.imageUrl || 'donasi.png'} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {c.status === 'active' ? 'Aktif' : c.status}
          </span>
          <span className="text-xs text-gray-500 font-semibold">{daysLeft} hari lagi</span>
        </div>
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-tight">{c.title}</h3>
        {c.org && <p className="text-xs text-gray-500 font-semibold mb-3">oleh {c.org.name}</p>}
        <div className="mt-3">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
            <span>Terkumpul</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#f08519] h-2 rounded-full" style={{ width: `${pct}%` }}></div>
          </div>
          <p className="text-sm font-bold text-[#1a513c] mt-2">Rp{collected.toLocaleString('id-ID')}</p>
          <p className="text-xs text-gray-500">dari Rp{target.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function DonasiPage({ campaignId }: { campaignId?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If a specific campaign ID was passed (via /donasi/[id] route), fetch that campaign directly
    if (campaignId) {
      api.get(`/campaigns/${campaignId}`)
        .then(res => {
          setSelectedCampaign(res.data.data);
          setLoading(false);
        })
        .catch(() => { setError('Gagal memuat kampanye.'); setLoading(false); });
      return;
    }

    // Otherwise, fetch list
    api.get('/campaigns?status=active')
      .then(res => {
        setCampaigns(res.data.data || []);
        setLoading(false);
      })
      .catch(() => { setError('Gagal memuat daftar kampanye.'); setLoading(false); });
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={36} className="animate-spin text-[#1a513c]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center font-semibold">{error}</div>
    );
  }

  // Show campaign detail if one is selected
  if (selectedCampaign) {
    return <CampaignDetail campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />;
  }

  // Show campaign list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1a513c]">Kampanye Donasi</h1>
          <p className="text-gray-600 font-medium mt-1">Pilih kampanye untuk mulai berdonasi</p>
        </div>
        <span className="bg-[#fcf8ec] border border-[#d6c7b0] text-[#1a513c] text-sm font-bold px-4 py-2 rounded-lg">
          {campaigns.length} kampanye aktif
        </span>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-semibold">
          <HeartHandshake size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Belum ada kampanye aktif saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(c => (
            <CampaignCard key={c.id} c={c} onClick={async () => {
              // Fetch full detail including donations when clicked
              try {
                const res = await api.get(`/campaigns/${c.id}`);
                setSelectedCampaign(res.data.data);
              } catch {
                setSelectedCampaign(c); // fallback to list data
              }
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
