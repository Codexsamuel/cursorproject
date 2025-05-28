import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import ConsentBanner from '@/components/common/ConsentBanner';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dave & Luce Solutions',
  description: 'Solutions technologiques innovantes pour votre entreprise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Chatbot />
          <ConsentBanner />
        </AuthProvider>
        </body>
      </html>
  );
} 