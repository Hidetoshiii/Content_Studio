/**
 * Step4Optimize — Paso 4: Análisis de engagement + mejoras con diff.
 * Muestra EngagementTable. Al aplicar mejoras, alterna a DiffViewer.
 */

import { useState }    from 'react'
import usePost         from '@/hooks/usePost'
import EngagementTable from '@/components/analysis/EngagementTable'
import DiffViewer      from '@/components/post/DiffViewer'
import Button          from '@/components/ui/Button'
import Card            from '@/components/ui/Card'

/**
 * @param {{ onPublish: () => void }} props
 */
function Step4Optimize({ onPublish }) {
  const {
    currentPost,
    analysisResult,
    diffMode,
    activateDiffMode,
    acceptImprovement,
    revertImprovement,
  } = usePost()

  const [view, setView] = useState('analysis') // 'analysis' | 'diff'

  if (!analysisResult) return null

  // Texto base para el diff: si ya aceptamos antes, usamos el actual; si no, el original guardado
  const originalText = currentPost?._originalFullPost ?? currentPost?.full_post ?? ''
  const improvedText = analysisResult.improved_post ?? ''

  const handleApplyImprovements = () => {
    activateDiffMode()
    setView('diff')
  }

  const handleAccept = () => {
    acceptImprovement()
    onPublish()
  }

  const handleRevert = () => {
    revertImprovement()
    setView('analysis')
  }

  return (
    <div className="space-y-5">

      {/* Header + toggle de vista */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-smoke">Análisis de Engagement</h2>
          <p className="text-sm text-smoke-muted mt-0.5">
            Evaluación según criterios del algoritmo de LinkedIn.
          </p>
        </div>

        {diffMode && (
          <div className="flex gap-2 shrink-0">
            <Button
              variant={view === 'analysis' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('analysis')}
            >
              Ver análisis
            </Button>
            <Button
              variant={view === 'diff' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('diff')}
            >
              Ver cambios
            </Button>
          </div>
        )}
      </div>

      {/* ─── Vista: análisis de dimensiones ─── */}
      {view === 'analysis' && (
        <>
          <EngagementTable
            analysis={analysisResult}
            onApplyImprovements={handleApplyImprovements}
          />

          {/* Botón continuar sin mejorar */}
          <div className="flex items-center justify-between pt-2 border-t border-oxford-light/15">
            <p className="text-xs text-smoke-muted">
              {diffMode
                ? 'Ya aplicaste las mejoras. Puedes continuar.'
                : 'Puedes publicar con el post actual o aplicar las mejoras primero.'}
            </p>
            <Button variant="primary" size="md" onClick={onPublish}>
              Continuar →
            </Button>
          </div>
        </>
      )}

      {/* ─── Vista: diff entre original e improved ─── */}
      {view === 'diff' && diffMode && (
        <div className="space-y-4">
          <Card padding="sm" className="border-oxford-light/20 bg-oxford/10">
            <p className="text-xs text-smoke-muted">
              <span className="font-semibold text-smoke">Revisa los cambios.</span>{' '}
              Acepta para continuar con la versión mejorada o vuelve al original.
            </p>
          </Card>

          <DiffViewer
            originalText={originalText}
            improvedText={improvedText}
            onAccept={handleAccept}
            onRevert={handleRevert}
          />
        </div>
      )}

    </div>
  )
}

export default Step4Optimize
