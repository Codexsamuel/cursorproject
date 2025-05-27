"use client"

import { useState } from "react"
import { Preview } from "./preview-generation"
import { ErrorGeneration } from "./error-generation"
import { FormGeneration } from "./form-generation"
import { HeaderGeneration } from "./header-generation"

interface ResponseSettings {
  tone: string
  language: string
  format: string
  length: string
  expertise: string
  responseLength: number
}

export default function AIResponseGeneration() {
  const [showForm, setShowForm] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ResponseSettings>({
    tone: "professional",
    language: "fr",
    format: "structured",
    length: "medium",
    expertise: "technical",
    responseLength: 50,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setIsLoading(true)
    setError(null)

    try {
      // Simuler un délai de génération
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowForm(false)
    } catch (err) {
      setError("Échec de la génération de la réponse. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSettings = () => {
    setShowForm(true)
    setError(null)
  }

  return (
    <div className="group relative overflow-hidden w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] min-h-[600px] flex flex-col justify-between gap-2">
      <HeaderGeneration />
      <div className="flex-1 overflow-hidden flex flex-col">
        {error && <ErrorGeneration error={error} />}

        {showForm ? (
          <FormGeneration onSubmit={handleSubmit} settings={settings} onSettingsChange={setSettings} />
        ) : (
          <div className="p-4">
            <Preview
              isLoading={isLoading}
              responseText="Voici une réponse détaillée à votre question concernant la configuration du réseau..."
            />

            {!isLoading && (
              <div className="space-y-4">
                <div className="p-3 space-y-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Temps de génération</span>
                    <span className="text-zinc-900 dark:text-zinc-100">2.3s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Longueur</span>
                    <span className="text-zinc-900 dark:text-zinc-100">Moyenne</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBackToSettings}
                    className="w-full h-9 flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Retour aux paramètres
                  </button>
                  <button
                    type="button"
                    className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Copier la réponse
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 