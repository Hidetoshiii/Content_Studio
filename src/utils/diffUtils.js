/**
 * diffUtils.js — Wrapper de diff-match-patch.
 * Genera un array de segmentos para el DiffViewer.
 */
import { diff_match_patch } from 'diff-match-patch'

/** @typedef {{ text: string, type: 'equal' | 'insert' | 'delete' }} DiffSegment */

/**
 * computeDiff — Calcula las diferencias entre dos textos.
 *
 * @param {string} original  - Texto original
 * @param {string} improved  - Texto mejorado
 * @returns {DiffSegment[]}  - Array de segmentos tipados para renderizar
 */
export function computeDiff(original, improved) {
  const dmp   = new diff_match_patch()
  const diffs = dmp.diff_main(original, improved)

  // cleanupSemantic mejora la legibilidad del diff para humanos
  dmp.diff_cleanupSemantic(diffs)

  return diffs.map(([operation, text]) => ({
    text,
    type: operation === 1 ? 'insert' : operation === -1 ? 'delete' : 'equal',
  }))
}

/**
 * hasDiff — Verifica si hay diferencias reales entre dos textos.
 *
 * @param {string} original
 * @param {string} improved
 * @returns {boolean}
 */
export function hasDiff(original, improved) {
  return original.trim() !== improved.trim()
}
