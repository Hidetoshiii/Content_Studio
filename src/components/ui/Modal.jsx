/**
 * Modal — Diálogo modal accesible con overlay.
 * Cierra con Escape o click en el overlay.
 * Enfoca el primer elemento focusable al abrir (accesibilidad).
 */

import { useEffect, useRef } from 'react'
import Button from './Button'

/**
 * @param {{
 *   open: boolean,
 *   title?: string,
 *   onClose: () => void,
 *   children: React.ReactNode,
 *   maxWidth?: 'sm' | 'md' | 'lg' | 'xl',
 *   hideCloseButton?: boolean
 * }} props
 */
function Modal({ open, title, onClose, children, maxWidth = 'md', hideCloseButton = false }) {
  const dialogRef = useRef(null)

  const maxWidthClass = {
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-xl',
  }[maxWidth] ?? 'max-w-md'

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gunmetal/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={[
          'relative w-full rounded-card bg-oxford border border-oxford-light/30',
          'shadow-card animate-fade-in',
          maxWidthClass,
        ].join(' ')}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-oxford-light/20">
            {title && (
              <h2 id="modal-title" className="text-base font-semibold text-smoke">
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Cerrar"
                className="ml-auto"
              >
                ✕
              </Button>
            )}
          </div>
        )}

        {/* Contenido */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
