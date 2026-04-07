/**
 * claudeService.js — Wrapper de las API Routes de Vercel para Claude.
 *
 * Las llamadas a Anthropic ya no se hacen desde el browser.
 * Este módulo llama a las Vercel Serverless Functions (/api/*) que
 * ejecutan las llamadas con la API key segura en el servidor.
 *
 * Pipeline:
 *   1. analyzeNews   → POST /api/analyze-news   (Agente 1 — Haiku)
 *   2. generatePost  → POST /api/generate-post  (Agente 2 — Sonnet + Web Search)
 *   3. analyzeAndImprove → POST /api/analyze-improve (Agente 3 — Sonnet)
 */

// ─── Tipos de error tipados ───────────────────────────────────────────────────

export class ClaudeServiceError extends Error {
  /**
   * @param {string} type
   * @param {string} message
   * @param {unknown} [details]
   */
  constructor(type, message, details) {
    super(message)
    this.name    = 'ClaudeServiceError'
    this.type    = type
    this.details = details
  }
}

export const CLAUDE_ERROR_TYPES = {
  INVALID_API_KEY:   'INVALID_API_KEY',
  RATE_LIMIT:        'RATE_LIMIT',
  JSON_PARSE_FAILED: 'JSON_PARSE_FAILED',
  CONTENT_FILTERED:  'CONTENT_FILTERED',
  NETWORK_ERROR:     'NETWORK_ERROR',
  UNKNOWN:           'UNKNOWN',
}

// ─── Helper interno ───────────────────────────────────────────────────────────

/**
 * Llama a una API route de Vercel y mapea los errores HTTP a ClaudeServiceError.
 *
 * @param {string} path - e.g. '/api/analyze-news'
 * @param {object} body
 * @returns {Promise<object>}
 * @throws {ClaudeServiceError}
 */
async function callApiRoute(path, body) {
  let res

  try {
    res = await fetch(path, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })
  } catch {
    throw new ClaudeServiceError(
      CLAUDE_ERROR_TYPES.NETWORK_ERROR,
      'Sin conexión. Verifica tu red e intenta nuevamente.',
    )
  }

  if (res.ok) return res.json()

  // Mapeo de status HTTP → error tipado
  const errData = await res.json().catch(() => ({}))
  if (res.status === 401) {
    throw new ClaudeServiceError(
      CLAUDE_ERROR_TYPES.INVALID_API_KEY,
      'La API key de Anthropic no es válida. Contacta al administrador.',
    )
  }
  if (res.status === 429) {
    throw new ClaudeServiceError(
      CLAUDE_ERROR_TYPES.RATE_LIMIT,
      'Límite de solicitudes alcanzado. Espera unos segundos e intenta nuevamente.',
    )
  }
  if (res.status === 400) {
    throw new ClaudeServiceError(
      CLAUDE_ERROR_TYPES.CONTENT_FILTERED,
      'El contenido fue rechazado por los filtros de seguridad de Claude.',
      { error: errData.error },
    )
  }
  throw new ClaudeServiceError(
    CLAUDE_ERROR_TYPES.UNKNOWN,
    errData.error ?? 'Error desconocido al llamar al servidor.',
  )
}

// ─── Llamada 1: Curador de Noticias (Agente 1) ───────────────────────────────

/**
 * analyzeNews — Evalúa y curada las noticias crudas.
 *
 * @param {{
 *   rawArticles: object[],
 *   currentDate: string,
 *   recentHistory: object[]
 * }} params
 * @returns {Promise<{ top_news: object[], news_bank: object[], ventana_ampliada: boolean }>}
 */
export async function analyzeNews({ rawArticles, currentDate, recentHistory }) {
  return callApiRoute('/api/analyze-news', { rawArticles, currentDate, recentHistory })
}

// ─── Llamada 2: Redactor de Posts (Agente 2) ─────────────────────────────────

/**
 * generatePost — Redacta un post con contexto de búsqueda web en tiempo real.
 *
 * @param {{
 *   newsItem: object,
 *   format: string | null,
 *   lengthTier: string,
 *   recentHistory: object[]
 * }} params
 * @returns {Promise<{ sections: object[], full_post: string, hashtags: string[], editor_note: string }>}
 */
export async function generatePost({ newsItem, format, lengthTier, recentHistory }) {
  return callApiRoute('/api/generate-post', { newsItem, format, lengthTier, recentHistory })
}

// ─── Llamada 3: Analizador de Engagement (Agente 3) ──────────────────────────

/**
 * analyzeAndImprove — Evalúa el post y devuelve versión mejorada.
 *
 * @param {{
 *   postText: string,
 *   format: string,
 *   lengthTier: string,
 *   characterCount: number
 * }} params
 * @returns {Promise<object>}
 */
export async function analyzeAndImprove({ postText, format, lengthTier, characterCount }) {
  return callApiRoute('/api/analyze-improve', { postText, format, lengthTier, characterCount })
}
