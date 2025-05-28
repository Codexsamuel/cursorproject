import { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, Users, Lightbulb, Globe, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À propos - Dave & Luce Solutions',
  description: 'Découvrez DL Solutions, votre partenaire pour la transformation numérique en Afrique.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de DL Solutions
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Votre partenaire pour la transformation numérique en Afrique
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Entreprise</h2>
              <p className="text-gray-600 mb-6">
                <strong>DL Solutions SARL</strong> est une entreprise camerounaise basée à <strong>Yaoundé – École de Police</strong>, 
                spécialisée dans la <strong>communication digitale</strong>, le <strong>CRM intelligent</strong>, 
                la <strong>production audiovisuelle</strong>, et la <strong>relation client assistée par IA</strong>.
              </p>
              <p className="text-gray-600">
                Nous accompagnons les entreprises africaines dans leur transformation numérique à travers une combinaison 
                unique de technologie, design et stratégie opérationnelle.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/about/office-placeholder.svg"
                alt="DL Solutions Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Notre Vision</h2>
            <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-lg">
              <p className="text-xl text-blue-800 font-medium">
                Créer un <strong>écosystème digital souverain</strong> pour les entreprises africaines, 
                en alliant <strong>IA</strong>, <strong>créativité humaine</strong>, <strong>automation</strong> 
                et <strong>expérience client sur mesure</strong>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation Africaine</h3>
              <p className="text-gray-600">
                Développer des solutions adaptées aux besoins spécifiques des entreprises africaines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence Créative</h3>
              <p className="text-gray-600">
                Allier technologie et créativité pour des solutions uniques et impactantes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Confiance & Qualité</h3>
              <p className="text-gray-600">
                Garantir des services de haute qualité et une relation client durable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Direction Générale & Leadership</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Samuel OBAM */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="https://res.cloudinary.com/dko5sommz/image/upload/v1748393856/samuel_wpcqmb.png"
                  alt="Samuel OBAM"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Samuel OBAM</h3>
                <p className="text-blue-600 font-semibold mb-4">Fondateur & Directeur des Opérations</p>
                <p className="text-gray-600 mb-4">
                  Stratège digital, responsable du développement des partenariats et du pilotage des projets techniques 
                  (NovaCore, NovaWorld, DL Style, etc.). Il supervise la mise en œuvre des solutions IA, CRM et des 
                  produits SaaS de nouvelle génération.
                </p>
                <div className="space-y-2">
                  <a href="tel:+237694341586" className="flex items-center text-gray-600 hover:text-blue-600">
                    <Phone className="w-5 h-5 mr-2" />
                    +237 694 34 15 86 / +237 620 21 62 17
                  </a>
                  <a href="mailto:sobaml@daveandlucesolutions.com" className="flex items-center text-gray-600 hover:text-blue-600">
                    <Mail className="w-5 h-5 mr-2" />
                    sobaml@daveandlucesolutions.com
                  </a>
                </div>
              </div>
            </div>

            {/* Ngah Sabine */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="https://res.cloudinary.com/dko5sommz/image/upload/v1748393838/Lucie_lexs2m.jpg"
                  alt="Ngah Sabine"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Ngah Sabine</h3>
                <p className="text-blue-600 font-semibold mb-4">Co-Fondatrice & Directrice Artistique</p>
                <p className="text-gray-600 mb-4">
                  Responsable de l'identité visuelle, de la production photo/vidéo et des contenus créatifs diffusés 
                  sur les réseaux sociaux. Elle coordonne les shootings professionnels, le design graphique, et la 
                  création des bannières, reels, et visuels clients. Sabine incarne l'élégance de la marque et le 
                  soin du détail dans chaque projet livré.
                </p>
                <div className="space-y-2">
                  <a href="mailto:sabinelucie@daveandlucesolutions.com" className="flex items-center text-gray-600 hover:text-blue-600">
                    <Mail className="w-5 h-5 mr-2" />
                    sabinelucie@daveandlucesolutions.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Notre Équipe</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Designers & Motion Graphistes</h3>
              <p className="text-gray-600">
                Experts en création visuelle et animation pour des contenus impactants.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Développeurs</h3>
              <p className="text-gray-600">
                Spécialistes Next.js, Supabase, Stripe pour des solutions web innovantes.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Agents CX</h3>
              <p className="text-gray-600">
                Formés à la relation client omnicanale pour une expérience optimale.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Techniciens Audiovisuels</h3>
              <p className="text-gray-600">
                Experts en drones, caméras et montage pour des productions de qualité.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 