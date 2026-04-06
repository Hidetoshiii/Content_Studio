/**
 * Card — Contenedor base de la app.
 *
 * Props:
 *   selected  → borde resaltado en Oxford Light (cuando una card está seleccionada)
 *   hoverable → cursor pointer + efecto hover
 *   padding   → controla el padding interno ('none' | 'sm' | 'md' | 'lg')
 */

const PADDING = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-6',
}

/**
 * @param {{
 *   selected?: boolean,
 *   hoverable?: boolean,
 *   padding?: 'none' | 'sm' | 'md' | 'lg',
 *   onClick?: () => void,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
function Card({
  selected  = false,
  hoverable = false,
  padding   = 'md',
  onClick,
  className = '',
  children,
}) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-card bg-oxford border transition-all duration-150',
        selected
          ? 'border-smoke/60 shadow-glow'
          : 'border-oxford-light/20',
        hoverable && !selected
          ? 'hover:border-oxford-light/50 hover:bg-oxford-light/30 cursor-pointer'
          : '',
        onClick ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxford-light' : '',
        PADDING[padding] ?? PADDING.md,
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}

export default Card
