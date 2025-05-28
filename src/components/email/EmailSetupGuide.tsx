import { EMAIL_CONFIG } from '@/lib/config/email';

export default function EmailSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Email Setup Guide</h2>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">IMAP Settings</h3>
          <div className="space-y-2">
            <p><strong>Server:</strong> {EMAIL_CONFIG.imap.host}</p>
            <p><strong>Port:</strong> {EMAIL_CONFIG.imap.port}</p>
            <p><strong>Security:</strong> SSL/TLS</p>
            <p><strong>Username:</strong> {EMAIL_CONFIG.primary.address}</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">SMTP Settings</h3>
          <div className="space-y-2">
            <p><strong>Server:</strong> {EMAIL_CONFIG.smtp.host}</p>
            <p><strong>Port:</strong> {EMAIL_CONFIG.smtp.port}</p>
            <p><strong>Security:</strong> SSL/TLS</p>
            <p><strong>Username:</strong> {EMAIL_CONFIG.primary.address}</p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Available Email Addresses</h3>
          <div className="space-y-2">
            {Object.entries(EMAIL_CONFIG.business).map(([key, address]) => (
              <p key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {address}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open your email client (Gmail, Outlook, etc.)</li>
            <li>Add a new email account</li>
            <li>Enter your email address: {EMAIL_CONFIG.primary.address}</li>
            <li>Choose IMAP/SMTP setup</li>
            <li>Enter the IMAP and SMTP settings as shown above</li>
            <li>Enter your email password when prompted</li>
            <li>Complete the setup process</li>
          </ol>
        </section>
      </div>
    </div>
  );
} 