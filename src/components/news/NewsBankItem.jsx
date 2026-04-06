/**
 * NewsBankItem — Fila del banco de noticias.
 */

import Badge           from '@/components/ui/Badge'
import Button          from '@/components/ui/Button'
import NewsSourceBadge from './NewsSourceBadge'
import { formatDateShort, truncate } from '@/utils/formatters'

/**
 * @param {{
 *   item: object,
 *   onUse: (item: object) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
function NewsBankItem({ item, onUse, onDelete }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-oxford-light/15 last:border-0 animate-fade-in">
      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <NewsSourceBadge source={item.source} />
          <span className="text-xs text-smoke-muted">{formatDateShort(item.date)}</span>
        </div>
        <p className="text-sm font-medium text-smoke leading-snug line-clamp-2">
          {item.title}
        </p>
        {item.future_potential && (
          <p className="text-xs text-smoke-muted leading-relaxed">
            {truncate(item.future_potential, 100)}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <Button variant="primary"    size="sm" onClick={() => onUse(item)}>
          Usar
        </Button>
        <Button variant="ghost"      size="sm" onClick={() => onDelete(item.id)}>
          ✕
        </Button>
      </div>
    </div>
  )
}

export default NewsBankItem
