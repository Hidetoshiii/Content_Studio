/**
 * newsService.js — Obtiene noticias financieras via la API Route /api/fetch-news.
 *
 * La API key de NewsData.io ya no está en el browser.
 * La Vercel Function /api/fetch-news la lee desde process.env.NEWSDATA_API_KEY.
 *
 * Sin key configurada en el servidor → la route devuelve [] →
 * el hook activa el modo de entrada manual en la UI.
 */

/**
 * fetchNews — Solicita artículos crudos al servidor.
 *
 * @returns {Promise<{ title: string, source: string, url: string, published_at: string, description: string }[]>}
 * @throws {Error} Si la llamada falla completamente (no es el caso vacío)
 */
export async function fetchNews() {
  let res

  try {
    res = await fetch('/api/fetch-news')
  } catch {
    throw new Error('Sin conexión. Verifica tu red e intenta nuevamente.')
  }

  if (res.status === 500) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'No se pudieron obtener noticias del servidor.')
  }

  // 200 con array vacío → sin key configurada, modo manual
  const articles = await res.json()
  return Array.isArray(articles) ? articles : []
}
