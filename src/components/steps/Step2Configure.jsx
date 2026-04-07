/**
 * Step2Configure — Paso 2: Elegir formato y longitud del post.
 */

import usePost       from '@/hooks/usePost'
import useNews       from '@/hooks/useNews'
import Button        from '@/components/ui/Button'
import Card          from '@/components/ui/Card'
import ErrorBanner   from '@/components/ui/ErrorBanner'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { LENGTH_TIERS } from '@/config/constants'

const LOADING_PHASES = [
  'Leyendo la noticia seleccionada',
  'Construyendo el gancho de apertura',
  'Redactando el cuerpo del post',
  'Ajustando el tono a la voz FINLAT',
  'Incorporando datos financieros clave',
  'Optimizando para el formato elegido',
  'Seleccionando hashtags relevantes',
  'Revisando longitud y estructura',
  'Finalizando el borrador',
]

const FORMATS = [
  {
    id:          'informativo',
    label:       'Informativo',
    description: 'Presenta la noticia con contexto y datos que el lector no encontraría en el titular.',
    icon:        '📊',
  },
  {
    id:          'educativo',
    label:       'Educativo',
    description: 'Usa la noticia como punto de partida para enseñar un concepto financiero aplicable.',
    icon:        '🎓',
  },
  {
    id:          'polemico',
    label:       'Polémico',
    description: 'Toma una postura clara sobre la noticia y genera debate inteligente en LinkedIn.',
    icon:        '⚡',
  },
]

/**
 * @param {{ onPostGenerated: () => void }} props
 */
function Step2Configure({ onPostGenerated }) {
  const { getSelectedNews } = useNews()
  const {
    format,
    lengthTier,
    isGeneratingPost,
    generateError,
    setFormat,
    setLengthTier,
    generatePostAction,
  } = usePost()

  const selectedNews = getSelectedNews()

  const handleGenerate = async () => {
    if (!format || !lengthTier || !selectedNews) return
    await generatePostAction(selectedNews)
    onPostGenerated()
  }

  const canGenerate = format && lengthTier && !isGeneratingPost

  // ── Pantalla de carga ────────────────────────────────────────────────────
  if (isGeneratingPost) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-smoke">Configurar post</h2>
          <p className="text-sm text-smoke-muted mt-0.5">
            Formato: <span className="text-smoke capitalize">{format}</span>
            {' · '}
            Longitud: <span className="text-smoke capitalize">{lengthTier}</span>
          </p>
        </div>
        <div className="rounded-card border border-oxford-light/20 bg-oxford/20">
          <LoadingScreen
            title="Agente 2 — Redactor de Posts"
            phases={LOADING_PHASES}
            estimatedSeconds={20}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Noticia seleccionada */}
      {selectedNews && (
        <Card padding="md" className="border-oxford-light/30">
          <p className="text-xs text-smoke-muted uppercase tracking-wide font-medium mb-1">
            Noticia seleccionada
          </p>
          <p className="text-sm font-semibold text-smoke leading-snug">
            {selectedNews.title}
          </p>
          <p className="text-xs text-smoke-muted mt-1">
            {selectedNews.source} · {selectedNews.key_data}
          </p>
        </Card>
      )}

      {/* Formato */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-smoke">
          Elige el formato del post
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={[
                'text-left p-4 rounded-card border transition-all duration-150 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxford-light',
                format === f.id
                  ? 'bg-oxford border-smoke/50 shadow-glow'
                  : 'bg-oxford/40 border-oxford-light/20 hover:border-oxford-light/50 hover:bg-oxford/70',
              ].join(' ')}
            >
              <span className="text-2xl block mb-2">{f.icon}</span>
              <p className="text-sm font-semibold text-smoke mb-1">{f.label}</p>
              <p className="text-xs text-smoke-muted leading-relaxed">{f.description}</p>
              {format === f.id && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  <span className="text-xs text-success">Seleccionado</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Longitud */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-smoke">
          Elige la longitud aproximada
        </h2>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(LENGTH_TIERS).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => setLengthTier(key)}
              className={[
                'flex flex-col items-center px-5 py-3 rounded-lg border transition-all duration-150 cursor-pointer min-w-[100px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxford-light',
                lengthTier === key
                  ? 'bg-oxford border-smoke/50 shadow-glow'
                  : 'bg-oxford/40 border-oxford-light/20 hover:border-oxford-light/50 hover:bg-oxford/70',
              ].join(' ')}
            >
              <span className="text-sm font-bold text-smoke">{tier.label}</span>
              <span className="text-xs text-smoke-muted mt-0.5">
                {tier.min}–{tier.max} chars
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {generateError && (
        <ErrorBanner
          message={generateError}
          onRetry={handleGenerate}
        />
      )}

      {/* Generar */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          loading={isGeneratingPost}
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          {isGeneratingPost ? 'Redactando con voz FINLAT...' : 'Generar Post →'}
        </Button>
      </div>

    </div>
  )
}

export default Step2Configure
