/**
 * Modal — Diálogo modal accesible con overlay.
 *
 * Mobile:  bottom sheet (sube desde abajo, esquinas superiores redondeadas)
 * Desktop: panel centrado con max-width configurable
 *
 * Cierra con Escape o click en el overlay.
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
    sm:  'sm:max-w-sm',
    md:  'sm:max-w-md',
    lg:  'sm:max-w-lg',
    xl:  'sm:max-w-xl',
  }[maxWidth] ?? 'sm:max-w-md'

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
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

      {/* Panel
          Mobile:  ancho completo, esquinas superiores redondeadas, max-h 90vh con scroll
          Desktop: ancho según maxWidth, todas las esquinas redondeadas, centrado
      */}
      <div
        ref={dialogRef}
        className={[
          'relative w-full bg-oxford border border-oxford-light/30',
          'shadow-card animate-fade-in overflow-y-auto',
          // Mobile: bottom sheet
          'rounded-t-2xl max-h-[90vh]',
          // Desktop: card centrada
          'sm:rounded-card sm:max-h-[85vh]',
          maxWidthClass,
        ].join(' ')}
      >
        {/* Handle visual (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-oxford-light/30" />
        </div>

        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 border-b border-oxford-light/20">
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
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
