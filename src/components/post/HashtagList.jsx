/**
 * HashtagList — Lista de hashtags como chips seleccionables.
 * Solo los seleccionados se incluyen al copiar el post.
 */

/**
 * @param {{
 *   hashtags: string[],
 *   selected: string[],
 *   onToggle: (tag: string) => void
 * }} props
 */
function HashtagList({ hashtags = [], selected = [], onToggle }) {
  if (!hashtags.length) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-smoke-muted uppercase tracking-wide">
        Hashtags — clic para incluir/excluir
      </p>
      <div className="flex flex-wrap gap-2">
        {hashtags.map(tag => {
          const isSelected = selected.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={[
                'px-3 py-1 rounded-full text-xs font-medium border transition-all duration-100 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxford-light',
                isSelected
                  ? 'bg-oxford border-smoke/40 text-smoke'
                  : 'bg-transparent border-oxford-light/30 text-smoke-muted hover:border-oxford-light/60',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HashtagList
