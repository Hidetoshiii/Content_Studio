/**
 * AuthContext.jsx — Proveedor de sesión de Supabase Auth.
 *
 * Expone: { session, user, loading, signIn, signOut }
 *
 * - session: objeto de sesión de Supabase (null si no autenticado)
 * - user:    objeto de usuario (null si no autenticado)
 * - loading: true mientras se verifica la sesión inicial
 * - signIn:  (email, password) → Promise<{ error }>
 * - signOut: () → Promise<void>
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext(null)

/** @returns {{ session, user, loading, signIn, signOut }} */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

/**
 * AuthProvider — Envuelve la app y provee el contexto de autenticación.
 * Escucha los cambios de sesión de Supabase para reaccionar automáticamente
 * a login / logout / expiración de token.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Recupera sesión existente (token en localStorage de Supabase)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Suscripción a cambios de sesión (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Inicia sesión con email y password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ error: import('@supabase/supabase-js').AuthError | null }>}
   */
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  /** Cierra la sesión del usuario actual. */
  async function signOut() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    user:    session?.user ?? null,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
