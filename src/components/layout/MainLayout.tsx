import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation principale */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary">DL Solutions</span>
              </Link>

              {/* Navigation principale */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/novacore" className="nav-link">
                  NovaCore
                </Link>
                <Link href="/novaworld" className="nav-link">
                  NovaWorld
                </Link>
                <Link href="/dl-style" className="nav-link">
                  DL Style
                </Link>
                <Link href="/dl-travel" className="nav-link">
                  DL Travel
                </Link>
              </div>
            </div>

            {/* Menu utilisateur */}
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/novacore" className="text-base text-gray-500 hover:text-gray-900">NovaCore</Link></li>
                <li><Link href="/novaworld" className="text-base text-gray-500 hover:text-gray-900">NovaWorld</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Services</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/dl-style" className="text-base text-gray-500 hover:text-gray-900">DL Style</Link></li>
                <li><Link href="/dl-travel" className="text-base text-gray-500 hover:text-gray-900">DL Travel</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                <li><Link href="/faq" className="text-base text-gray-500 hover:text-gray-900">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Légal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">&copy; 2024 DL Solutions. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 