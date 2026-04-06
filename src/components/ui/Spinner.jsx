/**
 * Spinner — Indicador de carga circular animado.
 * Tamaños: sm (16px), md (24px), lg (36px)
 */

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-9 h-9 border-[3px]',
}

/**
 * @param {{
 *   size?: 'sm' | 'md' | 'lg',
 *   className?: string,
 *   label?: string
 * }} props
 */
function Spinner({ size = 'md', className = '', label = 'Cargando...' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full border-smoke/20 border-t-smoke animate-spin',
        SIZES[size] ?? SIZES.md,
        className,
      ].filter(Boolean).join(' ')}
    />
  )
}

export default Spinner
