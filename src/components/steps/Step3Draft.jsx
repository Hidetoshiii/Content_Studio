/**
 * Step3Draft — Paso 3: Editar el post generado antes del análisis.
 */

import usePost         from '@/hooks/usePost'
import PostSectionEditor from '@/components/post/PostSectionEditor'
import HashtagList       from '@/components/post/HashtagList'
import Button            from '@/components/ui/Button'
import Card              from '@/components/ui/Card'
import ErrorBanner       from '@/components/ui/ErrorBanner'
import { countChars }    from '@/utils/formatters'
import { LENGTH_TIERS }  from '@/config/constants'

/**
 * @param {{ onAnalyzed: () => void }} props
 */
function Step3Draft({ onAnalyzed }) {
  const {
    currentPost,
    lengthTier,
    isAnalyzing,
    analyzeError,
    updateSection,
    toggleHashtag,
    analyzePostAction,
  } = usePost()

  if (!currentPost) return null

  const totalChars = countChars(currentPost.full_post)
  const tier       = LENGTH_TIERS[lengthTier ?? 'medio']
  const inRange    = tier && totalChars >= tier.min && totalChars <= tier.max

  const handleAnalyze = async () => {
    await analyzePostAction()
    onAnalyzed()
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-smoke">Edita tu post</h2>
        <p className="text-sm text-smoke-muted mt-0.5">
          Revisa cada sección y ajusta el texto. Los cambios se reflejan en tiempo real.
        </p>
      </div>

      {/* Nota del redactor */}
      {currentPost.editor_note && (
        <Card padding="sm" className="border-oxford-light/20 bg-oxford/20">
          <p className="text-xs text-smoke-muted">
            <span className="font-semibold text-smoke">Nota del redactor:</span>{' '}
            {currentPost.editor_note}
          </p>
        </Card>
      )}

      {/* Editor de secciones */}
      <div className="space-y-3">
        {currentPost.sections?.map(section => (
          <PostSectionEditor
            key={section.label}
            section={section}
            onChange={updateSection}
          />
        ))}
      </div>

      {/* Hashtags */}
      <HashtagList
        hashtags={currentPost.hashtags ?? []}
        selected={currentPost.selectedHashtags ?? []}
        onToggle={toggleHashtag}
      />

      {/* Contador total */}
      <div className="flex items-center gap-3 py-2 border-t border-oxford-light/15">
        <span className={[
          'text-sm font-semibold tabular-nums',
          inRange ? 'text-success' : 'text-warning',
        ].join(' ')}>
          {totalChars.toLocaleString()} caracteres totales
        </span>
        {tier && (
          <span className="text-xs text-smoke-muted">
            Rango sugerido: {tier.min.toLocaleString()}–{tier.max.toLocaleString()}
            {inRange && ' ✓'}
          </span>
        )}
      </div>

      {/* Error */}
      {analyzeError && (
        <ErrorBanner message={analyzeError} onRetry={handleAnalyze} />
      )}

      {/* Analizar */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          loading={isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? 'Analizando engagement...' : 'Analizar Engagement →'}
        </Button>
      </div>

    </div>
  )
}

export default Step3Draft
