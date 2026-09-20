import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { AdminLoginModal } from './AdminLoginModal';
import { AdminDashboard } from './AdminDashboard';

interface AdminAppProps {
  onExitAdmin?: () => void;
}

const ADMIN_STORAGE_KEY = 'fibb_admin_session';

export const AdminApp: React.FC<AdminAppProps> = ({ onExitAdmin }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Session parsing error:', e);
    }
    return null;
  });

  const handleLoginSuccess = (userData: { id: string; username: string; name: string; role: string }) => {
    const admin: AdminUser = {
      ...userData,
      token: `fibb_admin_jwt_${Date.now()}`
    };
    setCurrentUser(admin);
    try {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } catch (e) {
      console.error('Session storage error:', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.error('Session storage clear error:', e);
    }
    if (onExitAdmin) {
      onExitAdmin();
    }
  };

  if (!currentUser) {
    return <AdminLoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminDashboard
      adminUser={currentUser}
      onLogout={handleLogout}
    />
  );
};
