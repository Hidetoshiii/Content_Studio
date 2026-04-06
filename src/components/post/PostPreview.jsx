/**
 * PostPreview — Vista del post completo listo para copiar a LinkedIn.
 * Muestra el texto con el formato exacto que verá el usuario al publicar.
 */

import useClipboard from '@/hooks/useClipboard'
import Button       from '@/components/ui/Button'
import { countChars } from '@/utils/formatters'
import { LENGTH_TIERS } from '@/config/constants'

/**
 * @param {{
 *   postText: string,
 *   lengthTier?: string,
 *   onCopy?: () => void
 * }} props
 */
function PostPreview({ postText, lengthTier = 'medio', onCopy }) {
  const { copied, copyToClipboard } = useClipboard()
  const chars    = countChars(postText)
  const tierConf = LENGTH_TIERS[lengthTier]

  const handleCopy = async () => {
    await copyToClipboard(postText)
    onCopy?.()
  }

  // Determina si la longitud está dentro del tier
  const inRange  = tierConf && chars >= tierConf.min && chars <= tierConf.max
  const tooShort = tierConf && chars < tierConf.min
  const tooLong  = tierConf && chars > tierConf.max

  return (
    <div className="space-y-3">

      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className={[
          'text-sm font-semibold tabular-nums',
          inRange  ? 'text-success' :
          tooShort ? 'text-warning' :
          tooLong  ? 'text-danger'  :
                     'text-smoke',
        ].join(' ')}>
          {chars.toLocaleString()} caracteres
        </span>
        {tierConf && (
          <span className="text-xs text-smoke-muted">
            Rango {lengthTier}: {tierConf.min.toLocaleString()}–{tierConf.max.toLocaleString()}
            {inRange  && ' ✓' }
            {tooShort && ' — muy corto'}
            {tooLong  && ' — muy largo'}
          </span>
        )}
        <div className="ml-auto">
          <Button
            variant={copied ? 'success' : 'primary'}
            size="sm"
            onClick={handleCopy}
          >
            {copied ? '✓ Copiado' : '📋 Copiar post'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gunmetal rounded-lg border border-oxford-light/20 p-5">
        <pre className="text-sm text-smoke leading-relaxed font-sans whitespace-pre-wrap break-words">
          {postText || <span className="text-smoke-muted">El post aparecerá aquí...</span>}
        </pre>
      </div>

    </div>
  )
}

export default PostPreview
