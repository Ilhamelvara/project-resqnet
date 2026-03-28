"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import CreateReportModal from '../components/CreateReportModal';

interface ReportModalContextType {
  openModal: () => void;
  closeModal: () => void;
}

const ReportModalContext = createContext<ReportModalContextType | undefined>(undefined);

export const ReportModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const openModal = () => {
    if (!user) {
      alert('Login terlebih dahulu.');
      return;
    }
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  // Trigger a custom event when a report is created so pages can refresh
  const handleCreated = () => {
    window.dispatchEvent(new CustomEvent('report-created'));
  };

  return (
    <ReportModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <CreateReportModal 
          onClose={closeModal} 
          onCreated={handleCreated} 
        />
      )}
    </ReportModalContext.Provider>
  );
};

export const useReportModal = () => {
  const context = useContext(ReportModalContext);
  if (!context) {
    throw new Error('useReportModal must be used within a ReportModalProvider');
  }
  return context;
};
