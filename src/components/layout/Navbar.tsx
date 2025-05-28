'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, showAuthModal, logout } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Équipement', href: '/services/equipment' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Dave & Luce Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                } transition`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Bonjour, {user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={showAuthModal}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <User className="w-5 h-5" />
                <span>Connexion</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                } block px-3 py-2 rounded-md transition`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-md transition"
              >
                Déconnexion
              </button>
            ) : (
              <button
                onClick={() => {
                  showAuthModal();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-md transition"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 