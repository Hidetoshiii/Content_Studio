/**
 * api/analyze-improve.js — Agente 3: Analizador de Engagement
 *
 * Serverless function (Vercel / Node.js 18+).
 * Evalúa el post, genera recomendaciones y devuelve el post mejorado.
 * Todo en una sola llamada para minimizar costos.
 */

import Anthropic from '@anthropic-ai/sdk'
import { AGENT_3_ANALYZER_PROMPT }          from '../src/config/prompts.js'
import { CLAUDE_MODELS, MAX_TOKENS }        from '../src/config/constants.js'
import { parseClaudeResponse }              from '../src/utils/jsonParser.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { postText, format, lengthTier, characterCount } = req.body

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const userMessage = JSON.stringify({
      post_actual:     postText,
      formato:         format,
      length_tier:     lengthTier,
      character_count: characterCount,
    })

    const message = await client.messages.create({
      model:      CLAUDE_MODELS.ANALYZER,
      max_tokens: MAX_TOKENS.ANALYZER,
      system:     AGENT_3_ANALYZER_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    })

    const rawText = message.content[0]?.text ?? ''
    const result  = parseClaudeResponse(rawText)
    return res.status(200).json(result)

  } catch (err) {
    if (err?.status === 401) return res.status(401).json({ error: 'API key inválida' })
    if (err?.status === 429) return res.status(429).json({ error: 'Rate limit alcanzado' })
    if (err?.status === 400) return res.status(400).json({ error: 'Contenido rechazado por filtros' })
    console.error('[analyze-improve]', err)
    return res.status(500).json({ error: err.message ?? 'Error interno del servidor' })
  }
}
