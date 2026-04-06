/**
 * Step5Publish — Paso 5: Preview final, concepto visual, prompt de imagen y guardado.
 *
 * Muestra:
 *   - PostPreview con el texto listo para copiar a LinkedIn
 *   - Concepto visual sugerido por el Agente 3
 *   - Prompt de IA para generar la imagen
 *   - Botón "Guardar en historial" + reinicio del flujo
 */

import { useState }  from 'react'
import usePost      from '@/hooks/usePost'
import useNews      from '@/hooks/useNews'
import PostPreview  from '@/components/post/PostPreview'
import Button       from '@/components/ui/Button'
import Card         from '@/components/ui/Card'
import useClipboard from '@/hooks/useClipboard'

/**
 * @param {{ onReset: () => void }} props
 */
function Step5Publish({ onReset }) {
  const {
    currentPost,
    lengthTier,
    visualConcept,
    imagePrompt,
    getFinalPostText,
    saveCurrentPost,
  } = usePost()

  const { getSelectedNews } = useNews()
  const selectedNews = getSelectedNews()
  const { copied: copiedPrompt, copyToClipboard: copyPrompt } = useClipboard()

  const [saved, setSaved] = useState(false)

  if (!currentPost) return null

  const finalText = getFinalPostText()

  const handleSave = () => {
    saveCurrentPost(selectedNews)
    setSaved(true)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-smoke">Post listo para publicar</h2>
        <p className="text-sm text-smoke-muted mt-0.5">
          Copia el texto a LinkedIn y usa el concepto visual para acompañar tu post.
        </p>
      </div>

      {/* Preview del post con botón copiar */}
      <PostPreview
        postText={finalText}
        lengthTier={lengthTier ?? 'medio'}
      />

      {/* Concepto visual */}
      {visualConcept && (
        <Card padding="md" className="border-oxford-light/20">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide">
              🎨 Concepto visual sugerido
            </p>
            <p className="text-sm text-smoke leading-relaxed">{visualConcept}</p>
          </div>
        </Card>
      )}

      {/* Prompt para generador de imágenes */}
      {imagePrompt && (
        <Card padding="md" className="border-oxford-light/20 bg-oxford/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide">
                🤖 Prompt para IA (Midjourney / DALL·E / Flux)
              </p>
              <Button
                variant={copiedPrompt ? 'success' : 'ghost'}
                size="sm"
                onClick={() => copyPrompt(imagePrompt)}
              >
                {copiedPrompt ? '✓ Copiado' : 'Copiar prompt'}
              </Button>
            </div>
            <p className="text-sm text-smoke-muted leading-relaxed font-mono text-xs break-words">
              {imagePrompt}
            </p>
          </div>
        </Card>
      )}

      {/* Acciones finales */}
      <div className="flex flex-col gap-3 pt-2 border-t border-oxford-light/15">

        {/* Guardar en historial */}
        {!saved ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-smoke-muted">
              Guarda el post en el historial para evitar repetir ángulos en el futuro.
            </p>
            <Button variant="secondary" size="md" onClick={handleSave}>
              💾 Guardar en historial
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-success">
            <span>✓</span>
            <span>Post guardado en el historial.</span>
          </div>
        )}

        {/* Crear nuevo post */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-smoke-muted">
            ¿Listo para crear otro post?
          </p>
          <Button variant="primary" size="md" onClick={onReset}>
            Crear nuevo post →
          </Button>
        </div>

      </div>

    </div>
  )
}

export default Step5Publish
