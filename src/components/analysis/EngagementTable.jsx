/**
 * EngagementTable — Tabla completa de evaluación de engagement.
 * Muestra las 7 dimensiones + recomendaciones + botón aplicar mejoras.
 */

import DimensionRow      from './DimensionRow'
import RecommendationCard from './RecommendationCard'
import Button             from '@/components/ui/Button'

const SUMMARY_CONFIG = {
  listo_para_publicar: {
    label:  '✓ Listo para publicar',
    color:  'text-success',
    bg:     'bg-success/10 border-success/30',
    desc:   'El post cumple los criterios de engagement. Puedes publicarlo o aplicar las mejoras sugeridas.',
  },
  ajustes_menores: {
    label:  '⚡ Ajustes menores recomendados',
    color:  'text-warning',
    bg:     'bg-warning/10 border-warning/30',
    desc:   'El post está bien pero hay oportunidades de mejora que pueden aumentar el alcance.',
  },
  requiere_revision: {
    label:  '⚠ Requiere revisión',
    color:  'text-danger',
    bg:     'bg-danger/10 border-danger/30',
    desc:   'Hay elementos que pueden penalizar el alcance en LinkedIn. Se recomienda aplicar las mejoras.',
  },
}

/**
 * @param {{
 *   analysis: object,
 *   onApplyImprovements: () => void
 * }} props
 */
function EngagementTable({ analysis, onApplyImprovements }) {
  const summary = SUMMARY_CONFIG[analysis.evaluation_summary] ?? SUMMARY_CONFIG.ajustes_menores

  return (
    <div className="space-y-6">

      {/* Resumen general */}
      <div className={['p-4 rounded-lg border', summary.bg].join(' ')}>
        <p className={['text-sm font-bold mb-1', summary.color].join(' ')}>{summary.label}</p>
        <p className="text-xs text-smoke-muted">{summary.desc}</p>
      </div>

      {/* Dimensiones */}
      <div>
        <h3 className="text-sm font-semibold text-smoke mb-3">Evaluación por dimensión</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {analysis.dimensions?.map(dim => (
            <DimensionRow key={dim.name} dimension={dim} />
          ))}
        </div>
      </div>

      {/* Recomendaciones */}
      {analysis.recommendations?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-smoke">
              Recomendaciones ({analysis.recommendations.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={onApplyImprovements}
            >
              Aplicar todas las mejoras →
            </Button>
          </div>
          <div className="space-y-3">
            {analysis.recommendations.map(rec => (
              <RecommendationCard key={rec.priority} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Sugerencia post-publicación */}
      {analysis.post_publication_tip && (
        <div className="bg-oxford/30 rounded-lg p-4 border border-oxford-light/20">
          <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide mb-1.5">
            💡 Consejo para después de publicar
          </p>
          <p className="text-sm text-smoke leading-relaxed">{analysis.post_publication_tip}</p>
        </div>
      )}

    </div>
  )
}

export default EngagementTable
