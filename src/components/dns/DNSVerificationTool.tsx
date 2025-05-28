import { useState } from 'react';
import { EMAIL_CONFIG } from '@/lib/config/email';

export default function DNSVerificationTool() {
  const [verificationStatus, setVerificationStatus] = useState<{
    mx: boolean;
    spf: boolean;
    dmarc: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const verifyDNS = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'daveandlucesolutions.com' }),
      });
      
      const data = await response.json();
      setVerificationStatus(data);
    } catch (error) {
      console.error('DNS verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">DNS Verification Tool</h3>
      
      <button
        onClick={verifyDNS}
        disabled={isLoading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify DNS Records'}
      </button>

      {verificationStatus && (
        <div className="space-y-4">
          <div className="p-4 rounded border">
            <h4 className="font-semibold mb-2">MX Records</h4>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${verificationStatus.mx ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{verificationStatus.mx ? 'Verified' : 'Not Verified'}</span>
            </div>
          </div>

          <div className="p-4 rounded border">
            <h4 className="font-semibold mb-2">SPF Record</h4>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${verificationStatus.spf ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{verificationStatus.spf ? 'Verified' : 'Not Verified'}</span>
            </div>
          </div>

          <div className="p-4 rounded border">
            <h4 className="font-semibold mb-2">DMARC Record</h4>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${verificationStatus.dmarc ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{verificationStatus.dmarc ? 'Verified' : 'Not Verified'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>This tool verifies that your DNS records are properly configured.</p>
        <p className="mt-2">Expected records:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>MX: {EMAIL_CONFIG.dns.mx.map(r => r.host).join(', ')}</li>
          <li>SPF: {EMAIL_CONFIG.dns.spf}</li>
          <li>DMARC: {EMAIL_CONFIG.dns.dmarc}</li>
        </ul>
      </div>
    </div>
  );
} 