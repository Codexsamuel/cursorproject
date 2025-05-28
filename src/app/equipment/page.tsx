import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Location d\'Équipement | DL Solutions',
  description: 'Location d\'équipements professionnels : caméras, drones, éclairage LED et audio pour vos projets.',
};

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
    ],
    pricing: {
      daily: '50,000 FCFA',
      weekly: '300,000 FCFA',
      monthly: '1,000,000 FCFA'
    },
    availability: true
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
    ],
    pricing: {
      daily: '75,000 FCFA',
      weekly: '450,000 FCFA',
      monthly: '1,500,000 FCFA'
    },
    availability: true
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
    ],
    pricing: {
      daily: '30,000 FCFA',
      weekly: '180,000 FCFA',
      monthly: '600,000 FCFA'
    },
    availability: true
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
    ],
    pricing: {
      daily: '40,000 FCFA',
      weekly: '240,000 FCFA',
      monthly: '800,000 FCFA'
    },
    availability: true
  }
];

export default function EquipmentPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Location d'Équipement
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Des équipements professionnels de qualité pour tous vos projets
          </p>
        </div>
      </section>

      {/* Équipement Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.availability 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.availability ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  
                  {/* Caractéristiques */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Caractéristiques :</h4>
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
                  </div>

                  {/* Tarifs */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Tarifs :</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Journalier</p>
                        <p className="font-bold text-blue-600">{item.pricing.daily}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Hebdomadaire</p>
                        <p className="font-bold text-blue-600">{item.pricing.weekly}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Mensuel</p>
                        <p className="font-bold text-blue-600">{item.pricing.monthly}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton de réservation */}
                  <Link
                    href={`/equipment/${item.id}/reservation`}
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      item.availability
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.availability ? 'Réserver maintenant' : 'Indisponible'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions Fréquentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Comment réserver un équipement ?</h3>
              <p className="text-gray-600">
                Pour réserver un équipement, cliquez sur le bouton "Réserver maintenant" de l'équipement souhaité.
                Vous serez redirigé vers un formulaire de réservation où vous pourrez choisir vos dates et fournir vos informations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Quelles sont les conditions de location ?</h3>
              <p className="text-gray-600">
                Une caution est requise pour la location d'équipement. Les tarifs incluent l'assurance de base.
                Des formations sont disponibles pour certains équipements. Contactez-nous pour plus de détails.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Y a-t-il un support technique disponible ?</h3>
              <p className="text-gray-600">
                Oui, un support technique est disponible pendant toute la durée de la location.
                Nous fournissons également une formation de base pour l'utilisation des équipements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider à sélectionner l'équipement adapté à vos besoins.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </main>
  );
} 