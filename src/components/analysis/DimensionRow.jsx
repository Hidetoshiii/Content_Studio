/**
 * DimensionRow — Fila de la tabla de evaluación de engagement.
 */

const STATUS_CONFIG = {
  ok:      { icon: '✓', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  warning: { icon: '⚠', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  fail:    { icon: '✗', color: 'text-danger',  bg: 'bg-danger/10',  border: 'border-danger/20'  },
}

/**
 * @param {{ dimension: { name: string, label: string, status: string, observation: string } }} props
 */
function DimensionRow({ dimension }) {
  const cfg = STATUS_CONFIG[dimension.status] ?? STATUS_CONFIG.ok

  return (
    <div className={[
      'flex items-start gap-3 p-3 rounded-lg border',
      cfg.bg, cfg.border,
    ].join(' ')}>
      <span className={['text-sm font-bold shrink-0 mt-0.5 w-5 text-center', cfg.color].join(' ')}>
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-smoke">{dimension.label}</p>
        <p className="text-xs text-smoke-muted mt-0.5 leading-relaxed">{dimension.observation}</p>
      </div>
    </div>
  )
}

export default DimensionRow
