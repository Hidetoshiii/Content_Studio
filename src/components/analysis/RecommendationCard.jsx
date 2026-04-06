/**
 * RecommendationCard — Card de recomendación de engagement.
 * Muestra: qué cambiar, por qué (con evidencia), y ejemplo aplicado.
 */

import { useState } from 'react'
import Card from '@/components/ui/Card'

const IMPACT_CONFIG = {
  alto:  { label: 'Impacto alto',  color: 'text-danger',  bg: 'bg-danger/10'  },
  medio: { label: 'Impacto medio', color: 'text-warning', bg: 'bg-warning/10' },
  bajo:  { label: 'Impacto bajo',  color: 'text-success', bg: 'bg-success/10' },
}

/**
 * @param {{
 *   recommendation: { priority: number, impact: string, what: string, why: string, example: string },
 * }} props
 */
function RecommendationCard({ recommendation }) {
  const [showExample, setShowExample] = useState(false)
  const cfg = IMPACT_CONFIG[recommendation.impact] ?? IMPACT_CONFIG.medio

  return (
    <Card padding="md" className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-oxford-light/30 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-smoke">{recommendation.priority}</span>
        </div>
        <span className={[
          'text-xs font-semibold px-2 py-0.5 rounded-full',
          cfg.color, cfg.bg,
        ].join(' ')}>
          {cfg.label}
        </span>
      </div>

      {/* Qué cambiar */}
      <div>
        <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide mb-1">
          Qué cambiar
        </p>
        <p className="text-sm text-smoke leading-relaxed">{recommendation.what}</p>
      </div>

      {/* Por qué */}
      <div>
        <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide mb-1">
          Por qué
        </p>
        <p className="text-xs text-smoke-muted leading-relaxed">{recommendation.why}</p>
      </div>

      {/* Ejemplo aplicado — colapsable */}
      {recommendation.example && (
        <div>
          <button
            onClick={() => setShowExample(v => !v)}
            className="text-xs text-oxford-light hover:text-smoke transition-colors underline underline-offset-2 cursor-pointer"
          >
            {showExample ? 'Ocultar ejemplo' : 'Ver cómo quedaría →'}
          </button>
          {showExample && (
            <div className="mt-2 bg-gunmetal rounded-lg p-3 border border-oxford-light/20 animate-fade-in">
              <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide mb-1.5">
                Ejemplo aplicado
              </p>
              <p className="text-sm text-smoke leading-relaxed whitespace-pre-wrap">
                {recommendation.example}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default RecommendationCard
