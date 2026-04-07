/**
 * storageService.js — CRUD sobre localStorage.
 *
 * Centraliza toda la interacción con localStorage para que
 * el resto de la app nunca toque localStorage directamente.
 * Maneja errores silenciosamente para no romper la UI si
 * localStorage no está disponible (modo privado, cuota llena, etc).
 */

import { STORAGE_KEYS } from '@/config/constants'

// ─── Helpers internos ────────────────────────────────────────────────────────

/**
 * safeGet — Lee y parsea un valor de localStorage.
 * @template T
 * @param {string} key
 * @param {T} fallback - Valor por defecto si no existe o hay error
 * @returns {T}
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * safeSet — Serializa y guarda un valor en localStorage.
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean} true si se guardó correctamente
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    console.warn(`[storageService] No se pudo guardar la key "${key}" en localStorage.`)
    return false
  }
}

// ─── API Keys ────────────────────────────────────────────────────────────────

/**
 * @typedef {{ anthropic: string, newsdata: string }} ApiKeys
 */

/** @returns {ApiKeys} */
export function getApiKeys() {
  return safeGet(STORAGE_KEYS.API_KEYS, { anthropic: '', newsdata: '' })
}

/** @param {ApiKeys} keys */
export function saveApiKeys(keys) {
  return safeSet(STORAGE_KEYS.API_KEYS, keys)
}

export function clearApiKeys() {
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEYS)
  } catch { /* silent */ }
}

// ─── Banco de Noticias ───────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   source: string,
 *   url: string,
 *   date: string,
 *   future_potential: string
 * }} NewsBankItem
 */

/** @returns {NewsBankItem[]} */
export function getNewsBank() {
  return safeGet(STORAGE_KEYS.NEWS_BANK, [])
}

/**
 * Reemplaza el banco de noticias completo.
 * @param {NewsBankItem[]} items
 */
export function saveNewsBank(items) {
  return safeSet(STORAGE_KEYS.NEWS_BANK, items)
}

/**
 * Agrega ítems nuevos al banco, sin duplicar por URL.
 * @param {NewsBankItem[]} newItems
 */
export function appendToNewsBank(newItems) {
  const existing = getNewsBank()
  const existingUrls = new Set(existing.map(i => i.url))
  const deduplicated = newItems.filter(i => !existingUrls.has(i.url))
  return safeSet(STORAGE_KEYS.NEWS_BANK, [...deduplicated, ...existing])
}

/**
 * Elimina un ítem del banco por id.
 * @param {string} id
 */
export function removeFromNewsBank(id) {
  const items = getNewsBank().filter(i => i.id !== id)
  return safeSet(STORAGE_KEYS.NEWS_BANK, items)
}

export function clearNewsBank() {
  try { localStorage.removeItem(STORAGE_KEYS.NEWS_BANK) } catch { /* silent */ }
}

// ─── Historial de Posts ──────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string,
 *   date: string,
 *   newsTitle: string,
 *   format: string,
 *   length_tier: string,
 *   full_post: string,
 *   angle: string,
 *   topics_covered: string[]
 * }} PostHistoryItem
 */

/** @returns {PostHistoryItem[]} */
export function getPostHistory() {
  return safeGet(STORAGE_KEYS.POST_HISTORY, [])
}

/**
 * Agrega un post al historial. El más reciente queda primero.
 * @param {PostHistoryItem} post
 */
export function addToPostHistory(post) {
  const history = getPostHistory()
  return safeSet(STORAGE_KEYS.POST_HISTORY, [post, ...history])
}

/**
 * Devuelve los últimos N posts, solo con los campos que
 * necesitan los agentes para evitar repetición de ángulos.
 * @param {number} limit
 * @returns {{ fecha: string, titular_noticia_base: string, formato_usado: string, angulo: string, temas_cubiertos: string[] }[]}
 */
export function getRecentHistoryForAgents(limit = 7) {
  return getPostHistory()
    .slice(0, limit)
    .map(p => ({
      fecha:               p.date,
      titular_noticia_base: p.newsTitle,
      formato_usado:       p.format,
      angulo:              p.angle,
      temas_cubiertos:     p.topics_covered ?? [],
    }))
}

export function clearPostHistory() {
  try { localStorage.removeItem(STORAGE_KEYS.POST_HISTORY) } catch { /* silent */ }
}
