/**
 * Settings.jsx — Configuración de la cuenta.
 *
 * Las API keys (Anthropic, NewsData.io) son gestionadas centralmente
 * por el equipo de FINLAT como variables de entorno en Vercel.
 * Esta página solo muestra info de sesión y permite cerrar sesión.
 */

import { useAuth } from '@/contexts/AuthContext'
import Button      from '@/components/ui/Button'
import Card        from '@/components/ui/Card'

function Settings() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-10 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-smoke">Configuración</h1>
        <p className="text-sm text-smoke-muted mt-1">
          Cuenta y ajustes de la herramienta interna de FINLAT CAPITAL.
        </p>
      </div>

      {/* Sesión activa */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-oxford-light/20">
          <div className="w-8 h-8 rounded-lg bg-gunmetal flex items-center justify-center text-sm shrink-0">👤</div>
          <div>
            <h2 className="text-sm font-semibold text-smoke">Sesión activa</h2>
            <p className="text-xs text-smoke-muted">Usuario autenticado en FINLAT Content Studio</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-smoke-muted">Email</span>
            <span className="text-sm font-medium text-smoke">{user?.email ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-smoke-muted">Último acceso</span>
            <span className="text-sm font-medium text-smoke">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
                : '—'}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="secondary" size="md" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </Card>

      {/* Credenciales de IA */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-oxford-light/20">
          <div className="w-8 h-8 rounded-lg bg-gunmetal flex items-center justify-center text-sm shrink-0">🔐</div>
          <div>
            <h2 className="text-sm font-semibold text-smoke">Credenciales de IA</h2>
            <p className="text-xs text-smoke-muted">
              Gestionadas centralmente por el equipo técnico de FINLAT
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <div>
              <p className="text-sm font-medium text-smoke">Anthropic (Claude API)</p>
              <p className="text-xs text-smoke-muted">Configurada como variable de entorno en el servidor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-success shrink-0" />
            <div>
              <p className="text-sm font-medium text-smoke">NewsData.io</p>
              <p className="text-xs text-smoke-muted">Configurada como variable de entorno en el servidor</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Info de seguridad */}
      <Card padding="md" className="border-oxford-light/20 bg-transparent">
        <p className="text-xs text-smoke-muted leading-relaxed">
          <strong className="text-smoke">Seguridad:</strong> Las API keys nunca se transmiten
          al navegador. Todas las llamadas a Claude y NewsData.io se ejecutan en servidores
          de Vercel donde las keys están almacenadas como variables de entorno cifradas.
        </p>
      </Card>

    </div>
  )
}

export default Settings
