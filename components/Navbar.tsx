"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  searchPlaceholder?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  notificationCount?: number;
}

export default function Navbar({
  searchPlaceholder = "Cari bencana, donasi, atau topik...",
  buttonText = "Buat Postingan",
  onButtonClick,
  notificationCount = 0
}: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/dashboard' },
    { name: 'Peta Bencana', href: '/peta' },
    { name: 'Donasi', href: '/donasi' },
    { name: 'Eksplor Map', href: '/eksplor' },
    { name: 'Komunitas', href: '/komunitas' },
  ];

  return (
    <header className="bg-[#fcf8ec] border-b border-[#e5dfc5] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 border-b border-[#e5dfc5] pb-2 mb-2 lg:border-none lg:pb-0 lg:mb-0 lg:h-20">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <Image 
              src="/logo.png" 
              alt="ResQNet Logo" 
              width={150} 
              height={50} 
              className="h-10 lg:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl px-4 lg:px-12 w-full mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-2.5 border border-[#d6c7b0] rounded-full leading-5 bg-[#eaddb9] text-gray-900 placeholder-gray-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#f4b820] focus:border-transparent sm:text-sm font-medium transition-all"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="p-2.5 text-[#e16928] hover:bg-[#eaddb9] rounded-full transition-colors relative">
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#fcf8ec]">
                  {notificationCount}
                </span>
              )}
            </button>
            
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 text-[#e16928] hover:bg-[#eaddb9] rounded-full transition-colors border-2 border-[#e16928]"
              >
                <div className="w-7 h-7 bg-[#e16928] rounded-full flex items-center justify-center text-white shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-[#1a513c] hidden md:block max-w-[100px] truncate">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5dfc5] rounded-xl shadow-lg py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Akun Anda</p>
                    <p className="text-sm font-bold text-[#1a513c] truncate">{user?.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-[#fcf8ec] hover:text-[#1a513c] transition-colors">
                    <User className="w-4 h-4" />
                    Profil
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex justify-between items-center h-14 overflow-x-auto hide-scrollbar">
          <nav className="flex space-x-2 md:space-x-8 min-w-max pr-4">
            {navLinks.map((link) => {
              // Exact match or active sub-route logic
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href) && !pathname.includes('dashboard') && link.name !== 'Beranda');
              // Special case for dashboard mapped to '/' in UI terms
              const isDashboardActive = link.name === 'Beranda' && (pathname === '/dashboard' || pathname === '/');
              
              const isCurrent = isActive || isDashboardActive;
              
              return (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`px-3 py-2 text-sm font-bold transition-all relative
                    ${isCurrent ? 'text-[#1a513c]' : 'text-gray-600 hover:text-[#29848a]'}`
                  }
                >
                  {link.name}
                  {isCurrent && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#29848a] rounded-t-sm" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pl-4 sticky right-0 bg-gradient-to-l from-[#fcf8ec] via-[#fcf8ec] to-transparent">
             <button 
               onClick={onButtonClick}
               className="bg-[#f08519] hover:bg-[#d97715] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
             >
               {buttonText}
             </button>
          </div>
        </div>
      </div>
    </header>
  );
}
