"use client"

import { MessageCircle, Sparkles } from "lucide-react"
import { SettingsGeneration } from "./settings-generation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ResponseSettings {
  tone: string
  language: string
  format: string
  length: string
  expertise: string
}

interface FormProps {
  onSubmit: (e: React.FormEvent) => void
  settings: ResponseSettings
  onSettingsChange: (settings: ResponseSettings) => void
}

export const FormGeneration = ({ onSubmit, settings, onSettingsChange }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 p-4 justify-between">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Votre question</span>
          </div>
          <Textarea
            placeholder="Décrivez votre problème ou posez votre question..."
            className="w-full min-h-[120px] bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100 resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Contexte supplémentaire (optionnel)</span>
          </div>
          <Input
            type="text"
            placeholder="Ajoutez des détails supplémentaires pour une réponse plus précise..."
            className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100"
          />
        </div>

        <SettingsGeneration settings={settings} onSettingsChange={onSettingsChange} />
      </div>

      <button
        type="submit"
        className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-medium rounded-xl transition-colors self-end"
      >
        <Sparkles className="w-4 h-4" />
        Générer la réponse
      </button>
    </form>
  )
} 