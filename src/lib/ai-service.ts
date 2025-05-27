import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export interface GenerationRequest {
  prompt: string
  context?: string
  settings: {
    tone: string
    language: string
    format: string
    length: string
    expertise: string
    responseLength: number
  }
}

export interface GenerationResponse {
  text: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  metadata: {
    generationTime: number
    model: string
  }
}

const getSystemPrompt = (settings: GenerationRequest['settings']) => {
  const toneMap = {
    professional: "Répondez de manière professionnelle et formelle",
    friendly: "Répondez de manière amicale et décontractée",
    formal: "Répondez de manière très formelle et académique",
    casual: "Répondez de manière décontractée et conversationnelle"
  }

  const formatMap = {
    structured: "Structurez votre réponse avec des points clairs et des sous-sections",
    conversational: "Répondez de manière conversationnelle et engageante",
    "step-by-step": "Présentez votre réponse étape par étape",
    technical: "Utilisez un langage technique précis avec des termes spécialisés"
  }

  const expertiseMap = {
    beginner: "Utilisez un langage simple et expliquez les concepts de base",
    intermediate: "Utilisez un langage technique modéré avec quelques explications",
    technical: "Utilisez un langage technique avancé",
    expert: "Utilisez un langage technique très avancé sans explications de base"
  }

  return `Vous êtes un assistant IA expert. ${toneMap[settings.tone]}. ${formatMap[settings.format]}. ${expertiseMap[settings.expertise]}. Répondez en ${settings.language === 'fr' ? 'français' : settings.language === 'en' ? 'anglais' : 'espagnol'}.`
}

export async function generateResponse(request: GenerationRequest): Promise<GenerationResponse> {
  const startTime = Date.now()

  try {
    const systemPrompt = getSystemPrompt(request.settings)
    const userPrompt = request.context 
      ? `${request.prompt}\n\nContexte supplémentaire: ${request.context}`
      : request.prompt

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: Math.floor(request.settings.responseLength * 4), // Approximation: 1% = ~4 tokens
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    })

    const endTime = Date.now()

    return {
      text: completion.choices[0].message.content || "Désolé, je n'ai pas pu générer une réponse.",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      },
      metadata: {
        generationTime: endTime - startTime,
        model: completion.model
      }
    }
  } catch (error) {
    console.error('Erreur lors de la génération:', error)
    throw new Error('Erreur lors de la génération de la réponse. Veuillez réessayer.')
  }
}

// Cache pour stocker les réponses récentes
const responseCache = new Map<string, GenerationResponse>()

export async function generateResponseWithCache(request: GenerationRequest): Promise<GenerationResponse> {
  const cacheKey = JSON.stringify(request)
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!
  }

  const response = await generateResponse(request)
  responseCache.set(cacheKey, response)

  // Limiter la taille du cache à 100 entrées
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value
    responseCache.delete(firstKey)
  }

  return response
} 