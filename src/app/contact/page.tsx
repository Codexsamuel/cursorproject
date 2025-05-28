import Image from 'next/image';
import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | DL Solutions',
  description: 'Contactez DL Solutions pour vos projets de développement web, solutions cloud, consultation IT ou location d\'équipement.',
};

const contactInfo = [
  {
    title: 'Adresse',
    content: 'Yaoundé, Cameroun',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: 'Téléphone',
    content: '+237 XXX XXX XXX',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    title: 'Email',
    content: 'contact@dlsolutions.cm',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/dlsolutions',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    )
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/dlsolutions',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/dlsolutions',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <ContactForm />
            </div>

            {/* Carte */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Notre localisation</h2>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/images/contact/map-placeholder.svg"
                  alt="Carte de localisation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Suivez-nous sur les réseaux sociaux
          </h2>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span className="sr-only">{social.name}</span>
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions Fréquentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Quels sont vos horaires d'ouverture ?</h3>
              <p className="text-gray-600">
                Nous sommes ouverts du lundi au vendredi de 8h à 18h, et le samedi de 9h à 13h.
                Pour les urgences, notre support technique est disponible 24/7.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Comment puis-je obtenir un devis ?</h3>
              <p className="text-gray-600">
                Vous pouvez demander un devis en utilisant notre formulaire de contact ci-dessus.
                Notre équipe vous répondra dans les plus brefs délais avec un devis détaillé.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Proposez-vous des services d'urgence ?</h3>
              <p className="text-gray-600">
                Oui, nous proposons un service d'urgence pour les clients existants.
                Contactez-nous par téléphone pour toute urgence technique.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 