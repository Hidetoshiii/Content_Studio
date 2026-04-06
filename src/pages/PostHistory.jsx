/**
 * PostHistory — Historial de posts generados y publicados.
 *
 * Lista todos los posts guardados con sus metadatos.
 * Permite:
 *   - Ver el texto completo de cada post (expandible)
 *   - Copiar el post al portapapeles
 *   - Ver el ángulo y temas cubiertos (para no repetirlos)
 *   - Limpiar el historial completo
 */

import { useState }   from 'react'
import useStorage     from '@/hooks/useStorage'
import useClipboard   from '@/hooks/useClipboard'
import Button         from '@/components/ui/Button'
import Badge          from '@/components/ui/Badge'
import Card           from '@/components/ui/Card'
import EmptyState     from '@/components/ui/EmptyState'
import Modal          from '@/components/ui/Modal'
import { formatDate, formatLabel, truncate } from '@/utils/formatters'

// ─── Subcomponente: tarjeta de post histórico ────────────────────────────────

function PostHistoryCard({ post }) {
  const [expanded, setExpanded]   = useState(false)
  const { copied, copyToClipboard } = useClipboard()

  const FORMAT_BADGE = {
    informativo: 'informativo',
    educativo:   'educativo',
    polemico:    'polemico',
  }

  return (
    <Card padding="md" className="space-y-3 animate-fade-in">

      {/* Header: fecha + badges */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <p className="text-xs text-smoke-muted">{formatDate(post.date)}</p>
          <p className="text-sm font-semibold text-smoke leading-snug line-clamp-2">
            {post.newsTitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Badge preset={FORMAT_BADGE[post.format] ?? 'informativo'}>
            {formatLabel(post.format)}
          </Badge>
          <Badge variant="default" className="capitalize">
            {formatLabel(post.length_tier)}
          </Badge>
        </div>
      </div>

      {/* Ángulo */}
      {post.angle && (
        <div className="px-3 py-2 bg-oxford/20 rounded-lg border border-oxford-light/15">
          <p className="text-xs text-smoke-muted">
            <span className="font-semibold text-smoke">Ángulo:</span>{' '}
            {post.angle}
          </p>
        </div>
      )}

      {/* Preview del post — colapsable */}
      <div>
        <div className={[
          'text-sm text-smoke leading-relaxed whitespace-pre-wrap font-sans',
          !expanded && 'line-clamp-3',
        ].filter(Boolean).join(' ')}>
          {post.full_post}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-xs text-oxford-light hover:text-smoke transition-colors mt-1 underline underline-offset-2 cursor-pointer"
        >
          {expanded ? 'Ver menos' : 'Ver completo →'}
        </button>
      </div>

      {/* Temas cubiertos */}
      {post.topics_covered?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.topics_covered.slice(0, 4).map((topic, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-oxford/30 border border-oxford-light/20 text-smoke-muted"
            >
              {truncate(topic, 40)}
            </span>
          ))}
        </div>
      )}

      {/* Copiar */}
      <div className="flex justify-end pt-1 border-t border-oxford-light/10">
        <Button
          variant={copied ? 'success' : 'ghost'}
          size="sm"
          onClick={() => copyToClipboard(post.full_post)}
        >
          {copied ? '✓ Copiado' : '📋 Copiar post'}
        </Button>
      </div>

    </Card>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

function PostHistory() {
  const { postHistory, clearHistory } = useStorage()
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClearAll = () => {
    clearHistory()
    setConfirmClear(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-smoke tracking-tight">
            Historial de Posts
          </h1>
          <p className="text-sm text-smoke-muted mt-1">
            Registro de posts generados. Los agentes de IA lo consultan para no repetir ángulos ni formatos.
          </p>
        </div>
        {postHistory.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmClear(true)}
            className="shrink-0 text-danger hover:text-danger"
          >
            Limpiar historial
          </Button>
        )}
      </div>

      {/* Contador */}
      {postHistory.length > 0 && (
        <p className="text-xs text-smoke-muted">
          {postHistory.length} post{postHistory.length !== 1 ? 's' : ''} guardado{postHistory.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Lista */}
      {postHistory.length > 0 ? (
        <div className="space-y-4">
          {postHistory.map(post => (
            <PostHistoryCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📋"
          title="Historial vacío"
          description="Los posts que guardes desde el paso 5 del flujo aparecerán aquí. Los agentes los usarán como contexto para evitar repetir temas y ángulos."
        />
      )}

      {/* Modal confirmación */}
      <Modal
        open={confirmClear}
        title="¿Limpiar el historial?"
        onClose={() => setConfirmClear(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-smoke-muted">
            Se eliminarán los {postHistory.length} posts guardados. Los agentes de IA perderán el contexto histórico.
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setConfirmClear(false)}>
              Cancelar
            </Button>
            <Button variant="danger" size="md" onClick={handleClearAll}>
              Sí, limpiar todo
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default PostHistory
