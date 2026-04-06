/**
 * validators.js — Funciones de validación de datos de la app.
 */

/**
 * isValidAnthropicKey — Valida formato de API key de Anthropic.
 * Las keys de Anthropic empiezan con "sk-ant-"
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isValidAnthropicKey(key) {
  return typeof key === 'string' && key.startsWith('sk-ant-') && key.length > 20
}

/**
 * isValidNewsApiKey — Valida formato de API key de NewsAPI.
 * Las keys de NewsAPI son strings hexadecimales de 32 caracteres.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isValidNewsApiKey(key) {
  return typeof key === 'string' && /^[a-f0-9]{32}$/i.test(key)
}

/**
 * isValidUrl — Verifica si un string es una URL válida.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * isValidNewsItem — Valida la estructura mínima de un ítem de noticia.
 *
 * @param {object} item
 * @returns {boolean}
 */
export function isValidNewsItem(item) {
  return (
    item &&
    typeof item.title === 'string' && item.title.trim().length > 0 &&
    typeof item.url   === 'string' && isValidUrl(item.url)
  )
}

/**
 * isValidPost — Valida que un post tenga el mínimo de contenido requerido.
 *
 * @param {string} postText
 * @returns {boolean}
 */
export function isValidPost(postText) {
  return typeof postText === 'string' && postText.trim().length >= 100
}
