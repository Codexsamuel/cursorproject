import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Drone, Lightbulb, Mic, Calendar, Clock, CreditCard, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Location de Matériel - Dave & Luce Solutions',
  description: 'Location de matériel audiovisuel professionnel pour vos événements et projets.',
};

export default function EquipmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Location de Matériel Audiovisuel
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Matériel professionnel pour vos événements et projets créatifs
            </p>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipment.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <ul className="space-y-2 mb-6">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="text-blue-600 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/equipment/${item.slug}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à louer du matériel ?
          </h2>
          <p className="text-xl mb-8">
            Réservez dès maintenant votre matériel pour votre prochain événement
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}

const equipment = [
  {
    title: "Caméras UHD",
    description: "Caméras professionnelles 4K pour vos tournages",
    image: "/images/services/cameras.jpg",
    icon: <Camera className="w-6 h-6 text-blue-600" />,
    features: [
      "Résolution 4K",
      "Stabilisation",
      "Objectifs interchangeables",
      "Accessoires inclus"
    ],
    slug: "cameras"
  },
  {
    title: "Drones 4K",
    description: "Drones professionnels pour vos prises de vues aériennes",
    image: "/images/services/drones.jpg",
    icon: <Drone className="w-6 h-6 text-blue-600" />,
    features: [
      "Caméra 4K",
      "Stabilisation 3 axes",
      "Autonomie 30min",
      "Mode suivi automatique"
    ],
    slug: "drones"
  },
  {
    title: "Éclairage LED",
    description: "Kits d'éclairage professionnels pour vos tournages",
    image: "/images/services/lighting.jpg",
    icon: <Lightbulb className="w-6 h-6 text-blue-600" />,
    features: [
      "LED RGB",
      "Contrôle DMX",
      "Diffuseurs inclus",
      "Trépieds professionnels"
    ],
    slug: "lighting"
  },
  {
    title: "Microphones",
    description: "Microphones professionnels pour vos enregistrements",
    image: "/images/services/microphones.jpg",
    icon: <Mic className="w-6 h-6 text-blue-600" />,
    features: [
      "Micros cardioïdes",
      "Micros cravate",
      "Enregistreurs",
      "Accessoires inclus"
    ],
    slug: "microphones"
  }
];

const process = [
  {
    title: "Réservez",
    description: "Choisissez vos dates et votre matériel en ligne",
    icon: <Calendar className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Confirmez",
    description: "Validez votre réservation et payez en ligne",
    icon: <CreditCard className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Récupérez",
    description: "Retirez votre matériel à notre local",
    icon: <Clock className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Sécurisé",
    description: "Assurance et support technique inclus",
    icon: <Shield className="w-8 h-8 text-blue-600" />
  }
]; 