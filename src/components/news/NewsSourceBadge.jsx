/**
 * NewsSourceBadge — Badge con el nombre de la fuente de la noticia.
 */
function NewsSourceBadge({ source, className = '' }) {
  return (
    <span className={[
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      'bg-gunmetal border border-oxford-light/30 text-smoke-muted',
      className,
    ].join(' ')}>
      {source}
    </span>
  )
}

export default NewsSourceBadge
