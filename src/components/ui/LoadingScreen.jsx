/**
 * LoadingScreen — Pantalla de carga estilo "Claude Code Console" (Terminal/CLI)
 * con Mascotas de Arte ANSI Animadas nativamente en CSS/SVG.
 */

import { useState, useEffect } from 'react'

// ─── COMPONENTES DE MASCOTAS ANIMADAS (Arte Terminal Vectorial) ──────────────────

/**
 * Mascota: Agente Descubridor/🕵️‍♂️ (Detective).
 * Un monitor clásico con una lupa flotando y escaneando la pantalla.
 * Inspirado exactamente en image_6ae1ef.png.
 */
function AgentDiscoverMascot() {
  return (
    <svg 
      viewBox="0 0 100 60" 
      className="w-32 h-20 text-oxford-light animate-pulse-subtle" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* El Monitor Clásico (Cuerpo Principal) */}
      <rect x="10" y="5" width="80" height="40" rx="3" />
      
      {/* Líneas de escaneo de fondo (texto simulado) */}
      <line x1="20" y1="15" x2="80" y2="15" strokeOpacity="0.3" />
      <line x1="20" y1="20" x2="60" y2="20" strokeOpacity="0.3" />
      <line x1="20" y1="25" x2="70" y2="25" strokeOpacity="0.3" />
      <line x1="20" y1="30" x2="80" y2="30" strokeOpacity="0.3" />

      {/* La Lupa Animada (Herramienta de Búsqueda) */}
      <g className="animate-detective-search">
        {/* Círculo de la lupa */}
        <circle cx="25" cy="20" r="10" strokeWidth="2" fill="white" fillOpacity="0.05" />
        {/* Mango de la lupa */}
        <line x1="32" y1="27" x2="42" y2="37" strokeWidth="2.5" />
        {/* Destello de lente (cruz) */}
        <line x1="25" y1="17" x2="25" y2="23" strokeWidth="1" strokeOpacity="0.6"/>
        <line x1="22" y1="20" x2="28" y2="20" strokeWidth="1" strokeOpacity="0.6"/>
      </g>
      
      {/* Soporte/Cuello del monitor */}
      <rect x="35" y="45" width="30" height="5" rx="1" />
      {/* Base del monitor */}
      <rect x="25" y="50" width="50" height="5" rx="2" />
    </svg>
  )
}

/**
 * Mascota: Agente Redactor/✍️ (Escritor).
 * Un monitor clásico con una pluma/quill escribiendo líneas en la pantalla.
 * Inspirado exactamente en image_6ae1ef.png.
 */
function AgentWriterMascot() {
  return (
    <svg 
      viewBox="0 0 100 60" 
      className="w-32 h-20 text-oxford-light animate-pulse-subtle" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* El Monitor Clásico (Cuerpo Principal) */}
      <rect x="10" y="5" width="80" height="40" rx="3" />
      
      {/* Líneas de texto ya escritas (estáticas) */}
      <line x1="20" y1="15" x2="50" y2="15" />
      <line x1="20" y1="20" x2="70" y2="20" />
      <line x1="20" y1="25" x2="80" y2="25" />

      {/* La Pluma Animada (Herramienta de Redacción) */}
      <g className="animate-quill-write">
        {/* El cuerpo de la pluma/quill */}
        <path d="M75 10 C 65 20, 55 30, 45 40 L 40 45" strokeWidth="2" />
        {/* El "plumín" o punta escribiendo */}
        <path d="M40 45 L 35 40" strokeWidth="1.5"/>
        {/* Movimiento de trazo (pequeña línea que aparece) */}
        <line x1="30" y1="45" x2="45" y2="45" className="animate-pulse" />
      </g>
      
      {/* Soporte/Cuello del monitor */}
      <rect x="35" y="45" width="30" height="5" rx="1" />
      {/* Base del monitor */}
      <rect x="25" y="50" width="50" height="5" rx="2" />
    </svg>
  )
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────

/**
 * LoadingScreen — Pantalla de carga estilo Terminal con Mascotas Animadas.
 * * @param {{
 * title: string,
 * phases: string[],
 * estimatedSeconds?: number,
 * mascotType?: 'discover' | 'write', // Define qué mascota dibujar
 * className?: string
 * }} props
 */
