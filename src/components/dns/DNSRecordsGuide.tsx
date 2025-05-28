import { EMAIL_CONFIG } from '@/lib/config/email';

export default function DNSRecordsGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">DNS Records Configuration</h2>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">MX Records</h3>
          <div className="space-y-2">
            {EMAIL_CONFIG.dns.mx.map((record, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <p><strong>Priority:</strong> {record.priority}</p>
                <p><strong>Host:</strong> {record.host}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">SPF Record</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-mono text-sm break-all">{EMAIL_CONFIG.dns.spf}</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">DMARC Record</h3>
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-mono text-sm break-all">{EMAIL_CONFIG.dns.dmarc}</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Verification Steps</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your Hostinger control panel</li>
            <li>Navigate to DNS / Nameservers section</li>
            <li>Verify that all records match the ones shown above</li>
            <li>If any records are missing or different, update them accordingly</li>
            <li>Wait for DNS propagation (can take up to 48 hours)</li>
            <li>Use email verification tools to confirm setup</li>
          </ol>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>DNS changes can take up to 48 hours to propagate globally</li>
            <li>Keep your DKIM records secure and private</li>
            <li>Regularly monitor your email deliverability</li>
            <li>Update SPF records if you add new email sending services</li>
          </ul>
        </section>
      </div>
    </div>
  );
} 