import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

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
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
} 