/**
 * NotificationStack — Cola de notificaciones toast en la esquina inferior derecha.
 * Se conecta al appStore y se monta UNA vez en MainLayout.
 */

import useAppStore from '@/stores/appStore'

const TYPE_STYLES = {
  info:    'bg-oxford border-oxford-light/50 text-smoke',
  success: 'bg-success/15 border-success/40 text-success',
  warning: 'bg-warning/15 border-warning/40 text-warning',
  error:   'bg-danger/15 border-danger/40 text-danger',
}

const TYPE_ICONS = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  error:   '❌',
}

function NotificationStack() {
  const { notifications, dismissNotification } = useAppStore()

  if (notifications.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={[
            'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-card',
            'pointer-events-auto animate-fade-in',
            TYPE_STYLES[n.type] ?? TYPE_STYLES.info,
          ].join(' ')}
          role="status"
        >
          <span aria-hidden="true" className="text-sm shrink-0 mt-0.5">
            {TYPE_ICONS[n.type]}
          </span>
          <p className="text-sm flex-1 leading-snug">{n.message}</p>
          <button
            onClick={() => dismissNotification(n.id)}
            aria-label="Cerrar notificación"
            className="shrink-0 text-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer mt-0.5"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationStack
