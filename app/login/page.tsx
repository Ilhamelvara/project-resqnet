"use client";

import React, { useState } from 'react';
import styles from './login.module.css';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { mapBackendError } from '../../utils/errorMapper';
import Head from 'next/head';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.toLowerCase();
      // Use the actual backend endpoint: POST /api/auth/login
      const response = await api.post('/auth/login', {
        email: normalizedEmail,
        password
      });

      // Backend returns { success, message, data: { user, tokens } }
      const { user, tokens } = response.data.data;
      
      // Save info into AuthContext & LocalStorage
      login(tokens.accessToken, user);
      
    } catch (err: any) {
      const data = err.response?.data;
      const { general, fields } = mapBackendError(data);
      
      if (Object.keys(fields).length > 0) {
        setFieldErrors(prev => ({ ...prev, ...fields }));
      }
      if (general) {
        setError(general);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Nunito font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>

      <div className={`${styles.bgImage} ${styles.fallbackBg}`}>
          <div className={styles.loginContainer}>
              <div className={styles.welcomeText}>Selamat Datang di</div>
              
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

              <div className={styles.tagline}>Perkuat Aksi Peduli Bencana Bersama Kami!</div>

              {error && <div className={styles.errorText}>{error}</div>}

              <form className={styles.loginForm} onSubmit={handleLogin}>
                  <div className="w-full flex flex-col items-center gap-1">
                    <input 
                      type="text" 
                      className={styles.inputField} 
                      placeholder="Email Anda" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                    {fieldErrors.email && <div className={styles.fieldError}>{fieldErrors.email}</div>}
                  </div>
                  
                  <div className="w-full flex flex-col items-center gap-1">
                    <input 
                      type="password" 
                      className={styles.inputField} 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    {fieldErrors.password && <div className={styles.fieldError}>{fieldErrors.password}</div>}
                  </div>

                  <button type="submit" className={styles.loginBtn} disabled={loading}>
                    {loading ? 'Memproses...' : 'Masuk'}
                  </button>
              </form>

              <div style={{marginTop: '20px', fontFamily: 'Nunito', fontWeight: 600}}>
                 Belum punya akun? <a href="/register" style={{color: '#1a513c', textDecoration: 'none'}}>Daftar di sini</a>
              </div>
          </div>
      </div>
    </>
  );
}