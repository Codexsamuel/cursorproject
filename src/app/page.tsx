import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Globe, ShoppingBag, Plane, Shield, Trophy, Database } from 'lucide-react'

// Hero Section Component
const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/50 to-black/50" />
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          DL Solutions
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Votre partenaire digital pour tous vos besoins professionnels
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/novacore"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            Découvrir NovaCore
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/contact"
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Services Grid Component
const ServicesGrid = () => {
  const services = [
    {
      title: "NovaCore",
      description: "Plateforme IA SaaS avec CRM et DevStudio",
      icon: <Sparkles className="w-8 h-8" />,
      href: "/novacore",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "NovaWorld",
      description: "Réseau social professionnel B2B",
      icon: <Users className="w-8 h-8" />,
      href: "/novaworld",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "DL Style",
      description: "Boutique e-commerce haut de gamme",
      icon: <ShoppingBag className="w-8 h-8" />,
      href: "/dl-style",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "DL Travel",
      description: "Agence de billetterie connectée",
      icon: <Plane className="w-8 h-8" />,
      href: "/dl-travel",
      color: "from-green-500 to-green-600"
    },
    {
      title: "DL Insurance",
      description: "Solutions d'assurance digitalisées",
      icon: <Shield className="w-8 h-8" />,
      href: "/dl-insurance",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "DL Bookmaker",
      description: "Paris sportifs intelligents",
      icon: <Trophy className="w-8 h-8" />,
      href: "/dl-bookmaker",
      color: "from-red-500 to-red-600"
    },
    {
      title: "DL ERP",
      description: "Système interne centralisé",
      icon: <Database className="w-8 h-8" />,
      href: "/erp",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Nos Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link 
              key={index}
              href={service.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`mb-4 inline-block rounded-lg bg-gradient-to-br ${service.color} p-3 text-white`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section Component
const ContactSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Contactez-nous</h2>
          <p className="text-gray-600 mb-8">
            Vous avez des questions ? Notre équipe est là pour vous aider.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Nous contacter
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ServicesGrid />
      <ContactSection />
    </main>
  )
} 