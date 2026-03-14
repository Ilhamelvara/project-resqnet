"use client";

import React, { useState } from 'react';
import styles from '../login/login.module.css';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        role, // Optional backend support: USER, ORG, ADMIN
      });

      setSuccess("Pendaftaran berhasil! Silakan masuk.");
      // Optional: automatically redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message;
      if (errorMsg) {
        setError(errorMsg);
      } else {
        setError("Gagal mendaftar. Pastikan data valid.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div className={`${styles.bgImage} ${styles.fallbackBg}`}>
          <div className={styles.loginContainer}>
              <div className={styles.welcomeText}>Daftar Akun Baru</div>
              
              <div className={styles.logoContainer}>
                  <svg className={styles.logoIcon} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(50, 50)">
                          <path d="M 0,-40 L 34.64,-20 L 34.64,20 L 0,40 Z" fill="#F4B820"/>
                          <path d="M 0,-40 L -34.64,-20 L -20,0 L 0,-15 Z" fill="#71A850"/>
                          <path d="M -34.64,-20 L -34.64,20 L 0,40 L -20,10 Z" fill="#29848A"/>
                          <circle cx="-5" cy="-2" r="18" fill="white"/>
                          <circle cx="-5" cy="-2" r="10" fill="none" stroke="#F4B820" strokeWidth="6"/>
                          <path d="M 4,7 L 25,28" stroke="white" strokeWidth="8" strokeLinecap="round"/>
                          <path d="M 4,7 L 25,28" stroke="#E16928" strokeWidth="4" strokeLinecap="round"/>
                      </g>
                  </svg>
                  <div className={styles.logoText}>ResQNet</div>
              </div>

              <div className={styles.tagline}>Mulai Aksi Pedulimu Hari Ini</div>

              {error && <div className={styles.errorText}>{error}</div>}
              {success && <div className={styles.errorText} style={{color: '#1a513c', backgroundColor: '#e6f4ea'}}>{success}</div>}

              <form className={styles.loginForm} onSubmit={handleRegister}>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    placeholder="Nama Lengkap" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                  <input 
                    type="email" 
                    className={styles.inputField} 
                    placeholder="Email Anda" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <input 
                    type="password" 
                    className={styles.inputField} 
                    placeholder="Password (Min. 6 Karakter)" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <select 
                    className={styles.inputField} 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">Relawan Mandiri (User)</option>
                    <option value="ORG">Organisasi Bantuan (Org)</option>
                  </select>

                  <button type="submit" className={styles.loginBtn} disabled={loading || !!success}>
                    {loading ? 'Memproses...' : 'Daftar'}
                  </button>
              </form>

              <div style={{marginTop: '20px', fontFamily: 'Nunito', fontWeight: 600}}>
                 Sudah punya akun? <Link href="/login" style={{color: '#1a513c'}}>Masuk di sini</Link>
              </div>
          </div>
      </div>
    </>
  );
}
