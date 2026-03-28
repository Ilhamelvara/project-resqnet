"use client";

import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import CreateCampaignModal from '../components/CreateCampaignModal';

interface CampaignModalContextType {
  openCampaignModal: () => void;
  closeCampaignModal: () => void;
}

const CampaignModalContext = createContext<CampaignModalContextType | undefined>(undefined);

export const CampaignModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const openCampaignModal = () => {
    if (!user || (user.role !== 'ORG' && user.role !== 'ADMIN')) {
      alert('Hanya akun Organisasi yang dapat membuat kampanye.');
      return;
    }
    setIsOpen(true);
  };

  const closeCampaignModal = () => setIsOpen(false);

  const handleCreated = () => {
    // Refresh campaign list
    window.dispatchEvent(new CustomEvent('campaign-created'));
  };

  return (
    <CampaignModalContext.Provider value={{ openCampaignModal, closeCampaignModal }}>
      {children}
      {isOpen && (
        <CreateCampaignModal 
          onClose={closeCampaignModal} 
          onCreated={handleCreated} 
        />
      )}
    </CampaignModalContext.Provider>
  );
};

export const useCampaignModal = () => {
  const context = useContext(CampaignModalContext);
  if (!context) {
    throw new Error('useCampaignModal must be used within a CampaignModalProvider');
  }
  return context;
};
