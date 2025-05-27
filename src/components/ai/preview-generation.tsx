"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PreviewProps {
  isLoading: boolean
  responseText: string
}

export const Preview = ({ isLoading, responseText }: PreviewProps) => {
  const availableTexts = [
    "Analyse de votre demande...",
    "Recherche d'informations pertinentes...",
    "Formulation de la réponse..."
  ]
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(interval)
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % availableTexts.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <div className="w-full rounded-xl mb-4">
      {isLoading ? (
        <Card className="w-full border-0 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="relative w-12 h-12">
              <Loader2 className="w-full h-full animate-spin text-blue-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 rounded-full animate-spin-slow" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {availableTexts[currentTextIndex]}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Génération en cours...
              </p>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full bg-zinc-50 dark:bg-zinc-800/50">
          <CardContent className="p-4">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {responseText}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 