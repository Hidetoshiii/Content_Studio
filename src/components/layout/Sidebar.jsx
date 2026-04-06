import { NavLink } from 'react-router-dom'

/**
 * NAV_ITEMS — Ítems de navegación del sidebar.
 * Centralizado aquí para facilitar cambios futuros.
 */
const NAV_ITEMS = [
  { to: '/',               label: 'Inicio',           icon: '🏠' },
  { to: '/banco-noticias', label: 'Banco de Noticias', icon: '📰' },
  { to: '/historial',      label: 'Historial',         icon: '📋' },
  { to: '/configuracion',  label: 'Configuración',     icon: '⚙️'  },
]

/**
 * Sidebar — Navegación lateral fija de la app.
 * Usa NavLink de React Router para marcar el ítem activo.
 */
function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-oxford flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-oxford-light/30">
        <span className="text-smoke font-extrabold text-lg tracking-wide leading-tight">
          FINLAT<br />
          <span className="text-smoke-muted font-medium text-sm">Content Studio</span>
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navegación principal">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-gunmetal text-smoke'
                  : 'text-smoke-muted hover:bg-gunmetal/50 hover:text-smoke',
              ].join(' ')
            }
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer del sidebar */}
      <div className="px-6 py-4 border-t border-oxford-light/30">
        <p className="text-xs text-smoke-muted">FINLAT CAPITAL © 2026</p>
      </div>

    </aside>
  )
}

export default Sidebar
