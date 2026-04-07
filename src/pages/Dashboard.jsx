/**
 * Dashboard — Página principal.
 * Orquesta el flujo completo de 5 pasos:
 *   1. Descubrir noticias  (Step1Discover)
 *   2. Configurar formato  (Step2Configure)
 *   3. Redactar / editar   (Step3Draft)
 *   4. Optimizar engagement (Step4Optimize)
 *   5. Publicar y guardar  (Step5Publish)
 *
 * La navegación entre pasos está controlada por appStore.currentStep.
 * Los hooks internos de cada step llaman a completeCurrentStep() cuando
 * terminan su operación con IA, lo que avanza el step reactivamente.
 */

import useAppStore  from '@/stores/appStore'
import usePostStore from '@/stores/postStore'
import useNewsStore from '@/stores/newsStore'

import StepIndicator  from '@/components/steps/StepIndicator'
import Step1Discover  from '@/components/steps/Step1Discover'
import Step2Configure from '@/components/steps/Step2Configure'
import Step3Draft     from '@/components/steps/Step3Draft'
import Step4Optimize  from '@/components/steps/Step4Optimize'
import Step5Publish   from '@/components/steps/Step5Publish'

function Dashboard() {
  const { currentStep, completedSteps, completeCurrentStep, resetFlow } = useAppStore()
  const resetPost = usePostStore(s => s.resetPost)
  const clearTopNews = useNewsStore(s => s.clearTopNews)

  // ─── Callbacks de transición ──────────────────────────────────────────────

  /**
   * Step1 → Step2: el usuario seleccionó una noticia y presiona "Continuar".
   * completeCurrentStep avanza de 1 a 2.
   */
  const handleNewsSelected = () => {
    completeCurrentStep()
  }

  /**
   * Step2 → Step3: generatePostAction() llamó completeCurrentStep() internamente.
   * Este callback es solo para confirmación; el paso ya avanzó reactivamente.
   */
  const handlePostGenerated = () => {
    // Step avanzado automáticamente por generatePostAction → no-op
  }

  /**
   * Step3 → Step4: analyzePostAction() llamó completeCurrentStep() internamente.
   */
  const handleAnalyzed = () => {
    // Step avanzado automáticamente por analyzePostAction → no-op
  }

  /**
   * Step4 → Step5: usuario presiona "Continuar" en la pantalla de análisis.
   * completeCurrentStep avanza de 4 a 5.
   */
  const handlePublish = () => {
    completeCurrentStep()
  }

  /**
   * Step5 → Step1: el usuario quiere crear un nuevo post.
   * Resetea el flujo completo: paso, post y noticias.
   */
  const handleReset = () => {
    resetPost()
    clearTopNews()
    resetFlow()
  }

  // ─── Render del paso activo ────────────────────────────────────────────────

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Discover  onNewsSelected={handleNewsSelected}  />
      case 2: return <Step2Configure onPostGenerated={handlePostGenerated} />
      case 3: return <Step3Draft     onAnalyzed={handleAnalyzed}          />
      case 4: return <Step4Optimize  onPublish={handlePublish}            />
      case 5: return <Step5Publish   onReset={handleReset}                />
      default: return <Step1Discover onNewsSelected={handleNewsSelected}  />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 py-5 sm:px-6 sm:py-6">

      {/* Título de página */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-smoke tracking-tight">
          Content Studio
        </h1>
        <p className="text-sm text-smoke-muted mt-1">
          Genera posts de LinkedIn para FINLAT en 5 pasos con IA.
        </p>
      </div>

      {/* Indicador de progreso */}
      <div className="overflow-x-auto pb-1">
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>

      {/* Separador */}
      <div className="border-t border-oxford-light/15" />

      {/* Step activo */}
      <div className="animate-fade-in" key={currentStep}>
        {renderStep()}
      </div>

    </div>
  )
}

export default Dashboard
