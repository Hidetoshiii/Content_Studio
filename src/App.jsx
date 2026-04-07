import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth
import { AuthProvider } from '@/contexts/AuthContext'
import AuthGuard        from '@/components/layout/AuthGuard'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Pages
import Login       from '@/pages/Login'
import Dashboard   from '@/pages/Dashboard'
import NewsBank    from '@/pages/NewsBank'
import PostHistory from '@/pages/PostHistory'
import Settings    from '@/pages/Settings'

/**
 * App — Raíz de la aplicación.
 *
 * Rutas públicas:  /login
 * Rutas protegidas (requieren sesión Supabase):
 *   /                → Dashboard (flujo de 5 pasos)
 *   /banco-noticias  → Banco de noticias guardadas
 *   /historial       → Historial de posts generados
 *   /configuracion   → Cuenta y configuración
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas — AuthGuard redirige a /login si no hay sesión */}
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route index                     element={<Dashboard />}   />
              <Route path="banco-noticias"     element={<NewsBank />}    />
              <Route path="historial"          element={<PostHistory />} />
              <Route path="configuracion"      element={<Settings />}    />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
