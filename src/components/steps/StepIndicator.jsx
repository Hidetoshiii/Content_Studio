/**
 * StepIndicator — Barra de progreso visual del flujo de 5 pasos.
 *
 * Mobile:  solo muestra el número activo expandido + puntos para los demás.
 *          El wrapper es scrollable horizontalmente por si el espacio es justo.
 * Desktop: muestra número + label completo para todos los pasos.
 */

const STEPS = [
  { number: 1, label: 'Descubrir'  },
  { number: 2, label: 'Configurar' },
  { number: 3, label: 'Redactar'   },
  { number: 4, label: 'Optimizar'  },
  { number: 5, label: 'Publicar'   },
]

/**
 * @param {{
 *   currentStep: number,
 *   completedSteps: number[]
 * }} props
 */
function StepIndicator({ currentStep, completedSteps = [] }) {
  return (
    <nav
      aria-label="Progreso del flujo"
      className="flex items-center gap-0 overflow-x-auto scrollbar-none pb-1"
    >
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.includes(step.number)
        const isCurrent   = step.number === currentStep
        const isFuture    = step.number > currentStep && !isCompleted

        return (
          <div key={step.number} className="flex items-center shrink-0">
            {/* Paso */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={[
                'rounded-full flex items-center justify-center font-bold',
                'transition-all duration-200 border-2',
                // Mobile: paso activo más grande, otros más pequeños
                isCurrent
                  ? 'w-9 h-9 text-sm'
                  : 'w-7 h-7 text-xs',
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

              {/* Label — siempre visible en sm+, solo el paso activo en mobile */}
              <span className={[
                'text-xs whitespace-nowrap font-medium',
                'hidden sm:block',           // oculto en mobile por defecto
                isCurrent ? 'block sm:block' : '',  // el activo sí se muestra en mobile
                isCurrent   ? 'text-smoke'       :
                isCompleted ? 'text-success'      :
                              'text-smoke-muted',
              ].join(' ')}>
                {step.label}
              </span>

              {/* Label mobile: solo paso activo */}
              <span className={[
                'text-xs whitespace-nowrap font-medium sm:hidden',
                isCurrent ? 'block' : 'hidden',
                'text-smoke',
              ].join(' ')}>
                {step.label}
              </span>
            </div>

            {/* Conector */}
            {idx < STEPS.length - 1 && (
              <div className={[
                'h-0.5 mb-5 mx-1 transition-colors duration-300',
                'w-6 sm:w-10',
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
