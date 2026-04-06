/**
 * newsService.js — Obtiene noticias financieras para el Agente 1.
 *
 * Estrategia:
 *   1. RSS feeds via allorigins.win  — CORS-enabled, sin API key, sin rate limits,
 *                                      sin proxy Vite (funciona en cualquier entorno)
 *   2. NewsAPI                       — complementa si hay key disponible
 *
 * allorigins.win es un CORS proxy público que sirve el contenido raw de
 * cualquier URL con header `Access-Control-Allow-Origin: *`.
 * URL: https://api.allorigins.win/raw?url=<encoded_url>
 */

import axios from 'axios'
import { NEWS_KEYWORDS, NEWSAPI_CONFIG, NEWS_WINDOW_HOURS } from '@/config/constants'

// ─── Feeds RSS ────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/mundo/economia/rss.xml',  name: 'BBC Mundo'    },
  { url: 'https://feeds.bbci.co.uk/mundo/rss.xml',           name: 'BBC Mundo'    },
  { url: 'https://rpp.pe/economia/feed/',                     name: 'RPP Noticias' },
  { url: 'https://gestion.pe/feed/',                         name: 'Gestión'      },
  { url: 'https://www.infobae.com/feeds/rss/economia/',      name: 'Infobae'      },
]

// ─── Tipo interno ─────────────────────────────────────────────────────────────
/**
 * @typedef {{ title: string, source: string, url: string, published_at: string, description: string }} RawArticle
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateFrom(hours = NEWS_WINDOW_HOURS) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

/**
 * Parsea XML de RSS con DOMParser nativo del browser.
 * @param {string} xmlString
 * @param {string} sourceName
 * @returns {RawArticle[]}
 */
function parseRssXml(xmlString, sourceName) {
  try {
    const parser = new DOMParser()
    const doc    = parser.parseFromString(xmlString, 'text/xml')

    if (doc.querySelector('parsererror')) return []

    return Array.from(doc.querySelectorAll('item')).map(item => {
      const getText = (sel) =>
        (item.querySelector(sel)?.textContent ?? '').replace(/<[^>]*>/g, '').trim()

      // El link en RSS a veces está como texto, a veces como atributo href
      const linkEl  = item.querySelector('link')
      const linkUrl = linkEl?.textContent?.trim() ||
                      linkEl?.nextSibling?.textContent?.trim() ||
                      item.querySelector('guid')?.textContent?.trim() || ''

      return {
        title:        getText('title'),
        source:       sourceName,
        url:          linkUrl,
        published_at: getText('pubDate') || new Date().toISOString(),
        description:  getText('description') || getText('summary') || '',
      }
    })
  } catch {
    return []
  }
}

function filterValid(articles) {
  return articles.filter(a =>
    typeof a.title === 'string' && a.title.trim().length > 5 &&
    typeof a.url   === 'string' && a.url.startsWith('http'),
  )
}

// ─── Fuente 1: RSS via allorigins.win (sin proxy Vite) ───────────────────────

/**
 * Descarga cada feed RSS a través de allorigins.win.
 * allorigins permite llamadas directas desde el browser (CORS: *).
 * Sin API key, sin rate limits diarios, sin reinicio de Vite.
 */
async function fetchFromRss() {
  const ALLORIGINS = 'https://api.codetabs.com/v1/proxy?quest='

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const response = await axios.get(
          `${ALLORIGINS}${encodeURIComponent(feed.url)}`,
          {
            timeout:     10000,
            responseType: 'text',
          },
        )

        // allorigins devuelve el contenido raw — debe ser XML
        if (typeof response.data !== 'string' || !response.data.includes('<')) {
          console.warn(`[newsService] ${feed.name}: respuesta inesperada`)
          return []
        }

        const articles = parseRssXml(response.data, feed.name)
        if (articles.length > 0) {
          console.info(`[newsService] ${feed.name}: ${articles.length} artículos`)
        }
        return articles

      } catch (err) {
        console.warn(`[newsService] ${feed.name} falló:`, err.message)
        return []
      }
    }),
  )

  const all = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  return filterValid(all)
}

// ─── Fuente 2: NewsAPI (via proxy Vite /newsapi) ──────────────────────────────

async function fetchFromNewsApi(apiKey) {
  const query  = NEWS_KEYWORDS.slice(0, 5).join(' OR ')
  const params = {
    q:        query,
    from:     getDateFrom(NEWS_WINDOW_HOURS),
    sortBy:   NEWSAPI_CONFIG.SORT_BY,
    pageSize: NEWSAPI_CONFIG.PAGE_SIZE,
    language: 'es',
    apiKey,
  }

  const res = await axios.get('/newsapi/v2/everything', { params, timeout: 10000 })

  if (res.data?.status !== 'ok') {
    throw new Error(`NewsAPI: ${res.data?.message ?? 'error desconocido'}`)
  }

  const normalize = (a) => ({
    title:        a.title             ?? '',
    source:       a.source?.name      ?? 'NewsAPI',
    url:          a.url               ?? '',
    published_at: a.publishedAt        ?? new Date().toISOString(),
    description:  a.description       ?? '',
  })

  const es = (res.data.articles ?? []).map(normalize)

  let en = []
  try {
    const resEn = await axios.get('/newsapi/v2/everything', {
      params:  { ...params, language: 'en', q: NEWS_KEYWORDS.slice(5).join(' OR ') },
      timeout: 10000,
    })
    en = (resEn.data?.articles ?? []).map(normalize)
  } catch { /* opcional */ }

  return filterValid([...es, ...en])
}

// ─── Función principal exportada ─────────────────────────────────────────────

/**
 * fetchNews — Obtiene artículos crudos para el Agente 1.
 *
 * 1. Siempre intenta RSS (allorigins, sin proxy, sin key)
 * 2. Si hay NewsAPI key Y los RSS dieron pocos resultados, complementa
 *
 * @param {string} [newsApiKey]
 * @returns {Promise<RawArticle[]>}
 */
export async function fetchNews(newsApiKey) {
  const articles = []

  // ── RSS (siempre) ────────────────────────────────────────────────────────
  try {
    const rss = await fetchFromRss()
    articles.push(...rss)
    console.info(`[newsService] RSS total: ${rss.length} artículos`)
  } catch (err) {
    console.warn('[newsService] Error en RSS:', err.message)
  }

  // ── NewsAPI (si hay key y RSS fue insuficiente) ──────────────────────────
  if (newsApiKey && articles.length < 8) {
    try {
      const api = await fetchFromNewsApi(newsApiKey)
      const seen = new Set(articles.map(a => a.url))
      const fresh = api.filter(a => !seen.has(a.url))
      articles.push(...fresh)
      console.info(`[newsService] NewsAPI añadió: ${fresh.length} artículos`)
    } catch (err) {
      console.warn('[newsService] NewsAPI falló:', err.message)
    }
  }

  if (articles.length === 0) {
    throw new Error(
      'No se pudieron obtener noticias. Revisa tu conexión a internet e intenta nuevamente.',
    )
  }

  console.info(`[newsService] Total para Agente 1: ${articles.length} artículos`)
  return articles
}
