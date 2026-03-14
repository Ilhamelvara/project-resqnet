import React from 'react';
import { ArrowBigUp, MessageSquare, Repeat2, MoreHorizontal, User } from 'lucide-react';
import Image from 'next/image';

interface PostCardProps {
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  description: string;
  tags: string[];
  upvotes: string;
  comments: string;
}

export default function PostCard({
  title,
  category,
  date,
  imageSrc,
  description,
  tags,
  upvotes,
  comments
}: PostCardProps) {
  return (
    <div className="bg-[#fcf8ec] rounded-xl p-5 mb-6 border border-[#eaddb9] shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f08519] rounded-full flex items-center justify-center text-white shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1a513c] leading-tight">
              {title}
            </h3>
            <div className="text-sm text-gray-700 font-semibold mt-1 flex items-center gap-2">
              <span>{category}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <button className="text-[#f08519] hover:bg-[#eaddb9] p-1 rounded transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Image if exists */}
      {imageSrc && (
        <div className="w-full h-[300px] sm:h-[400px] relative rounded-lg overflow-hidden mb-4">
          {/* We use standard img for simplicity here to avoid next/image domain config needs, but normally we'd use next/image */}
          <img 
            src="news1.png" 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-gray-800 text-base mb-4 font-medium leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="px-4 py-1 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 bg-[#f4ece1]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-[#f08519] hover:bg-[#d97715] text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors">
          <ArrowBigUp className="w-5 h-5 fill-white" />
          <span>Dukung • {upvotes}</span>
          <ArrowBigUp className="w-5 h-5 fill-white rotate-180" />
        </button>
        
        <button className="flex items-center gap-2 bg-[#f08519] hover:bg-[#d97715] text-white px-4 py-1.5 rounded-full font-bold text-sm transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span>{comments}</span>
        </button>
        
        <button className="p-1.5 border-2 border-[#f08519] text-[#f08519] rounded-full hover:bg-[#f08519] hover:text-white transition-colors">
          <Repeat2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
