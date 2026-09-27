import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'banners'
  | 'homepage'
  | 'offers'
  | 'coupons'
  | 'inventory'
  | 'reviews'
  | 'faqs'
  | 'enquiries'
  | 'settings';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: { email: string; name: string; role: string } | null;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('devshree_admin_token'));
  });
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('devshree_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('devshree_admin_token');
    if (token) {
      api.verifyAdminToken()
        .then(res => {
          if (!res.valid) {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.adminLogin(email, password);
      if (res.success && res.token) {
        localStorage.setItem('devshree_admin_token', res.token);
        localStorage.setItem('devshree_admin_user', JSON.stringify(res.admin));
        setIsAuthenticated(true);
        setAdminUser(res.admin);
        return { success: true };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid admin credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('devshree_admin_token');
    localStorage.removeItem('devshree_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        activeTab,
        setActiveTab,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
