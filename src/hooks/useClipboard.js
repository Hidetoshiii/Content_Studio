/**
 * useClipboard.js — Hook para copiar texto al portapapeles.
 *
 * Usa la Clipboard API moderna con fallback a execCommand para
 * compatibilidad con browsers más antiguos. Muestra feedback
 * visual por 2 segundos después de copiar.
 */

import { useState, useCallback, useRef } from 'react'

/**
 * useClipboard
 *
 * @returns {{
 *   copied: boolean,
 *   copyToClipboard: (text: string) => Promise<boolean>
 * }}
 */
function useClipboard() {
  const [copied, setCopied] = useState(false)
  const timeoutRef          = useRef(null)

  const copyToClipboard = useCallback(async (text) => {
    if (!text) return false

    // Cancela el timeout anterior si el usuario copia rápido dos veces
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    try {
      // Clipboard API moderna (requiere HTTPS o localhost)
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback: execCommand (deprecated pero funciona en entornos sin HTTPS)
        const textarea = document.createElement('textarea')
        textarea.value            = text
        textarea.style.position   = 'fixed'
        textarea.style.top        = '-9999px'
        textarea.style.left       = '-9999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
      return true

    } catch (err) {
      console.warn('[useClipboard] No se pudo copiar:', err)
      return false
    }
  }, [])

  return { copied, copyToClipboard }
}

export default useClipboard
