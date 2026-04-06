/**
 * Tooltip — Tooltip simple sobre cualquier elemento.
 * Usa CSS puro (group/peer) sin dependencias externas.
 */

/**
 * @param {{
 *   content: string,
 *   position?: 'top' | 'bottom' | 'left' | 'right',
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
function Tooltip({ content, position = 'top', children, className = '' }) {
  const positionClasses = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span className={['relative inline-flex group', className].filter(Boolean).join(' ')}>
      {children}
      <span
        role="tooltip"
        className={[
          'absolute z-50 px-2 py-1 text-xs text-smoke bg-gunmetal border border-oxford-light/40',
          'rounded whitespace-nowrap pointer-events-none shadow-card',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          positionClasses[position] ?? positionClasses.top,
        ].filter(Boolean).join(' ')}
      >
        {content}
      </span>
    </span>
  )
}

export default Tooltip
