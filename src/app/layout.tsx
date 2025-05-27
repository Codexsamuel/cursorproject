import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import MainLayout from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'DL Solutions - Écosystème Digital Africain',
  description: 'Plateforme modulaire et intelligente pour la transformation digitale en Afrique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${inter.variable} font-sans`}>
          <CartProvider>
            <MainLayout>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                }}
              />
              {children}
            </MainLayout>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
} 