import { auth } from "@clerk/nextjs";
import { getUserProfile } from "@/lib/supabase";

export default async function NovaCorePage() {
  const { userId } = auth();
  let userProfile = null;

  if (userId) {
    try {
      userProfile = await getUserProfile(userId);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue sur NovaCore
          {userProfile && `, ${userProfile.full_name}`}
        </h1>
        <p className="mt-2 text-gray-600">
          Votre plateforme centralisée pour la gestion client, l'assistance IA et le développement.
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">CRM</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Contacts actifs
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">0</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Assistant IA</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Conversations
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-secondary">0</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Studio Dev</h3>
          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Scripts sauvegardés
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-accent">0</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button className="btn-primary w-full py-4 flex items-center justify-center space-x-2">
          <span>Nouveau contact</span>
        </button>
        <button className="btn-secondary w-full py-4 flex items-center justify-center space-x-2">
          <span>Démarrer une conversation IA</span>
        </button>
        <button className="bg-accent text-white w-full py-4 rounded-md hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2">
          <span>Créer un script</span>
        </button>
      </div>

      {/* Activité récente */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
        </div>
      </div>
    </div>
  );
} 
 