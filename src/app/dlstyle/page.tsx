import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DL Style - Boutique en ligne',
  description: 'Découvrez notre collection exclusive de vêtements et accessoires DL Style',
};

export default function DLStylePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              DL Style
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Votre style, notre passion
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              Découvrir la collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Catégories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category Cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Vêtements</h3>
                <p className="text-gray-600 mb-4">Découvrez notre collection de vêtements tendance</p>
                <a href="/dlstyle/vetements" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir la collection →
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Accessoires</h3>
                <p className="text-gray-600 mb-4">Complétez votre style avec nos accessoires</p>
                <a href="/dlstyle/accessoires" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir la collection →
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Nouveautés</h3>
                <p className="text-gray-600 mb-4">Les dernières tendances de la saison</p>
                <a href="/dlstyle/nouveautes" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir la collection →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Produits en Vedette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Cards will be added here */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Produit 1</h3>
                <p className="text-gray-600 mb-2">Description du produit</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">€XX.XX</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
            {/* Repeat product cards as needed */}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="text-gray-600 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos dernières offres et nouveautés
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
} 