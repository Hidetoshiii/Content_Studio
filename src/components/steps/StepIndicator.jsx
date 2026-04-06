/**
 * StepIndicator — Barra de progreso visual del flujo de 5 pasos.
 */

const STEPS = [
  { number: 1, label: 'Descubrir'    },
  { number: 2, label: 'Configurar'   },
  { number: 3, label: 'Redactar'     },
  { number: 4, label: 'Optimizar'    },
  { number: 5, label: 'Publicar'     },
]

/**
 * @param {{
 *   currentStep: number,
 *   completedSteps: number[]
 * }} props
 */
function StepIndicator({ currentStep, completedSteps = [] }) {
  return (
    <nav aria-label="Progreso del flujo" className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.number)
        const isCurrent   = step.number === currentStep
        const isFuture    = step.number > currentStep && !isCompleted

        return (
          <div key={step.number} className="flex items-center">
            {/* Paso */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                'transition-all duration-200 border-2',
                isCompleted
                  ? 'bg-success/20 border-success text-success'
                  : isCurrent
                    ? 'bg-oxford border-smoke/60 text-smoke'
                    : 'bg-transparent border-oxford-light/30 text-smoke-muted',
              ].join(' ')}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span className={[
                'text-xs whitespace-nowrap font-medium hidden sm:block',
                isCurrent   ? 'text-smoke'       :
                isCompleted ? 'text-success'      :
                              'text-smoke-muted',
              ].join(' ')}>
                {step.label}
              </span>
            </div>

            {/* Conector */}
            {idx < STEPS.length - 1 && (
              <div className={[
                'w-10 h-0.5 mb-5 mx-1 transition-colors duration-300',
                isCompleted ? 'bg-success/50' : 'bg-oxford-light/20',
              ].join(' ')} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default StepIndicator
