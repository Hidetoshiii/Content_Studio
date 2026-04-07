import { Outlet }          from 'react-router-dom'
import Sidebar            from './Sidebar'
import BottomNav          from './BottomNav'
import NotificationStack  from '@/components/ui/NotificationStack'

/**
 * MainLayout — Estructura visual raíz de la app.
 *
 * Mobile (< md):
 *   ┌────────────────────────────────────┐
 *   │  Área de contenido (<Outlet />)    │
 *   ├────────────────────────────────────┤
 *   │  BottomNav (fixed, 64px)           │
 *   └────────────────────────────────────┘
 *
 * Desktop (≥ md):
 *   ┌──────────┬────────────────────────────────────┐
 *   │ Sidebar  │  Área de contenido (<Outlet />)     │
 *   │ (240px)  │  (flex-1, scroll independiente)     │
 *   └──────────┴────────────────────────────────────┘
 */
function MainLayout() {
  return (
    <div className="flex w-full min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Sidebar — solo visible en md+ */}
      <Sidebar />

      {/* Contenido principal — pb-16 en mobile para dejar espacio al BottomNav */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav — solo visible en mobile (md:hidden dentro del componente) */}
      <BottomNav />

      {/* Notificaciones globales — posición fija bottom-right */}
      <NotificationStack />
    </div>
  )
}

export default MainLayout
