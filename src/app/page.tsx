"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Zap,
  Brain,
  Palette,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  CheckCircle,
  Pause,
} from "lucide-react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleVideo = () => {
    const video = document.getElementById("hero-video") as HTMLVideoElement
    if (video) {
      if (isVideoPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const services = [
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Solutions IA personnalisées pour automatiser et optimiser vos processus métier",
      features: ["Chatbots intelligents", "Analyse prédictive", "Automatisation"],
    },
    {
      icon: Users,
      title: "CRM NovaCore",
      description: "Plateforme CRM complète pour gérer vos clients et prospects efficacement",
      features: ["Gestion clients", "Pipeline ventes", "Reporting avancé"],
    },
    {
      icon: Palette,
      title: "Création Visuelle",
      description: "Designs modernes et impactants pour votre identité de marque",
      features: ["Logo & branding", "Web design", "Supports marketing"],
    },
    {
      icon: GraduationCap,
      title: "Formations Pro",
      description: "Formations spécialisées pour développer vos compétences digitales",
      features: ["IA & automation", "Marketing digital", "Outils CRM"],
    },
  ]

  const testimonials = [
    {
      name: "Marie Dubois",
      company: "TechStart SAS",
      content: "DL Solutions a transformé notre approche client avec leur CRM. +40% de conversions en 3 mois !",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Pierre Martin",
      company: "Innovate Corp",
      content: "L'IA développée par l'équipe nous fait gagner 15h/semaine. Un investissement rentabilisé rapidement.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Sophie Laurent",
      company: "Creative Agency",
      content: "Designs exceptionnels et accompagnement professionnel. Je recommande vivement !",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const stats = [
    { number: "500+", label: "Clients satisfaits" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "24/7", label: "Support disponible" },
    { number: "5 ans", label: "D'expertise" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-teal-500/20 shadow-md flex items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">DL</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                DL Solutions
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                Accueil
              </a>
              <a href="/a-propos" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                À propos
              </a>
              <a href="/services" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                Services
              </a>
              <a href="/formations" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                Formations
              </a>
              <a href="/portfolio" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                Portfolio
              </a>
              <a href="/contact" className="text-gray-800 hover:text-teal-600 transition-colors font-medium">
                Contact
              </a>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="outline" className="border-teal-500/20 hover:border-teal-500" asChild>
                <a href="/devis">Devis IA</a>
              </Button>
              <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" asChild>
                <a href="/rendez-vous">Prendre RDV</a>
              </Button>
              <Button variant="ghost" className="text-gray-800 hover:text-teal-600" asChild>
                <a href="/sign-in">Connexion 🔒</a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-6 shadow-lg">
              <nav className="flex flex-col space-y-4 px-4">
                <a href="/" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  Accueil
                </a>
                <a href="/a-propos" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  À propos
                </a>
                <a href="/services" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  Services
                </a>
                <a href="/formations" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  Formations
                </a>
                <a href="/portfolio" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  Portfolio
                </a>
                <a href="/contact" className="text-gray-800 hover:text-teal-600 transition-colors font-medium py-2">
                  Contact
                </a>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="border-teal-500/20 hover:border-teal-500" asChild>
                    <a href="/devis">Devis IA</a>
                  </Button>
                  <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700" asChild>
                    <a href="/rendez-vous">Prendre RDV</a>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video id="hero-video" autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/background-novacore.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-blue-900/30"></div>
        </div>

        {/* Video Controls */}
        <button
          onClick={toggleVideo}
          className="absolute top-24 right-6 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
        >
          {isVideoPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
        </button>

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">🚀 Innovation & Excellence</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transformez votre{" "}
                  <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    entreprise
                  </span>{" "}
                  avec l'IA
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Solutions CRM, Intelligence Artificielle, formations et créations visuelles pour propulser votre
                  business vers le succès.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                  asChild
                >
                  <a href="/devis">
                    Obtenir un devis IA
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="group" asChild>
                  <a href="#video">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Voir la démo
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-teal-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-teal-600 to-blue-600 rounded-2xl p-8 shadow-2xl">
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Découvrir DL Solutions
                  </Button>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-12 w-12 text-yellow-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Nos Services</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Solutions complètes pour votre{" "}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                croissance
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De l'intelligence artificielle aux formations spécialisées, nous accompagnons votre transformation
              digitale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-teal-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <a href="/services">
                Voir tous nos services
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Prêt à révolutionner votre business ?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Obtenez un devis personnalisé généré par notre IA en moins de 2 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100" asChild>
                <a href="/devis">
                  Générer mon devis IA
                  <Brain className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-teal-600"
                asChild
              >
                <a href="/rendez-vous">
                  <Calendar className="mr-2 h-5 w-5" />
                  Planifier un RDV
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ce que disent nos{" "}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                clients
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <a href="/avis">
                Voir tous les témoignages
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-teal-500/20 shadow-md flex items-center justify-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">DL</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">DL Solutions</span>
              </div>
              <p className="text-gray-400 mb-6">
                Votre partenaire pour la transformation digitale et l'innovation technologique.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  +237 XXX XXX XXX
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  contact@dl-solutions.fr
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  Yaoundé, Cameroun
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/services" className="hover:text-white transition-colors">
                    CRM NovaCore
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white transition-colors">
                    Intelligence Artificielle
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white transition-colors">
                    Création Visuelle
                  </a>
                </li>
                <li>
                  <a href="/formations" className="hover:text-white transition-colors">
                    Formations Pro
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Entreprise</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/a-propos" className="hover:text-white transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="/portfolio" className="hover:text-white transition-colors">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="/avis" className="hover:text-white transition-colors">
                    Témoignages
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Ressources</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/devis" className="hover:text-white transition-colors">
                    Devis IA
                  </a>
                </li>
                <li>
                  <a href="/rendez-vous" className="hover:text-white transition-colors">
                    Prendre RDV
                  </a>
                </li>
                <li>
                  <a href="/sign-in" className="hover:text-white transition-colors">
                    Connexion
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DL Solutions. Tous droits réservés. Dirigé par Dave et Luce Solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 