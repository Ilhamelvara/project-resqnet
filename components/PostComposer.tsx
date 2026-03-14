import React from 'react';
import { Smile, Image as ImageIcon, MapPin, ImagePlus } from 'lucide-react';

export default function PostComposer() {
  return (
    <div className="bg-[#fcf8ec] rounded-xl p-5 mb-6 border border-[#eaddb9] shadow-sm">
      <h2 className="text-xl font-bold text-[#1a513c] mb-4">Apa yang ingin anda bagikan hari ini?</h2>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Tulis pertanyaan atau bagikan kabar dan informasi terbaru..."
          className="w-full bg-[#f4ece1] border border-[#d6c7b0] rounded-full py-3 px-6 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f08519] focus:border-transparent text-center"
        />
      </div>

      <div className="flex justify-between items-center">
        <button className="bg-[#f08519] hover:bg-[#d97715] text-white font-bold py-2 px-8 rounded-lg transition-colors">
          Kirim
        </button>
        
        <div className="flex gap-4">
          <button className="p-2 text-[#f08519] hover:bg-[#eaddb9] rounded-full transition-colors">
            <Smile className="w-8 h-8" />
          </button>
          <button className="p-2 text-[#f08519] hover:bg-[#eaddb9] rounded-full transition-colors">
            <ImageIcon className="w-8 h-8" />
          </button>
          <button className="p-2 text-[#f08519] hover:bg-[#eaddb9] rounded-full transition-colors">
            <MapPin className="w-8 h-8" />
          </button>
          <button className="p-2 text-[#f08519] hover:bg-[#eaddb9] rounded-full transition-colors">
            <ImagePlus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
