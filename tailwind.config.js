/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ─── Paleta oficial FINLAT CAPITAL (Brandbook v1) ───────────────────
      colors: {
        gunmetal:    '#101c26',   // Fondo principal
        oxford:      '#224469',   // Cards, sidebar, acentos
        'oxford-light': '#2d5a8e', // Hover sobre Oxford Blue
        smoke:       '#FFFFFF',   // Texto principal
        'smoke-muted': '#9baab8', // Texto secundario / labels

        // Estados semánticos adaptados a la paleta oscura
        success:     '#22c55e',   // Verde — diff añadido, OK
        warning:     '#f59e0b',   // Ámbar — dimensión con advertencia
        danger:      '#ef4444',   // Rojo — error, diff eliminado
        'danger-soft': 'rgba(239,68,68,0.15)',
        'success-soft': 'rgba(34,197,94,0.15)',
      },

      // ─── Tipografía oficial FINLAT CAPITAL ──────────────────────────────
      fontFamily: {
        sans: ['"Roboto Condensed"', 'system-ui', 'sans-serif'],
      },

      fontWeight: {
        light:      '300',  // Cuerpo de texto secundario
        regular:    '400',  // Cuerpo de texto principal
        medium:     '500',  // Subtítulos / labels clave
        semibold:   '600',
        extrabold:  '800',  // Titulares principales
      },

      // ─── Espaciado y tamaños base ────────────────────────────────────────
      borderRadius: {
        card: '12px',
      },

      // ─── Sombras coherentes con el dark theme ────────────────────────────
      boxShadow: {
        card:  '0 4px 24px rgba(0,0,0,0.35)',
        glow:  '0 0 0 2px rgba(34,68,105,0.6)',
        focus: '0 0 0 3px rgba(34,68,105,0.8)',
      },

      // ─── Transiciones suaves y sobrias ───────────────────────────────────
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },

  plugins: [],
}
