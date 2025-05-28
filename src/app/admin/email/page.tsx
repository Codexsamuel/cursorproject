import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import EmailSetupGuide from '@/components/email/EmailSetupGuide';
import DNSRecordsGuide from '@/components/dns/DNSRecordsGuide';

export default async function EmailAdminPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin/email');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Email & DNS Management
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your email settings and DNS configuration
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Email Configuration
            </h2>
            <EmailSetupGuide />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              DNS Records
            </h2>
            <DNSRecordsGuide />
          </section>
        </div>
      </div>
    </div>
  );
} 