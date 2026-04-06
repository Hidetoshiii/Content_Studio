/**
 * SkeletonLoader — Placeholders animados que imitan la forma del contenido real.
 * Reduce el efecto de "pantalla en blanco" mientras cargan los datos.
 *
 * Variantes:
 *   news-card  → Card de noticia (3 líneas de texto + badges)
 *   post       → Editor de post con secciones
 *   table-row  → Fila de tabla (análisis de engagement)
 *   text       → Bloque de texto genérico
 */

/** Bloque base de skeleton con animación pulse */
function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={[
        'bg-oxford-light/20 rounded animate-pulse',
        className,
      ].filter(Boolean).join(' ')}
    />
  )
}

/** Skeleton de card de noticia */
function NewsCardSkeleton() {
  return (
    <div className="rounded-card bg-oxford border border-oxford-light/20 p-5 space-y-3">
      {/* Badges */}
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-5 w-12 rounded-full" />
      </div>
      {/* Título */}
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      {/* Resumen */}
      <div className="space-y-1.5 pt-1">
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-4/6" />
      </div>
      {/* Dato clave */}
      <SkeletonBlock className="h-8 w-full rounded-lg" />
    </div>
  )
}

/** Skeleton del editor de post */
function PostSkeleton() {
  return (
    <div className="space-y-4">
      {[60, 100, 140, 80, 60].map((h, i) => (
        <div key={i} className="rounded-lg bg-oxford border border-oxford-light/20 p-4 space-y-2">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className={`h-${Math.max(8, Math.floor(h / 12))} w-full`} />
          <SkeletonBlock className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  )
}

/** Skeleton de fila de tabla */
function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-oxford-light/20">
      <SkeletonBlock className="h-5 w-5 rounded-full shrink-0" />
      <SkeletonBlock className="h-4 w-36" />
      <SkeletonBlock className="h-4 flex-1" />
    </div>
  )
}

/** Skeleton de texto genérico */
function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

/**
 * @param {{
 *   variant?: 'news-card' | 'post' | 'table-row' | 'text',
 *   count?: number,
 *   lines?: number
 * }} props
 */
function SkeletonLoader({ variant = 'text', count = 1, lines = 3 }) {
  const components = Array.from({ length: count }, (_, i) => {
    switch (variant) {
      case 'news-card':  return <NewsCardSkeleton key={i} />
      case 'post':       return <PostSkeleton     key={i} />
      case 'table-row':  return <TableRowSkeleton key={i} />
      default:           return <TextSkeleton     key={i} lines={lines} />
    }
  })

  return <>{components}</>
}

export default SkeletonLoader
