/**
 * Settings.jsx — Configuración de API Keys.
 * Primera página que el usuario debe completar.
 * Las keys se validan con formato y se persisten en localStorage via appStore.
 */

import { useState } from 'react'
import useAppStore from '@/stores/appStore'
import Button      from '@/components/ui/Button'
import Card        from '@/components/ui/Card'

function KeyField({ id, label, value, onChange, isValid, placeholder, hint, type = 'password' }) {
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-smoke">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={[
            'w-full bg-gunmetal border rounded-lg px-4 py-2.5 text-sm text-smoke',
            'placeholder:text-smoke-muted/50 pr-20',
            'focus:outline-none focus:ring-2 focus:ring-oxford-light transition-colors',
            value.length > 0
              ? isValid
                ? 'border-success/60'
                : 'border-danger/60'
              : 'border-oxford-light/30',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-smoke-muted hover:text-smoke transition-colors cursor-pointer"
        >
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      <div className="flex items-center gap-2 min-h-[18px]">
        {value.length > 0 && (
          <span className={`text-xs font-medium ${isValid ? 'text-success' : 'text-danger'}`}>
            {isValid ? '✓ Formato válido' : '✗ Formato inválido'}
          </span>
        )}
        {hint && !value.length && (
          <span className="text-xs text-smoke-muted">{hint}</span>
        )}
      </div>
    </div>
  )
}

function Settings() {
  const { apiKeys, setApiKey, isKeyValid, addNotification } = useAppStore()
  const [anthropic, setAnthropic] = useState(apiKeys.anthropic ?? '')
  const [newsapi,   setNewsapi]   = useState(apiKeys.newsapi   ?? '')
  const [saved,     setSaved]     = useState(false)

  const anthropicValid = isKeyValid('anthropic')
  const newsapiValid   = isKeyValid('newsapi')
  const bothValid      = anthropicValid && newsapiValid

  const handleSave = () => {
    setApiKey('anthropic', anthropic)
    setApiKey('newsapi',   newsapi)
    setSaved(true)
    addNotification({ type: 'success', message: 'API keys guardadas correctamente.' })
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-smoke">Configuración</h1>
        <p className="text-sm text-smoke-muted mt-1">
          Ingresa tus API keys para activar la app. Se guardan localmente en tu navegador.
        </p>
      </div>

      {/* Estado general */}
      {!bothValid && (
        <Card padding="md" className="border-warning/30 bg-warning/5">
          <div className="flex gap-3 items-start">
            <span className="text-warning text-lg shrink-0">⚠</span>
            <div>
              <p className="text-sm font-medium text-smoke">Configuración incompleta</p>
              <p className="text-xs text-smoke-muted mt-0.5">
                Necesitas ambas API keys para usar la app. El resto de las páginas estarán disponibles una vez configuradas.
              </p>
            </div>
          </div>
        </Card>
      )}

      {bothValid && (
        <Card padding="md" className="border-success/30 bg-success/5">
          <div className="flex gap-3 items-start">
            <span className="text-success text-lg shrink-0">✓</span>
            <div>
              <p className="text-sm font-medium text-smoke">Todo listo</p>
              <p className="text-xs text-smoke-muted mt-0.5">
                Ambas API keys están configuradas. Puedes ir al Dashboard y generar tu primer post.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Anthropic */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-oxford-light/20">
          <div className="w-8 h-8 rounded-lg bg-gunmetal flex items-center justify-center text-sm shrink-0">🤖</div>
          <div>
            <h2 className="text-sm font-semibold text-smoke">Anthropic (Claude API)</h2>
            <p className="text-xs text-smoke-muted">
              Usada para los 3 agentes de IA — curación, redacción y análisis.
            </p>
          </div>
        </div>

        <KeyField
          id="anthropic-key"
          label="API Key de Anthropic"
          value={anthropic}
          onChange={(v) => { setAnthropic(v); setApiKey('anthropic', v) }}
          isValid={anthropicValid}
          placeholder="sk-ant-api03-..."
          hint='Comienza con "sk-ant-". Obtener en console.anthropic.com'
        />

        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-smoke-muted hover:text-smoke transition-colors"
        >
          Obtener API key en Anthropic Console →
        </a>
      </Card>

      {/* NewsAPI */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-oxford-light/20">
          <div className="w-8 h-8 rounded-lg bg-gunmetal flex items-center justify-center text-sm shrink-0">📰</div>
          <div>
            <h2 className="text-sm font-semibold text-smoke">NewsAPI</h2>
            <p className="text-xs text-smoke-muted">
              Usada para obtener noticias financieras en tiempo real.
              Si no tienes key, la app usa RSS feeds como fallback.
            </p>
          </div>
        </div>

        <KeyField
          id="newsapi-key"
          label="API Key de NewsAPI"
          value={newsapi}
          onChange={(v) => { setNewsapi(v); setApiKey('newsapi', v) }}
          isValid={newsapiValid}
          placeholder="a1b2c3d4e5f6..."
          hint="32 caracteres hexadecimales. Obtener en newsapi.org"
        />

        <div className="flex items-center gap-4">
          <a
            href="https://newsapi.org/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-smoke-muted hover:text-smoke transition-colors"
          >
            Obtener API key gratuita en NewsAPI →
          </a>
          <span className="text-xs text-smoke-muted">|</span>
          <span className="text-xs text-smoke-muted">
            Sin key → se usan feeds RSS de Gestión, El Comercio y Reuters
          </span>
        </div>
      </Card>

      {/* Guardar */}
      <div className="flex items-center gap-4">
        <Button
          variant={saved ? 'success' : 'primary'}
          size="lg"
          onClick={handleSave}
        >
          {saved ? '✓ Guardado' : 'Guardar configuración'}
        </Button>
        <p className="text-xs text-smoke-muted">
          Las keys se guardan localmente en tu navegador y nunca se envían a terceros.
        </p>
      </div>

      {/* Info seguridad */}
      <Card padding="md" className="border-oxford-light/20 bg-transparent">
        <p className="text-xs text-smoke-muted leading-relaxed">
          <strong className="text-smoke">Seguridad:</strong> Esta es una herramienta interna.
          Las API keys se almacenan en el localStorage de tu navegador y solo se usan para
          llamadas directas a la API de Anthropic y NewsAPI desde tu máquina.
          Nunca se envían a servidores de FINLAT ni a terceros.
        </p>
      </Card>

    </div>
  )
}

export default Settings
