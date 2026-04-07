/**
 * newsService.js — Obtiene noticias financieras via la API Route /api/fetch-news.
 *
 * La API key de NewsData.io está en el servidor (Vercel env vars).
 *
 * El servidor siempre devuelve 200:
 *   - Con artículos → flujo normal
 *   - Con [] → sin key o NewsData.io no disponible → modo manual en la UI
 */

/**
 * fetchNews — Solicita artículos crudos al servidor.
 *
 * @returns {Promise<{ articles: object[], manualMode: boolean }>}
 * @throws {Error} Solo si hay un error de red real (sin conexión)
 */
export async function fetchNews() {
  let res

  try {
    res = await fetch('/api/fetch-news')
  } catch {
    throw new Error('Sin conexión. Verifica tu red e intenta nuevamente.')
  }

  if (!res.ok) {
    throw new Error('Error del servidor al obtener noticias. Intenta nuevamente.')
  }

  const articles   = await res.json()
  const manualMode = !Array.isArray(articles) || articles.length === 0

  return {
    articles:   Array.isArray(articles) ? articles : [],
    manualMode,
  }
}
