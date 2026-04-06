/**
 * EmptyState — Estado vacío con ícono, título y descripción.
 * Se usa cuando no hay noticias, no hay historial, etc.
 */

import Button from './Button'

/**
 * @param {{
 *   icon?: string,
 *   title: string,
 *   description?: string,
 *   action?: { label: string, onClick: () => void },
 *   className?: string
 * }} props
 */
function EmptyState({ icon = '📭', title, description, action, className = '' }) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className="text-4xl mb-4" aria-hidden="true">{icon}</span>
      <h3 className="text-base font-semibold text-smoke mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-smoke-muted max-w-xs">{description}</p>
      )}
      {action && (
        <Button
          variant="primary"
          size="md"
          className="mt-5"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
