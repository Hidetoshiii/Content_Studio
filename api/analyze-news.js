/**
 * api/analyze-news.js — Agente 1: Curador de Noticias
 *
 * Serverless function (Vercel / Node.js 18+).
 * La API key de Anthropic viene de la variable de entorno ANTHROPIC_API_KEY,
 * nunca del cliente. Sin dangerouslyAllowBrowser.
 */

import Anthropic from '@anthropic-ai/sdk'
import { AGENT_1_CURATOR_PROMPT }           from '../src/config/prompts.js'
import { CLAUDE_MODELS, MAX_TOKENS, HISTORY_CONTEXT_LIMIT } from '../src/config/constants.js'
import { parseClaudeResponse }              from '../src/utils/jsonParser.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { rawArticles, currentDate, recentHistory } = req.body

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const userMessage = JSON.stringify({
      fecha_actual:         currentDate,
      noticias_encontradas: rawArticles,
      historial_reciente:   (recentHistory ?? []).slice(0, HISTORY_CONTEXT_LIMIT),
    })

    const message = await client.messages.create({
      model:      CLAUDE_MODELS.CURATOR,
      max_tokens: MAX_TOKENS.CURATOR,
      system:     AGENT_1_CURATOR_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    })

    const rawText = message.content[0]?.text ?? ''
    const result  = parseClaudeResponse(rawText)
    return res.status(200).json(result)

  } catch (err) {
    if (err?.status === 401) return res.status(401).json({ error: 'API key inválida' })
    if (err?.status === 429) return res.status(429).json({ error: 'Rate limit alcanzado' })
    if (err?.status === 400) return res.status(400).json({ error: 'Contenido rechazado por filtros' })
    console.error('[analyze-news]', err)
    return res.status(500).json({ error: err.message ?? 'Error interno del servidor' })
  }
}