function LoadingScreen({ 
  title, 
  phases = [], 
  estimatedSeconds, 
  mascotType = 'discover', // Por defecto detective
  className = '' 
}) {
  const [phaseIndex, setPhaseIndex] = useState(0)

  // 1. Rota entre las fases (los textos descriptivos) cada 3 segundos
  useEffect(() => {
    if (phases.length <= 1) return
    const id = setInterval(() => {
      setPhaseIndex(i => (i + 1) % phases.length)
    }, 3000)
    return () => clearInterval(id)
  }, [phases.length])

  const currentPhase = phases[phaseIndex] ?? ''

  return (
    <div className={[
      'flex flex-col items-start justify-center py-10 px-8 w-full max-w-md mx-auto space-y-6',
      className,
    ].join(' ')}>
      
      {/* ❯❯❯ Título estilo Terminal */}
      <div className="space-y-1 w-full border-b border-oxford-light/20 pb-3">
        <h3 className="text-sm font-mono font-bold text-smoke flex items-center gap-2">
          <span className="text-oxford-light">❯</span> {title}
        </h3>
        {estimatedSeconds && (
          <p className="text-xs font-mono text-smoke-muted pl-4">
            [ ETA: ~{estimatedSeconds}s ]
          </p>
        )}
      </div>

      {/* ❯❯❯ Contenedor de la Mascota Trabajando */}
      <div className="w-full flex flex-col items-center justify-center p-4 rounded border border-oxford-light/10 font-mono text-sm min-h-[10rem]">
        
        {/* Renderizado de la mascota según el tipo */}
        <div className="mb-4">
          {mascotType === 'write' ? <AgentWriterMascot /> : <AgentDiscoverMascot />}
        </div>

        {/* Línea de estado actual (mantiene Braille Spinner previo) */}
        {phases.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-smoke-muted w-full border-t border-oxford-light/10 pt-3">
            <span className="text-oxford-light font-bold w-4 animate-braille-spin">⠋</span>
            <span>{currentPhase}...</span>
          </div>
        )}
      </div>

      {/* Barra de progreso terminal minimalista */}
      <div className="w-full h-1 bg-oxford-light/10 overflow-hidden mt-2">
        <div
          className="h-full bg-oxford-light/60"
          style={{ animation: 'terminal-load 2s ease-in-out infinite' }}
        />
      </div>

      {/* ─── ESTILOS CSS INYECTADOS ────────────────────────────────────────── */}
      <style>{`
        /* Animación: Lupa escaneando horizontalmente (Detective) */
        @keyframes detective-search {
          0%, 100% { transform: translateX(0px); }
          50%      { transform: translateX(55px); } /* Mueve la lupa por la pantalla */
        }
        .animate-detective-search {
          animation: detective-search 4s ease-in-out infinite;
        }

        /* Animación: Pluma temblando/escribiendo (Escritor) */
        @keyframes quill-write {
          0%, 100% { transform: rotate(0deg) translate(0px, 0px); }
          25%      { transform: rotate(-3deg) translate(-1px, 1px); }
          75%      { transform: rotate(3deg) translate(1px, -1px); }
        }
        .animate-quill-write {
          animation: quill-write 0.8s ease-in-out infinite;
          transform-origin: 40px 45px; /* Punto de pivote en la punta de la pluma */
        }

        /* Animación: Barra de carga de terminal */
        @keyframes terminal-load {
          0%   { transform: translateX(-100%); width: 50%; }
          50%  { transform: translateX(50%);  width: 50%; }
          100% { transform: translateX(200%); width: 50%; }
        }

        /* Animación: Braille Spinner rápido */
        @keyframes braille-spin {
          0%   { content: '⠋'; } 10%  { content: '⠙'; } 20%  { content: '⠹'; } 30%  { content: '⠸'; } 40%  { content: '⠼'; }
          50%  { content: '⠴'; } 60%  { content: '⠦'; } 70%  { content: '⠧'; } 80%  { content: '⠇'; } 90%  { content: '⠏'; } 100% { content: '⠋'; }
        }
        .animate-braille-spin::before {
          content: '⠋';
          animation: braille-spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen