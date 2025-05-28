import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dave & Luce Solutions</h3>
            <p className="text-gray-400 mb-4">
              Solutions technologiques innovantes pour transformer votre entreprise
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition">
                  Développement Web
                </Link>
              </li>
              <li>
                <Link href="/services/equipment" className="text-gray-400 hover:text-white transition">
                  Location de Matériel
                </Link>
              </li>
              <li>
                <Link href="/services/consulting" className="text-gray-400 hover:text-white transition">
                  Consultation IT
                </Link>
              </li>
              <li>
                <Link href="/services/cloud" className="text-gray-400 hover:text-white transition">
                  Solutions Cloud
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Conditions d'Utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-400">
                  2 rues ecole de police<br />
                  Yaounde, Cameroon
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href="tel:+237694341586" className="text-gray-400 hover:text-white transition">
                  +237 694341586
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href="mailto:info@daveandlucesolutions.com" className="text-gray-400 hover:text-white transition">
                  info@daveandlucesolutions.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dave & Luce Solutions. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 