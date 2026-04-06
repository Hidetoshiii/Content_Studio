/**
 * Badge — Etiqueta visual para categorías, estados y metadata.
 *
 * Variantes predefinidas alineadas con los datos de los agentes:
 *   origin    → 'peru' | 'internacional'
 *   priority  → 'alta' | 'media'
 *   format    → 'informativo' | 'educativo' | 'polemico'
 *   status    → 'ok' | 'warning' | 'fail'
 *   custom    → cualquier color vía className
 */

const PRESETS = {
  // Origen geográfico
  peru:           'bg-oxford/60 text-smoke border border-oxford-light/40',
  internacional:  'bg-gunmetal text-smoke-muted border border-smoke/10',

  // Prioridad editorial
  alta:           'bg-success/15 text-success border border-success/30',
  media:          'bg-warning/15 text-warning border border-warning/30',

  // Formatos de post
  informativo:    'bg-oxford/60 text-smoke border border-oxford-light/40',
  educativo:      'bg-success/15 text-success border border-success/30',
  polemico:       'bg-danger/15 text-danger border border-danger/30',

  // Estados del analizador
  ok:             'bg-success/15 text-success border border-success/30',
  warning:        'bg-warning/15 text-warning border border-warning/30',
  fail:           'bg-danger/15 text-danger border border-danger/30',

  // Genérico
  default:        'bg-oxford/40 text-smoke-muted border border-smoke/10',
}

const LABEL_MAP = {
  peru:          '🇵🇪 Perú',
  internacional: '🌍 Internacional',
  alta:          'Alta',
  media:         'Media',
  informativo:   'Informativo',
  educativo:     'Educativo',
  polemico:      'Polémico',
  ok:            '✓',
  warning:       '⚠',
  fail:          '✗',
}

/**
 * @param {{
 *   preset?: keyof PRESETS,
 *   label?: string,
 *   size?: 'sm' | 'md',
 *   className?: string
 * }} props
 */
function Badge({ preset = 'default', label, size = 'sm', className = '' }) {
  const displayLabel = label ?? LABEL_MAP[preset] ?? preset

  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        PRESETS[preset] ?? PRESETS.default,
        className,
      ].filter(Boolean).join(' ')}
    >
      {displayLabel}
    </span>
  )
}

export default Badge
