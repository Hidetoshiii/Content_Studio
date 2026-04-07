/**
 * supabaseClient.js — Instancia única del cliente Supabase.
 *
 * Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
 * son públicas (prefijo VITE_) — es seguro exponerlas en el browser.
 * La clave de servicio (SERVICE_ROLE_KEY) NUNCA va aquí; solo en las
 * Vercel API Routes via process.env.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[supabaseClient] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local. ' +
    'La app no podrá conectarse a Supabase.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnon ?? '')
