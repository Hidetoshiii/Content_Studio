/**
 * PostSectionEditor — Sección editable del post con etiqueta de tipo.
 * Cada sección del post (Gancho, Contexto, etc.) es un área de texto
 * con color de borde diferenciado.
 */

import { countChars } from '@/utils/formatters'

const SECTION_COLORS = {
  'Gancho':               'border-l-warning',
  'Noticia detonador':    'border-l-oxford-light',
  'Contexto':             'border-l-oxford-light',
  'Desarrollo':           'border-l-oxford-light',
  'El concepto':          'border-l-success',
  'Aplicación práctica':  'border-l-success',
  'La postura':           'border-l-danger',
  'El argumento':         'border-l-danger',
  'El contrapunto':       'border-l-smoke-muted',
  'Implicancia ejecutiva':'border-l-success',
  'Cierre':               'border-l-smoke-muted',
}

/**
 * @param {{
 *   section: { label: string, content: string },
 *   onChange: (label: string, content: string) => void
 * }} props
 */
function PostSectionEditor({ section, onChange }) {
  const borderColor = SECTION_COLORS[section.label] ?? 'border-l-oxford-light'
  const chars       = countChars(section.content)

  return (
    <div className={[
      'rounded-lg bg-gunmetal border border-oxford-light/20 border-l-4 overflow-hidden',
      borderColor,
    ].join(' ')}>

      {/* Header de la sección */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-oxford-light/10">
        <span className="text-xs font-semibold text-smoke-muted uppercase tracking-wider">
          {section.label}
        </span>
        <span className={[
          'text-xs tabular-nums',
          chars > 200 ? 'text-warning' : 'text-smoke-muted',
        ].join(' ')}>
          {chars} chars
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={section.content}
        onChange={(e) => onChange(section.label, e.target.value)}
        rows={Math.max(3, Math.ceil(section.content.length / 80))}
        className={[
          'w-full bg-transparent px-4 py-3 text-sm text-smoke',
          'resize-none focus:outline-none leading-relaxed',
          'placeholder:text-smoke-muted/40',
        ].join(' ')}
        placeholder={`Contenido de la sección ${section.label}...`}
        aria-label={`Editar sección: ${section.label}`}
      />
    </div>
  )
}

export default PostSectionEditor
