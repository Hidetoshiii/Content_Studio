/**
 * postStore.js — Store del post en construcción (Zustand).
 *
 * Responsabilidades:
 *   - Formato y longitud seleccionados (paso 2)
 *   - Post generado con secciones editables (paso 3)
 *   - Resultado del análisis de engagement (paso 4)
 *   - Post mejorado y modo diff (paso 4)
 *   - Concepto visual y prompt de imagen (paso 5)
 */

import { create } from 'zustand'

const usePostStore = create((set, get) => ({
  // ─── Estado paso 2 — Configuración ───────────────────────────────────────

  /** @type {'informativo' | 'educativo' | 'polemico' | null} */
  format: null,

  /** @type {'corto' | 'medio' | 'largo' | null} */
  lengthTier: null,

  // ─── Estado paso 3 — Post generado ───────────────────────────────────────

  /**
   * Post actual en edición.
   * @type {{
   *   sections: { label: string, content: string }[],
   *   full_post: string,
   *   hashtags: string[],
   *   selectedHashtags: string[],
   *   character_count: number,
   *   editor_note: string,
   *   format_recommendation: string | null
   * } | null}
   */
  currentPost: null,

  isGeneratingPost: false,

  /** @type {string | null} */
  generateError: null,

  // ─── Estado paso 4 — Análisis y mejoras ──────────────────────────────────

  /**
   * Resultado del Agente 3.
   * @type {{
   *   evaluation_summary: 'listo_para_publicar' | 'ajustes_menores' | 'requiere_revision',
   *   dimensions: { name: string, label: string, status: 'ok' | 'warning' | 'fail', observation: string }[],
   *   recommendations: { priority: number, impact: string, dimension: string, what: string, why: string, example: string }[],
   *   improved_post: string,
   *   post_publication_tip: string
   * } | null}
   */
  analysisResult: null,

  isAnalyzing: false,

  /** @type {string | null} */
  analyzeError: null,

  /** true cuando el usuario presiona "Aplicar Mejoras" y ve el diff */
  diffMode: false,

  // ─── Estado paso 5 — Visual y publicación ────────────────────────────────

  /** @type {string | null} Descripción del concepto visual sugerido */
  visualConcept: null,

  /** @type {string | null} Prompt listo para herramienta de IA de imágenes */
  imagePrompt: null,

  // ─── Acciones paso 2 ─────────────────────────────────────────────────────

  /** @param {'informativo' | 'educativo' | 'polemico'} format */
  setFormat: (format) => set({ format }),

  /** @param {'corto' | 'medio' | 'largo'} tier */
  setLengthTier: (tier) => set({ lengthTier: tier }),

  // ─── Acciones paso 3 ─────────────────────────────────────────────────────

  /** @param {object} post - Output del Agente 2 */
  setCurrentPost: (post) => set({
    currentPost: {
      ...post,
      selectedHashtags: post.hashtags ?? [],  // Por defecto todos seleccionados
    },
    generateError: null,
  }),

  /**
   * Actualiza el contenido de una sección específica del post.
   * Recalcula full_post concatenando todas las secciones.
   * @param {string} label - Label de la sección (ej: "Gancho")
   * @param {string} newContent
   */
  updateSection: (label, newContent) => {
    const { currentPost } = get()
    if (!currentPost) return

    const updatedSections = currentPost.sections.map(s =>
      s.label === label ? { ...s, content: newContent } : s
    )

    const newFullPost = updatedSections.map(s => s.content).join('\n\n')

    set({
      currentPost: {
        ...currentPost,
        sections: updatedSections,
        full_post: newFullPost,
        character_count: newFullPost.length,
      },
    })
  },

  /**
   * Actualiza el full_post directamente (cuando el usuario edita en textarea libre).
   * @param {string} text
   */
  updateFullPost: (text) => {
    const { currentPost } = get()
    if (!currentPost) return
    set({
      currentPost: {
        ...currentPost,
        full_post: text,
        character_count: text.length,
      },
    })
  },

  /** @param {string} tag */
  toggleHashtag: (tag) => {
    const { currentPost } = get()
    if (!currentPost) return
    const selected = currentPost.selectedHashtags
    const isSelected = selected.includes(tag)
    set({
      currentPost: {
        ...currentPost,
        selectedHashtags: isSelected
          ? selected.filter(t => t !== tag)
          : [...selected, tag],
      },
    })
  },

  setGeneratingPost: (loading) => set({ isGeneratingPost: loading }),
  setGenerateError:  (error)   => set({ generateError: error, isGeneratingPost: false }),

  // ─── Acciones paso 4 ─────────────────────────────────────────────────────

  /** @param {object} result - Output del Agente 3 */
  setAnalysisResult: (result) => set({
    analysisResult: result,
    analyzeError:   null,
    // Extrae visual concept e image prompt si vienen en el resultado
    visualConcept:  result.visual_concept  ?? null,
    imagePrompt:    result.image_prompt    ?? null,
  }),

  setAnalyzing:    (loading) => set({ isAnalyzing: loading }),
  setAnalyzeError: (error)   => set({ analyzeError: error, isAnalyzing: false }),

  /**
   * Activa la vista de diff mostrando el improved_post vs full_post original.
   * Guarda una copia del texto actual como _originalFullPost (solo la primera vez).
   */
  activateDiffMode: () => {
    const { currentPost } = get()
    if (!currentPost) return
    set({
      diffMode: true,
      currentPost: {
        ...currentPost,
        _originalFullPost: currentPost._originalFullPost ?? currentPost.full_post,
      },
    })
  },

  /**
   * El usuario acepta las mejoras — reemplaza el post con improved_post.
   * Guarda el texto original en _originalFullPost para que DiffViewer
   * siempre pueda mostrar la comparación correcta.
   */
  acceptImprovement: () => {
    const { currentPost, analysisResult } = get()
    if (!currentPost || !analysisResult?.improved_post) return

    set({
      currentPost: {
        ...currentPost,
        // Preserva el original por si el usuario vuelve a ver el diff
        _originalFullPost: currentPost._originalFullPost ?? currentPost.full_post,
        full_post:         analysisResult.improved_post,
        character_count:   analysisResult.improved_post.length,
      },
      diffMode: false,
    })
  },

  /** El usuario revierte — descarta improved_post y sale del diff mode */
  revertImprovement: () => set({ diffMode: false }),

  // ─── Acciones paso 5 ─────────────────────────────────────────────────────

  /** @param {string} concept */
  setVisualConcept: (concept) => set({ visualConcept: concept }),

  /** @param {string} prompt */
  setImagePrompt: (prompt) => set({ imagePrompt: prompt }),

  // ─── Reset ────────────────────────────────────────────────────────────────

  /** Resetea TODO el estado del post para empezar desde cero */
  resetPost: () => set({
    format:          null,
    lengthTier:      null,
    currentPost:     null,
    isGeneratingPost: false,
    generateError:   null,
    analysisResult:  null,
    isAnalyzing:     false,
    analyzeError:    null,
    diffMode:        false,
    visualConcept:   null,
    imagePrompt:     null,
  }),

  // ─── Selectores ───────────────────────────────────────────────────────────

  /**
   * Devuelve el texto final del post listo para copiar a LinkedIn,
   * incluyendo solo los hashtags seleccionados por el usuario.
   * @returns {string}
   */
  getFinalPostText: () => {
    const { currentPost } = get()
    if (!currentPost) return ''
    const { full_post, selectedHashtags } = currentPost
    const hashtagsText = selectedHashtags.length > 0
      ? '\n\n' + selectedHashtags.join(' ')
      : ''
    return full_post + hashtagsText
  },
}))

export default usePostStore
