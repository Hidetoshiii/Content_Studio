/**
 * api/fetch-news.js — Obtiene noticias financieras desde NewsData.io
 *
 * Serverless function (Vercel / Node.js 18+).
 * Usa fetch nativo (Node.js 18+). La API key viene de NEWSDATA_API_KEY.
 *
 * Degradación elegante:
 *   - Sin key configurada  → devuelve [] (modo manual en UI)
 *   - Llamadas fallan      → devuelve [] con header X-News-Error (modo manual)
 *   - Todo ok              → devuelve hasta 20 artículos mezclados (10 Perú + 10 LATAM)
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
    console.info('[fetch-news] NEWSDATA_API_KEY no configurada — modo manual activado')
    return res.status(200).json([])
  }

  const results = []
  let newsDataError = null

  // ── Llamada 1: Noticias de Perú ──────────────────────────────────────────
  try {
    const r1 = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&country=pe&language=es&category=business&timeframe=48&size=10`,
    )
    const d1 = await r1.json()
    console.info('[fetch-news] NewsData.io Perú status:', d1.status, '| code:', d1.code ?? 'ok')

    if (d1.status === 'success') {
      results.push(...(d1.results ?? []).map(normalizeArticle))
      console.info(`[fetch-news] Perú: ${d1.results?.length ?? 0} artículos`)
    } else {
      newsDataError = d1.message ?? d1.code ?? 'Error desconocido de NewsData.io'
      console.warn('[fetch-news] NewsData.io Perú error:', newsDataError)
    }
  } catch (e) {
    newsDataError = e.message
    console.warn('[fetch-news] Perú call failed:', e.message)
  }

  // ── Llamada 2: Noticias financieras LATAM ────────────────────────────────
  try {
    const q  = encodeURIComponent('economía OR finanzas OR inversión OR mercados OR banco')
    const r2 = await fetch(
      `https://newsdata.io/api/1/news?apikey=${apiKey}&language=es&category=business&q=${q}&timeframe=48&size=10`,
    )
    const d2 = await r2.json()
    console.info('[fetch-news] NewsData.io LATAM status:', d2.status, '| code:', d2.code ?? 'ok')

    if (d2.status === 'success') {
      const seen  = new Set(results.map(a => a.url))
      const fresh = (d2.results ?? []).map(normalizeArticle).filter(a => !seen.has(a.url))
      results.push(...fresh)
      console.info(`[fetch-news] LATAM: ${fresh.length} artículos nuevos`)
    }
  } catch (e) {
    console.warn('[fetch-news] LATAM call failed:', e.message)
  }

  // Sin resultados → modo manual (no bloqueamos con 500)
  if (results.length === 0) {
    console.warn('[fetch-news] 0 artículos obtenidos — activando modo manual. Error:', newsDataError)
    return res
      .status(200)
      .setHeader('X-News-Error', newsDataError ?? 'sin_resultados')
      .json([])
  }

  const valid    = results.filter(a => a.title?.trim().length > 5 && a.url?.startsWith('http'))
  const shuffled = valid.sort(() => Math.random() - 0.5).slice(0, 20)
  console.info(`[fetch-news] Total enviado al cliente: ${shuffled.length}`)
  return res.status(200).json(shuffled)
}
