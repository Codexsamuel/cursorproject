'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from './AuthModal';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const showAuthModal = () => setShowModal(true);
  const hideAuthModal = () => setShowModal(false);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    hideAuthModal();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        showAuthModal,
        hideAuthModal,
        login,
        logout,
      }}
    >
      {children}
      <AuthModal isOpen={showModal} onClose={hideAuthModal} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 