import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Pages
import Dashboard    from '@/pages/Dashboard'
import NewsBank     from '@/pages/NewsBank'
import PostHistory  from '@/pages/PostHistory'
import Settings     from '@/pages/Settings'

/**
 * App — Raíz de la aplicación.
 * Define el router y monta el layout principal con las 4 rutas.
 *
 * Rutas:
 *   /                → Dashboard (flujo de 5 pasos)
 *   /banco-noticias  → Banco de noticias guardadas
 *   /historial       → Historial de posts generados
 *   /configuracion   → API Keys y configuración
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index            element={<Dashboard />}   />
          <Route path="banco-noticias" element={<NewsBank />}    />
          <Route path="historial"      element={<PostHistory />} />
          <Route path="configuracion"  element={<Settings />}    />
        </Route>

        {/* Ruta catch-all — redirige a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
