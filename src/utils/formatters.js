/**
 * formatters.js — Funciones de formateo de datos para la UI.
 */

/**
 * formatDate — Formatea una fecha ISO a formato legible en español.
 *
 * @param {string} isoDate - Fecha en formato ISO 8601
 * @returns {string} Ej: "6 de abril de 2026"
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  }).format(new Date(isoDate))
}

/**
 * formatDateShort — Formato compacto para tablas y listas.
 *
 * @param {string} isoDate
 * @returns {string} Ej: "06/04/2026"
 */
export function formatDateShort(isoDate) {
  if (!isoDate) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  }).format(new Date(isoDate))
}

/**
 * truncate — Trunca texto a N caracteres con elipsis.
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * countChars — Cuenta caracteres de un texto (sin contar espacios de más).
 *
 * @param {string} text
 * @returns {number}
 */
export function countChars(text) {
  return (text ?? '').length
}

/**
 * formatLabel — Capitaliza la primera letra de un string.
 * Útil para mostrar labels de formato/longitud.
 *
 * @param {string} str
 * @returns {string} Ej: "informativo" → "Informativo"
 */
export function formatLabel(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * slugify — Convierte un string a slug URL-friendly.
 * Útil para generar IDs únicos basados en títulos.
 *
 * @param {string} text
 * @returns {string} Ej: "Esto es un Título" → "esto-es-un-titulo"
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
