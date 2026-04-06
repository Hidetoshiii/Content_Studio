/**
 * ErrorBanner — Banner de error inline (no modal).
 * No bloquea la UI. El usuario puede reintentar o descartar.
 */

import { useState } from 'react'
import Button from './Button'

/**
 * @param {{
 *   message: string,
 *   details?: string,
 *   onRetry?: () => void,
 *   onDismiss?: () => void,
 *   className?: string
 * }} props
 */
function ErrorBanner({ message, details, onRetry, onDismiss, className = '' }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 p-4 rounded-lg bg-danger/10 border border-danger/30',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Ícono */}
      <span className="text-danger text-lg shrink-0 mt-0.5" aria-hidden="true">⚠</span>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-smoke font-medium">{message}</p>

        {details && (
          <>
            <button
              onClick={() => setShowDetails(v => !v)}
              className="text-xs text-smoke-muted hover:text-smoke mt-1 underline underline-offset-2 cursor-pointer"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles técnicos'}
            </button>
            {showDetails && (
              <pre className="mt-2 text-xs text-smoke-muted bg-gunmetal rounded p-2 overflow-x-auto whitespace-pre-wrap break-words">
                {details}
              </pre>
            )}
          </>
        )}

        {/* Acciones */}
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button variant="danger" size="sm" onClick={onRetry}>
                Reintentar
              </Button>
            )}
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                Descartar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorBanner
