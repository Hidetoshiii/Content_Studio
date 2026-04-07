/**
 * AuthGuard.jsx — Protege las rutas autenticadas.
 *
 * Si no hay sesión activa → redirige a /login.
 * Mientras se verifica la sesión inicial → muestra spinner.
 * Si hay sesión → renderiza las rutas hijas (children via <Outlet />).
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth }          from '@/contexts/AuthContext'
import Spinner              from '@/components/ui/Spinner'

function AuthGuard() {
  const { session, loading } = useAuth()

  // Espera a que Supabase recupere la sesión del token almacenado
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F1F5F9' }}
      >
        <div className="text-center space-y-3">
          <Spinner size="lg" />
          <p className="text-sm text-smoke-muted">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Sin sesión → login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Con sesión → renderiza las rutas protegidas
  return <Outlet />
}

export default AuthGuard
