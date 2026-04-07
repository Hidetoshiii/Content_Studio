/**
 * ManualNewsInput — Formulario para ingresar una noticia manualmente.
 * Útil cuando las APIs de noticias no están disponibles o
 * el usuario tiene una noticia específica que quiere usar.
 */

import { useState } from 'react'
import Button       from '@/components/ui/Button'
import Card         from '@/components/ui/Card'

/**
 * @param {{
 *   onSubmit: (articles: object[]) => void,
 *   isLoading: boolean
 * }} props
 */
function ManualNewsInput({ onSubmit, isLoading }) {
  const [title,   setTitle]   = useState('')
  const [source,  setSource]  = useState('')
  const [content, setContent] = useState('')
  const [url,     setUrl]     = useState('')

  const canSubmit = title.trim().length > 5 && content.trim().length > 30

  const handleSubmit = () => {
    if (!canSubmit) return

    const article = {
      title:        title.trim(),
      source:       source.trim() || 'Noticia manual',
      url:          url.trim()    || `https://manual-entry-${Date.now()}.local`,
      published_at: new Date().toISOString(),
      description:  content.trim(),
    }

    onSubmit([article])
  }

  return (
    <Card padding="md" className="space-y-4 border-oxford-light/30">

      <div className="flex items-center gap-2">
        <span className="text-oxford-light text-lg">✏️</span>
        <div>
          <h3 className="text-sm font-semibold text-smoke">Ingresar noticia manualmente</h3>
          <p className="text-xs text-smoke-muted">
            Pega el texto de una noticia financiera y la IA la procesará igual que las automáticas.
          </p>
        </div>
      </div>

      {/* Título */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-smoke">
          Titular <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ej: BCRP mantiene tasa de referencia en 5.75%..."
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-smoke bg-oxford
                     placeholder:text-smoke-muted/50 focus:outline-none focus:ring-2 focus:ring-oxford-light"
        />
      </div>

      {/* Fuente y URL (opcionales) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-smoke">Fuente (opcional)</label>
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="Ej: Gestión, RPP..."
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-smoke bg-oxford
                       placeholder:text-smoke-muted/50 focus:outline-none focus:ring-2 focus:ring-oxford-light"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-smoke">URL (opcional)</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-smoke bg-oxford
                       placeholder:text-smoke-muted/50 focus:outline-none focus:ring-2 focus:ring-oxford-light"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-smoke">
          Contenido / Resumen <span className="text-danger">*</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Pega aquí el texto completo de la noticia o un resumen detallado..."
          rows={5}
          className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm text-smoke bg-oxford
                     placeholder:text-smoke-muted/50 focus:outline-none focus:ring-2 focus:ring-oxford-light
                     resize-none leading-relaxed"
        />
        <p className="text-xs text-smoke-muted">
          {content.length} caracteres — mínimo 30 para continuar
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-smoke-muted">
          La IA evaluará la relevancia para FINLAT y generará el resumen.
        </p>
        <Button
          variant="primary"
          size="md"
          disabled={!canSubmit}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Analizar con IA →
        </Button>
      </div>

    </Card>
  )
}

export default ManualNewsInput
