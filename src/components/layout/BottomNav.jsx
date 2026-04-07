/**
 * BottomNav — Navegación inferior para pantallas mobile (< md).
 * Reemplaza visualmente al Sidebar en móvil.
 * Se oculta automáticamente en md: (≥ 768px) donde aparece el Sidebar.
 */

import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/',               label: 'Inicio',    icon: '🏠' },
  { to: '/banco-noticias', label: 'Noticias',  icon: '📰' },
  { to: '/historial',      label: 'Historial', icon: '📋' },
  { to: '/configuracion',  label: 'Config',    icon: '⚙️'  },
]

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
      style={{
        backgroundColor: '#101c26',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Navegación principal"
    >
      {NAV_ITEMS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex-1"
          style={({ isActive }) => ({
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '3px',
            padding:        '10px 4px',
            fontSize:       '10px',
            fontWeight:     '500',
            textDecoration: 'none',
            color:          isActive ? '#FFFFFF' : '#9baab8',
            backgroundColor: isActive ? 'rgba(34,68,105,0.5)' : 'transparent',
            transition:     'color 150ms, background-color 150ms',
          })}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }} aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
