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
  disbursements?: { id: string; amount: string; description: string; proofUrl?: string; createdAt: string }[];
}

// ---- Donation Form ----
function DonationForm({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(100000);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const quickAmounts = [2000, 10000, 25000, 50000, 100000];

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
          onSuccess: () => { 
            alert('Pembayaran berhasil! Terima kasih 🙏'); 
            window.location.reload(); 
          },
          onPending: () => { 
            alert('Menunggu pembayaran. Cek email Anda.'); 
            onBack(); 
          },
          onError: () => { 
            setError('Pembayaran gagal. Silakan coba lagi.'); 
          },
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
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1 rounded-lg">
          <ChevronUp size={18} /> Tutup
        </button>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-lg">{error}</div>}

      {/* Amount Slider/Buttons */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#fcf8ec] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#d6c7b0] bg-[#eaddb9]"><h3 className="text-lg font-bold text-[#1a513c]">Jumlah Donasi</h3></div>
        <div className="p-5">
          <div className="flex items-center bg-white border-2 border-[#f4b820] rounded-xl px-4 py-3 mb-4 shadow-sm">
            <span className="text-2xl font-bold mr-2 text-[#1a513c]">Rp</span>
            <input type="text" value={amount === 0 ? '' : amount.toLocaleString('id-ID')} onChange={handleManualInput}
              className="bg-transparent text-2xl font-bold outline-none flex-1 text-[#1a513c]" placeholder="0" />
          </div>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map(p => (
              <button key={p} onClick={() => setAmount(p)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${amount === p ? 'bg-[#f4b820] border-[#f4b820] text-[#1a513c]' : 'bg-white border-[#d6c7b0] text-gray-700 hover:border-[#f4b820] shadow-sm'}`}>
                Rp{p.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Info */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#fcf8ec] overflow-hidden shadow-sm">
        <div className="p-5">
           <p className="font-bold text-[#1a513c] mb-3">Informasi Donatur</p>
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 bg-white border border-[#d6c7b0] rounded-xl px-4 py-3">
                 <span className="text-sm font-bold text-gray-500 w-24">Atas Nama</span>
                 <input type="text" disabled={isAnonymous} value={isAnonymous ? 'Hamba Allah (Anonim)' : (user?.name || '')} readOnly
                   className="flex-1 bg-transparent font-bold text-[#1a513c] outline-none" />
              </div>
              
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-[#1a513c] border-[#1a513c]' : 'bg-white border-gray-300 group-hover:border-[#1a513c]'}`}
                     onClick={() => setIsAnonymous(!isAnonymous)}>
                  {isAnonymous && <span className="text-white text-sm font-bold">✓</span>}
                </div>
                <span className="text-sm font-bold text-gray-700">Sembunyikan nama saya (Donasi Anonim)</span>
              </label>
           </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border border-[#d6c7b0] rounded-xl bg-[#eaddb9] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-[#1a513c] text-lg">Total Donasi</span>
          <span className="font-extrabold text-[#1a513c] text-2xl">Rp{amount.toLocaleString('id-ID')}</span>
        </div>
        <button onClick={handleDonate} disabled={submitting}
          className="w-full bg-[#f08519] hover:bg-[#d97715] text-white font-extrabold text-lg py-4 rounded-xl shadow-lg border-b-4 border-[#bc6612] transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
          {submitting ? <><Loader2 size={24} className="animate-spin" />Memproses...</> : 'Lanjutkan Pembayaran'}
        </button>
        {!user && <p className="text-center text-xs text-red-600 font-bold mt-4 uppercase tracking-wider">* Silakan login terlebih dahulu untuk berdonasi</p>}
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
    <div className="bg-white rounded-2xl border border-[#d6c7b0] shadow-sm p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#1a513c] mb-6 hover:translate-x-[-4px] transition-transform">
        <ChevronLeft size={20} className="bg-[#eaddb9] rounded-full p-0.5" /> Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
            <img src={campaign.imageUrl || 'donasi.png'} alt={campaign.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#1a513c] shadow-sm">
              {campaign.org?.name}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex border border-[#d6c7b0] rounded-xl overflow-hidden mb-6 bg-[#fcf8ec] p-1">
              {(['ringkasan', 'kabari'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-center font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'text-[#1a513c] bg-[#f4b820] shadow-sm' : 'text-gray-500 hover:text-[#1a513c] hover:bg-gray-100'}`}>
                  {tab === 'ringkasan' ? 'Deskripsi' : 'Laporan Penyaluran'}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === 'ringkasan' && (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-bold text-[#1a513c] mb-4">Mengenai Kampanye Ini</h2>
                  <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{campaign.description || 'Tidak ada deskripsi.'}</p>
                </div>
              )}
              {activeTab === 'kabari' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <h2 className="text-xl font-bold text-[#1a513c] mb-4">Laporan Penyaluran Dana</h2>
                  {campaign.disbursements && campaign.disbursements.length > 0 ? (
                    <div className="space-y-6">
                      {campaign.disbursements.map(db => (
                        <div key={db.id} className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-2 h-full bg-[#f08519]"></div>
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{new Date(db.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                 <h3 className="text-2xl font-extrabold text-[#1a513c]">Rp{parseFloat(db.amount).toLocaleString('id-ID')}</h3>
                              </div>
                              {db.proofUrl && (
                                <a href={db.proofUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 underline bg-blue-50 px-2 py-1 rounded">
                                   Lihat Bukti
                                </a>
                              )}
                           </div>
                           <p className="text-gray-700 font-medium">{db.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-[#fcf8ec] rounded-2xl border border-dashed border-[#d6c7b0]">
                       <Landmark size={48} className="mx-auto text-[#d6c7b0] mb-3" />
                       <p className="text-gray-500 font-bold">Belum ada laporan penyaluran dana.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a513c] leading-tight">{campaign.title}</h1>
          
          <div className="bg-[#fcf8ec] border border-[#d6c7b0] rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-sm font-bold text-gray-500 uppercase">Terkumpul</p>
                  <p className="text-3xl font-extrabold text-[#1a513c]">Rp{collectedAmount.toLocaleString('id-ID')}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase">Target</p>
                  <p className="text-sm font-bold text-gray-700">Rp{targetAmount.toLocaleString('id-ID')}</p>
               </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 shadow-inner">
              <div className="bg-gradient-to-r from-[#f4b820] to-[#f08519] h-4 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter">
               <span className="text-[#f08519]">{progressPercent}% Tercapai</span>
               <span className="text-gray-500">{new Date(campaign.deadline).getTime() > Date.now() ? `${Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / 86400000)} Hari Lagi` : 'Selesai'}</span>
            </div>
          </div>

          <button onClick={() => setShowForm(v => !v)}
            className="w-full flex items-center justify-center gap-3 bg-[#f4b820] hover:bg-[#dca315] text-[#1a513c] font-extrabold py-5 px-8 rounded-2xl shadow-lg border-b-4 border-[#dca315] transition-all active:scale-95 text-xl">
            <HeartHandshake className="w-8 h-8 text-red-600 animate-pulse" />
            <span>{showForm ? 'Sembunyikan Form' : 'Donasi Sekarang'}</span>
          </button>

          {showForm && <DonationForm campaign={campaign} onBack={() => setShowForm(false)} />}
          
          <div className="lg:hidden mt-10">
             {/* Mobile Tabs */}
             <div className="flex border border-[#d6c7b0] rounded-xl overflow-hidden mb-6 bg-[#fcf8ec] p-1">
                {(['ringkasan', 'kabari'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-center font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'text-[#1a513c] bg-[#f4b820] shadow-sm' : 'text-gray-500 hover:text-[#1a513c]'}`}>
                    {tab === 'ringkasan' ? 'Deskripsi' : 'Laporan'}
                  </button>
                ))}
            </div>
            {/* Same content as above but for mobile view */}
            <div className="text-gray-700 font-medium">
               {activeTab === 'ringkasan' ? campaign.description : 'Lihat laporan di tab Kabari.'}
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-[#1a513c] border-b-2 border-[#eaddb9] pb-2">Donatur Terkini</h3>
             {campaign.donations && campaign.donations.length > 0 ? (
               <div className="space-y-3">
                 {campaign.donations.map(d => (
                   <div key={d.id} className="flex items-center gap-3 bg-white rounded-xl border border-[#d6c7b0] px-4 py-3 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-[#1a513c] text-[#f4b820] flex items-center justify-center text-lg font-black shrink-0 border-2 border-[#f4b820]">
                       {d.isAnonymous ? '?' : (d.user?.name?.[0]?.toUpperCase() || 'U')}
                     </div>
                     <div className="flex-1">
                       <p className="font-bold text-[#1a513c] text-sm leading-tight">{d.isAnonymous ? 'Hamba Allah' : d.user?.name}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase">{new Date(d.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                     </div>
                     <span className="font-black text-[#1a513c] text-sm">Rp{parseFloat(d.amount).toLocaleString('id-ID')}</span>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-gray-500 font-bold text-center py-4">Jadilah donatur pertama!</p>
             )}
          </div>
        </div>
      </div>
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
    <div onClick={onClick} className="bg-white border border-[#d6c7b0] rounded-2xl shadow-sm hover:shadow-xl hover:border-[#f08519] transition-all cursor-pointer overflow-hidden group flex flex-col h-full">
      <div className="h-48 overflow-hidden relative">
        <img src={c.imageUrl || 'donasi.png'} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex gap-2">
           <span className="bg-[#1a513c]/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
             {c.status === 'active' ? 'Aktif' : c.status}
           </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-gray-700 shadow-sm border border-gray-200">
           {daysLeft} Hari Lagi
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-extrabold text-[#1a513c] text-lg mb-1 line-clamp-2 leading-tight group-hover:text-[#f08519] transition-colors">{c.title}</h3>
        {c.org && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Edisi oleh {c.org.name}</p>}
        
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-1">
             <span className="text-[10px] font-bold text-gray-500 uppercase">Terkumpul</span>
             <span className="text-xs font-bold text-[#f08519]">{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#f4b820] to-[#f08519] h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-3">
             <p className="text-xl font-black text-[#1a513c]">Rp{collected.toLocaleString('id-ID')}</p>
             <ChevronRight size={24} className="text-[#f4b820] group-hover:translate-x-1 transition-transform" />
          </div>
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

    // Listen for new campaign creation to refresh list
    const handleRefresh = () => {
      setLoading(true);
      api.get('/campaigns?status=active')
        .then(res => {
          setCampaigns(res.data.data || []);
          setLoading(false);
        })
        .catch(() => { setError('Gagal memuat daftar kampanye.'); setLoading(false); });
    };

    window.addEventListener('campaign-created', handleRefresh);
    return () => {
      window.removeEventListener('campaign-created', handleRefresh);
    };
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
