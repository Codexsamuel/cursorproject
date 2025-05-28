'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function ConsentBanner() {
  const [showConsent, setShowConsent] = useState(true);
  const [showScrollingMessage, setShowScrollingMessage] = useState(true);

  useEffect(() => {
    const consentAccepted = localStorage.getItem('cookieConsent');
    if (consentAccepted === 'true') {
      setShowConsent(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  return (
    <>
      {/* Message défilant */}
      {showScrollingMessage && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-2 z-50">
          <div className="animate-marquee whitespace-nowrap">
            En utilisant ce site, vous acceptez notre politique de confidentialité et l'utilisation de cookies pour améliorer votre expérience.
            Pour plus d'informations, consultez notre politique de confidentialité.
          </div>
        </div>
      )}

      {/* Bannière de consentement */}
      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cookie className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site.
                  En continuant à naviguer, vous acceptez notre utilisation des cookies.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConsent(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleAccept}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 