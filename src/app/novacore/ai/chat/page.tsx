import { auth } from "@clerk/nextjs";

export default async function AIChatPage() {
  const { userId } = auth();

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-lg shadow-sm">
      {/* En-tête du chat */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900">Assistant IA</h1>
        <p className="text-sm text-gray-500">
          Votre assistant personnel alimenté par GPT-4
        </p>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Message de l'assistant */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-sm">AI</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-900">
                Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t">
        <form className="flex space-x-4">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            className="btn-primary px-6"
          >
            Envoyer
          </button>
        </form>

        {/* Options rapides */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
            Générer un email
          </button>
          <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
            Analyser des données
          </button>
          <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">
            Rédiger une proposition
          </button>
        </div>
      </div>
    </div>
  );
} 