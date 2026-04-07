/**
 * useStorage.js — Estado reactivo del banco de noticias y el historial de posts.
 *
 * Versión Supabase: las operaciones de escritura son async.
 * Los datos se cargan al montar el hook via useEffect + Supabase.
 * getHistoryForAgents opera sobre el estado en memoria (sin llamada extra a DB).
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getNewsBank,
  appendToNewsBank,
  removeFromNewsBank,
  clearNewsBank   as clearNewsBankDb,
  saveNewsBank,
  getPostHistory,
  addToPostHistory,
  clearPostHistory as clearPostHistoryDb,
  mapHistoryForAgents,
} from '@/services/storageService'

function useStorage() {
  const [newsBank,          setNewsBank]    = useState([])
  const [postHistory,       setPostHistory] = useState([])
  const [isLoadingStorage,  setIsLoading]   = useState(true)

  // Carga inicial desde Supabase
  useEffect(() => {
    let cancelled = false
    Promise.all([getNewsBank(), getPostHistory()]).then(([bank, history]) => {
      if (!cancelled) {
        setNewsBank(bank)
        setPostHistory(history)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  // ─── Banco de Noticias ──────────────────────────────────────────────────

  const appendNewsBank = useCallback(async (newItems) => {
    await appendToNewsBank(newItems)
    const updated = await getNewsBank()
    setNewsBank(updated)
  }, [])

  const removeNewsBankItem = useCallback(async (id) => {
    await removeFromNewsBank(id)
    setNewsBank(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearNewsBank = useCallback(async () => {
    await clearNewsBankDb()
    setNewsBank([])
  }, [])

  // ─── Historial de Posts ─────────────────────────────────────────────────

  const savePost = useCallback(async (post) => {
    await addToPostHistory(post)
    setPostHistory(prev => [post, ...prev])
  }, [])

  const clearHistory = useCallback(async () => {
    await clearPostHistoryDb()
    setPostHistory([])
  }, [])

  /**
   * Devuelve los últimos N posts en el formato que esperan los agentes.
   * Opera sobre el estado en memoria — no hace llamada extra a Supabase.
   * @param {number} [limit=7]
   */
  const getHistoryForAgents = useCallback((limit = 7) => {
    return mapHistoryForAgents(postHistory, limit)
  }, [postHistory])

  // ─── Banco de Noticias (replace all) ───────────────────────────────────

  const replaceNewsBank = useCallback(async (items) => {
    await saveNewsBank(items)
    setNewsBank(items)
  }, [])

  return {
    newsBank,
    postHistory,
    isLoadingStorage,
    appendNewsBank,
    removeNewsBankItem,
    clearNewsBank,
    replaceNewsBank,
    savePost,
    clearHistory,
    getHistoryForAgents,
  }
}

export default useStorage
