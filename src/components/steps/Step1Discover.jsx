/**
 * Step1Discover — Paso 1: Buscar y seleccionar noticia.
 *
 * El usuario presiona "Buscar Noticias" → la app llama a NewsAPI → Agente 1
 * → muestra 3 tarjetas curadas. El usuario selecciona una para continuar.
 */

import useNews     from '@/hooks/useNews'
import useAppStore from '@/stores/appStore'
import NewsCard        from '@/components/news/NewsCard'
import Button          from '@/components/ui/Button'
import SkeletonLoader  from '@/components/ui/SkeletonLoader'
import ErrorBanner     from '@/components/ui/ErrorBanner'
import EmptyState      from '@/components/ui/EmptyState'

/**
 * @param {{ onNewsSelected: () => void }} props
 */
function Step1Discover({ onNewsSelected }) {
  const {
    topNews,
    selectedNewsId,
    windowExpanded,
    isLoadingNews,
    newsError,
    fetchAndAnalyzeNews,
    selectNews,
  } = useNews()

  const { hasValidApiKeys } = useAppStore()

  const handleSelect = (id) => {
    selectNews(id)
  }

  const handleContinue = () => {
    if (selectedNewsId) onNewsSelected()
  }

  // Sin API key de Anthropic (obligatoria)
  if (!hasValidApiKeys()) {
    return (
      <EmptyState
        icon="⚙️"
        title="Falta la API key de Anthropic"
        description='Ve a Configuración y pega tu API key de Anthropic (empieza con "sk-ant-"). La key de NewsAPI es opcional.'
        action={{ label: 'Ir a Configuración', onClick: () => window.location.href = '/configuracion' }}
      />
    )
  }

  return (
    <div className="space-y-6">

      {/* Header del paso */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-smoke">Buscar noticias del día</h2>
          <p className="text-sm text-smoke-muted mt-0.5">
            La IA analiza las noticias financieras más recientes y selecciona las 3 más relevantes para FINLAT.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          loading={isLoadingNews}
          onClick={fetchAndAnalyzeNews}
          className="shrink-0"
        >
          {isLoadingNews ? 'Analizando...' : topNews.length > 0 ? '↺ Actualizar' : 'Buscar Noticias'}
        </Button>
      </div>

      {/* Aviso ventana ampliada */}
      {windowExpanded && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30">
          <span className="text-warning text-sm">⚠</span>
          <p className="text-xs text-warning">
            Pocas noticias recientes — se amplió la búsqueda a 72 horas.
          </p>
        </div>
      )}

      {/* Error */}
      {newsError && !isLoadingNews && (
        <ErrorBanner
          message={newsError}
          onRetry={fetchAndAnalyzeNews}
        />
      )}

      {/* Cargando */}
      {isLoadingNews && (
        <div className="space-y-5">
          {/* Barra de progreso animada */}
          <div className="w-full h-1 bg-oxford-light/20 rounded-full overflow-hidden">
            <div className="h-full bg-oxford-light rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
          <p className="text-sm text-smoke-muted text-center animate-pulse">
            ⏳ Descargando noticias y analizando con IA… puede tardar 15–30 segundos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonLoader variant="news-card" count={3} />
          </div>
        </div>
      )}

      {/* Noticias */}
      {!isLoadingNews && topNews.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topNews.map(news => (
              <NewsCard
                key={news.id}
                news={news}
                selected={news.id === selectedNewsId}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* Botón continuar */}
          {selectedNewsId && (
            <div className="flex justify-end pt-2 animate-fade-in">
              <Button variant="primary" size="lg" onClick={handleContinue}>
                Continuar con esta noticia →
              </Button>
            </div>
          )}
        </>
      )}

      {/* Estado vacío inicial */}
      {!isLoadingNews && topNews.length === 0 && !newsError && (
        <EmptyState
          icon="📰"
          title="No hay noticias aún"
          description="Presiona «Buscar Noticias» para que la IA analice las fuentes financieras y seleccione las 3 más relevantes para FINLAT."
        />
      )}

    </div>
  )
}

export default Step1Discover
