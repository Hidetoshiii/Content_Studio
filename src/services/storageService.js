/**
 * storageService.js — CRUD sobre Supabase (news_bank + post_history).
 *
 * Todas las funciones son async. El cliente Supabase se importa desde
 * @/lib/supabaseClient (instancia única con la clave anon pública).
 *
 * Tablas requeridas en Supabase:
 *
 *   create table news_bank (
 *     id               text primary key,
 *     title            text not null,
 *     source           text,
 *     url              text,
 *     date             text,
 *     future_potential text,
 *     created_at       timestamptz default now()
 *   );
 *
 *   create table post_history (
 *     id             text primary key,
 *     news_title     text,
 *     format         text,
 *     length_tier    text,
 *     full_post      text,
 *     angle          text,
 *     topics_covered text[],
 *     date           text,
 *     created_at     timestamptz default now()
 *   );
 *
 *   -- RLS: solo usuarios autenticados
 *   alter table news_bank    enable row level security;
 *   alter table post_history enable row level security;
 *   create policy "auth_only" on news_bank    for all using (auth.role() = 'authenticated');
 *   create policy "auth_only" on post_history for all using (auth.role() = 'authenticated');
 */

import { supabase } from '@/lib/supabaseClient'

// ─── Banco de Noticias ────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string, title: string, source: string, url: string,
 *   date: string, future_potential: string
 * }} NewsBankItem
 */

/** @returns {Promise<NewsBankItem[]>} */
export async function getNewsBank() {
  const { data, error } = await supabase
    .from('news_bank')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[storageService] getNewsBank error:', error.message)
    return []
  }
  return data ?? []
}

/**
 * Reemplaza el banco de noticias completo.
 * @param {NewsBankItem[]} items
 */
export async function saveNewsBank(items) {
  const { error: delErr } = await supabase.from('news_bank').delete().neq('id', '__none__')
  if (delErr) console.warn('[storageService] saveNewsBank delete error:', delErr.message)

  if (items.length === 0) return true

  const { error } = await supabase.from('news_bank').insert(items)
  if (error) {
    console.warn('[storageService] saveNewsBank insert error:', error.message)
    return false
  }
  return true
}

/**
 * Agrega ítems nuevos al banco, sin duplicar por URL.
 * @param {NewsBankItem[]} newItems
 */
export async function appendToNewsBank(newItems) {
  if (!newItems?.length) return true

  // Obtener URLs existentes para deduplicar
  const { data: existing } = await supabase.from('news_bank').select('url')
  const existingUrls = new Set((existing ?? []).map(r => r.url))
  const deduplicated = newItems.filter(i => !existingUrls.has(i.url))

  if (deduplicated.length === 0) return true

  const { error } = await supabase.from('news_bank').insert(deduplicated)
  if (error) {
    console.warn('[storageService] appendToNewsBank error:', error.message)
    return false
  }
  return true
}

/**
 * Elimina un ítem del banco por id.
 * @param {string} id
 */
export async function removeFromNewsBank(id) {
  const { error } = await supabase.from('news_bank').delete().eq('id', id)
  if (error) console.warn('[storageService] removeFromNewsBank error:', error.message)
  return !error
}

export async function clearNewsBank() {
  const { error } = await supabase.from('news_bank').delete().neq('id', '__none__')
  if (error) console.warn('[storageService] clearNewsBank error:', error.message)
}

// ─── Historial de Posts ───────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string, newsTitle: string, format: string, length_tier: string,
 *   full_post: string, angle: string, topics_covered: string[], date: string
 * }} PostHistoryItem
 */

/** Mapea fila de Supabase (snake_case) → objeto JS (camelCase donde aplica) */
function rowToPost(row) {
  return {
    id:             row.id,
    newsTitle:      row.news_title,
    format:         row.format,
    length_tier:    row.length_tier,
    full_post:      row.full_post,
    angle:          row.angle,
    topics_covered: row.topics_covered ?? [],
    date:           row.date,
  }
}

/** @returns {Promise<PostHistoryItem[]>} */
export async function getPostHistory() {
  const { data, error } = await supabase
    .from('post_history')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[storageService] getPostHistory error:', error.message)
    return []
  }
  return (data ?? []).map(rowToPost)
}

/**
 * Agrega un post al historial.
 * @param {PostHistoryItem} post
 */
export async function addToPostHistory(post) {
  const { error } = await supabase.from('post_history').insert({
    id:             post.id,
    news_title:     post.newsTitle,
    format:         post.format,
    length_tier:    post.length_tier,
    full_post:      post.full_post,
    angle:          post.angle,
    topics_covered: post.topics_covered ?? [],
    date:           post.date,
  })
  if (error) {
    console.warn('[storageService] addToPostHistory error:', error.message)
    return false
  }
  return true
}

export async function clearPostHistory() {
  const { error } = await supabase.from('post_history').delete().neq('id', '__none__')
  if (error) console.warn('[storageService] clearPostHistory error:', error.message)
}

/**
 * Devuelve los últimos N posts en el formato que esperan los agentes de IA.
 * Esta función opera sobre datos ya en memoria (postHistory del hook),
 * así que se mantiene sincrónica — no hace llamada extra a Supabase.
 *
 * @param {PostHistoryItem[]} postHistory - Array ya cargado en el hook
 * @param {number} limit
 */
export function mapHistoryForAgents(postHistory, limit = 7) {
  return postHistory.slice(0, limit).map(p => ({
    fecha:                p.date,
    titular_noticia_base: p.newsTitle,
    formato_usado:        p.format,
    angulo:               p.angle,
    temas_cubiertos:      p.topics_covered ?? [],
  }))
}
