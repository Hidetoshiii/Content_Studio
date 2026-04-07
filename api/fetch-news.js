/**
 * api/fetch-news.js — Obtiene noticias financieras desde NewsData.io
 *
 * Serverless function (Vercel / Node.js 18+).
 * Usa fetch nativo (Node.js 18+). La API key viene de NEWSDATA_API_KEY.
 * Si no hay key configurada, devuelve [] para activar el modo manual.
 *
 * Llamada 1: Noticias de Perú (country=pe, category=business, size=50)
 * Llamada 2: Noticias LATAM   (language=es, category=business, size=20)
 * Resultado: hasta 50 artículos mezclados, deduplicados por URL.
 */

function normalizeArticle(a) {
  return {
    title:        a.title        ?? '',
    source:       a.source_name  ?? a.source_id ?? 'NewsData',
    url:          a.link         ?? '',
    published_at: a.pubDate      ?? new Date().toISOString(),
    description:  a.description  ?? (a.content?.substring(0, 400) ?? ''),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.NEWSDATA_API_KEY
  if (!apiKey) {
    // Sin key → modo manual en el frontend
    return res.status(200).json([])
  }

  const results = []

  // ── Llamada 1: Noticias de Perú ──────────────────────────────────────────
  try {
    const r1 = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&country=pe&language=es&category=business&timeframe=48&size=50`,
    )
    const d1 = await r1.json()
    if (d1.status === 'success') {
      results.push(...(d1.results ?? []).map(normalizeArticle))
      console.info(`[fetch-news] Perú: ${d1.results?.length ?? 0} artículos`)
    }
  } catch (e) {
    console.warn('[fetch-news] Perú call failed:', e.message)
  }

  // ── Llamada 2: Noticias financieras LATAM ────────────────────────────────
  try {
    const q  = encodeURIComponent('economía OR finanzas OR inversión OR mercados OR banco')
    const r2 = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&language=es&category=business&q=${q}&timeframe=48&size=20`,
    )
    const d2 = await r2.json()
    if (d2.status === 'success') {
      const seen  = new Set(results.map(a => a.url))
      const fresh = (d2.results ?? []).map(normalizeArticle).filter(a => !seen.has(a.url))
      results.push(...fresh)
      console.info(`[fetch-news] LATAM: ${fresh.length} artículos nuevos`)
    }
  } catch (e) {
    console.warn('[fetch-news] LATAM call failed:', e.message)
  }

  if (results.length === 0) {
    return res.status(500).json({ error: 'No se obtuvieron noticias de NewsData.io' })
  }

  const valid    = results.filter(a => a.title?.trim().length > 5 && a.url?.startsWith('http'))
  const shuffled = valid.sort(() => Math.random() - 0.5).slice(0, 50)
  console.info(`[fetch-news] Total enviado al cliente: ${shuffled.length}`)
  return res.status(200).json(shuffled)
}
