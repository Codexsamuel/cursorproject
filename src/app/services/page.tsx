import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Nos Services | DL Solutions',
  description: 'Découvrez nos services de développement web, solutions cloud, consultation IT et location d\'équipements professionnels.',
};

const services = [
  {
    id: 'web-dev',
    title: 'Développement Web',
    description: 'Création de sites web et applications sur mesure, optimisés pour la performance et l\'expérience utilisateur.',
    image: '/images/services/web-dev-placeholder.svg',
    features: [
      'Sites web responsifs',
      'Applications web modernes',
      'E-commerce',
      'Optimisation SEO',
      'Maintenance et support'
    ]
  },
  {
    id: 'cloud',
    title: 'Solutions Cloud',
    description: 'Solutions cloud sécurisées pour le stockage, le partage et la gestion de vos données.',
    image: '/images/services/cloud-placeholder.svg',
    features: [
      'Hébergement cloud',
      'Sauvegarde de données',
      'Solutions collaboratives',
      'Sécurité renforcée',
      'Support 24/7'
    ]
  },
  {
    id: 'consulting',
    title: 'Consultation IT',
    description: 'Expertise technique et conseils stratégiques pour optimiser votre infrastructure IT.',
    image: '/images/services/consulting-placeholder.svg',
    features: [
      'Audit IT',
      'Conseil stratégique',
      'Formation',
      'Support technique',
      'Gestion de projet'
    ]
  }
];

const equipment = [
  {
    id: 'cameras',
    title: 'Caméras Professionnelles',
    description: 'Location de caméras HD et 4K pour vos projets vidéo.',
    image: '/images/services/cameras-placeholder.svg',
    features: [
      'Caméras 4K',
      'Objectifs professionnels',
      'Accessoires',
      'Support technique',
      'Formation incluse'
    ]
  },
  {
    id: 'drones',
    title: 'Drones Professionnels',
    description: 'Location de drones pour la photographie aérienne et la vidéographie.',
    image: '/images/services/drones-placeholder.svg',
    features: [
      'Drones 4K',
      'Stabilisateurs',
      'Pilotes certifiés',
      'Assurance incluse',
      'Formation disponible'
    ]
  },
  {
    id: 'lighting',
    title: 'Éclairage LED',
    description: 'Solutions d\'éclairage professionnel pour vos événements et productions.',
    image: '/images/services/lighting-placeholder.svg',
    features: [
      'Kits LED complets',
      'Contrôleurs DMX',
      'Support technique',
      'Installation possible',
      'Formation incluse'
    ]
  },
  {
    id: 'audio',
    title: 'Audio Professionnel',
    description: 'Location de matériel audio de qualité pour vos événements.',
    image: '/images/services/microphones-placeholder.svg',
    features: [
      'Microphones sans fil',
      'Systèmes de sonorisation',
      'Enregistreurs',
      'Support technique',
      'Installation possible'
    ]
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Nos Services
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Des solutions technologiques complètes pour répondre à tous vos besoins
          </p>
        </div>
      </section>

      {/* Services IT */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Solutions Technologiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.id}`}
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location d'Équipement */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Location d'Équipement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/equipment/${item.id}`}
                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
} 