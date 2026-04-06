/**
 * newsStore.js — Store de noticias (Zustand).
 *
 * Responsabilidades:
 *   - Top 3 noticias seleccionadas por el Agente 1
 *   - Noticia seleccionada por el usuario
 *   - Estado de carga y errores del paso 1
 */

import { create } from 'zustand'

const useNewsStore = create((set, get) => ({
  // ─── Estado ───────────────────────────────────────────────────────────────

  /**
   * Las 3 noticias curadas por el Agente 1.
   * @type {import('@/services/storageService').NewsBankItem[] & {
   *   rank: number,
   *   origin: 'peru' | 'internacional',
   *   priority: 'alta' | 'media',
   *   summary: string,
   *   key_data: string,
   *   finlat_relevance: string
   * }[]}
   */
  topNews: [],

  /** ID de la noticia que el usuario seleccionó para redactar */
  selectedNewsId: null,

  /** true si el Agente 1 amplió la ventana de 48h a 72h */
  windowExpanded: false,

  /** Estado de carga de la búsqueda de noticias */
  isLoadingNews: false,

  /** @type {string | null} */
  newsError: null,

  // ─── Acciones ─────────────────────────────────────────────────────────────

  /** @param {object[]} news */
  setTopNews: (news) => set({ topNews: news, newsError: null }),

  /** @param {boolean} expanded */
  setWindowExpanded: (expanded) => set({ windowExpanded: expanded }),

  /** @param {string} id */
  selectNews: (id) => set({ selectedNewsId: id }),

  clearSelectedNews: () => set({ selectedNewsId: null }),

  /** @param {boolean} loading */
  setLoadingNews: (loading) => set({ isLoadingNews: loading }),

  /** @param {string | null} error */
  setNewsError: (error) => set({ newsError: error, isLoadingNews: false }),

  clearTopNews: () => set({ topNews: [], selectedNewsId: null, newsError: null, windowExpanded: false }),

  // ─── Selectores ───────────────────────────────────────────────────────────

  /**
   * Devuelve la noticia actualmente seleccionada o null.
   * @returns {object | null}
   */
  getSelectedNews: () => {
    const { topNews, selectedNewsId } = get()
    return topNews.find(n => n.id === selectedNewsId) ?? null
  },
}))

export default useNewsStore
