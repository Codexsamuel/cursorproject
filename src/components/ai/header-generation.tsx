import { Bot } from "lucide-react"

export const HeaderGeneration = () => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Assistant IA</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Générez des réponses personnalisées</p>
        </div>
      </div>
    </div>
  )
} 