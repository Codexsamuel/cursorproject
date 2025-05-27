"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MessageSquare, Globe, FileText, Ruler, GraduationCap } from "lucide-react"

interface ResponseSettings {
  tone: string
  language: string
  format: string
  length: string
  expertise: string
  responseLength: number
}

interface SettingsProps {
  settings: ResponseSettings
  onSettingsChange: (settings: ResponseSettings) => void
}

export const SettingsGeneration = ({ settings, onSettingsChange }: SettingsProps) => {
  const handleLengthChange = (value: number[]) => {
    onSettingsChange({ ...settings, responseLength: value[0] })
  }

  return (
    <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
      {/* Tone Select */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Ton</span>
        </div>
        <Select value={settings.tone} onValueChange={(value: string) => onSettingsChange({ ...settings, tone: value })}>
          <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professionnel</SelectItem>
            <SelectItem value="friendly">Amical</SelectItem>
            <SelectItem value="formal">Formel</SelectItem>
            <SelectItem value="casual">Décontracté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language Select */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Langue</span>
        </div>
        <Select value={settings.language} onValueChange={(value: string) => onSettingsChange({ ...settings, language: value })}>
          <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Format Select */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Format</span>
        </div>
        <Select value={settings.format} onValueChange={(value: string) => onSettingsChange({ ...settings, format: value })}>
          <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="structured">Structuré</SelectItem>
            <SelectItem value="conversational">Conversationnel</SelectItem>
            <SelectItem value="step-by-step">Étape par étape</SelectItem>
            <SelectItem value="technical">Technique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-zinc-500" />
            <span className="text-sm text-zinc-500">Longueur de la réponse</span>
          </div>
          <span className="text-sm text-zinc-900 dark:text-zinc-100">{settings.responseLength}%</span>
        </div>
        <Slider
          value={[settings.responseLength]}
          onValueChange={handleLengthChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Expertise Select */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Niveau technique</span>
        </div>
        <Select value={settings.expertise} onValueChange={(value: string) => onSettingsChange({ ...settings, expertise: value })}>
          <SelectTrigger className="w-[140px] h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="technical">Technique</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 