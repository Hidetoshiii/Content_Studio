/**
 * DiffViewer — Muestra diferencias entre el post original y el mejorado.
 * Verde = texto añadido. Rojo tachado = texto eliminado. Gris = sin cambio.
 */

import { useMemo } from 'react'
import { computeDiff, hasDiff } from '@/utils/diffUtils'
import Button from '@/components/ui/Button'

/**
 * @param {{
 *   originalText: string,
 *   improvedText: string,
 *   onAccept: () => void,
 *   onRevert: () => void
 * }} props
 */
function DiffViewer({ originalText, improvedText, onAccept, onRevert }) {
  const segments = useMemo(
    () => computeDiff(originalText, improvedText),
    [originalText, improvedText],
  )

  const hasChanges = hasDiff(originalText, improvedText)

  return (
    <div className="space-y-4">

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-success/30 border border-success/50" />
          <span className="text-smoke-muted">Texto añadido</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-danger/30 border border-danger/50" />
          <span className="text-smoke-muted">Texto eliminado</span>
        </span>
      </div>

      {/* Diff */}
      <div className="bg-gunmetal rounded-lg border border-oxford-light/20 p-4">
        <p className="text-sm leading-relaxed font-sans whitespace-pre-wrap break-words">
          {segments.map((seg, i) => {
            if (seg.type === 'insert') {
              return (
                <mark key={i} className="diff-insert rounded px-0.5">
                  {seg.text}
                </mark>
              )
            }
            if (seg.type === 'delete') {
              return (
                <mark key={i} className="diff-delete rounded px-0.5">
                  {seg.text}
                </mark>
              )
            }
            return <span key={i} className="text-smoke">{seg.text}</span>
          })}
        </p>
      </div>

      {/* Sin cambios */}
      {!hasChanges && (
        <p className="text-xs text-smoke-muted text-center py-2">
          No hay diferencias significativas entre el original y la versión mejorada.
        </p>
      )}

      {/* Acciones */}
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" size="md" onClick={onRevert}>
          ↩ Volver al original
        </Button>
        <Button variant="success" size="md" onClick={onAccept}>
          ✓ Aceptar versión mejorada
        </Button>
      </div>

    </div>
  )
}

export default DiffViewer
