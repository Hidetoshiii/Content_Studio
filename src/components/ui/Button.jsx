/**
 * Button — Botón base de la app con variantes visuales coherentes con FINLAT.
 *
 * Variantes:
 *   primary   → Oxford Blue con hover más claro — acción principal
 *   secondary → Borde Oxford Blue, fondo transparente — acción secundaria
 *   ghost     → Solo texto, fondo transparente — acción terciaria
 *   danger    → Rojo — acciones destructivas
 *   success   → Verde — confirmaciones (ej: "Aceptar mejoras")
 */

import { forwardRef } from 'react'
import Spinner from './Spinner'

const VARIANTS = {
  primary:   'bg-oxford hover:bg-oxford-light text-smoke border border-oxford-light/30',
  secondary: 'bg-transparent hover:bg-oxford/30 text-smoke border border-oxford',
  ghost:     'bg-transparent hover:bg-oxford/20 text-smoke-muted hover:text-smoke border border-transparent',
  danger:    'bg-danger/15 hover:bg-danger/25 text-danger border border-danger/40',
  success:   'bg-success/15 hover:bg-success/25 text-success border border-success/40',
}

const SIZES = {
  sm:  'px-3 py-1.5 text-sm gap-1.5',
  md:  'px-4 py-2   text-sm gap-2',
  lg:  'px-6 py-2.5 text-base gap-2',
}

/**
 * @param {{
 *   variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success',
 *   size?: 'sm' | 'md' | 'lg',
 *   loading?: boolean,
 *   disabled?: boolean,
 *   fullWidth?: boolean,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   children: React.ReactNode,
 *   className?: string,
 *   onClick?: () => void
 * }} props
 */
const Button = forwardRef(({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxford-light focus-visible:ring-offset-1 focus-visible:ring-offset-gunmetal',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size]        ?? SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading
        ? <Spinner size="sm" className="shrink-0" />
        : leftIcon && <span className="shrink-0">{leftIcon}</span>
      }

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
