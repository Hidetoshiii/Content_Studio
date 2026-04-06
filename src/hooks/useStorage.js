/**
 * useStorage.js — Hook para banco de noticias e historial de posts.
 *
 * Expone los datos de localStorage de forma reactiva mediante estado React,
 * sincronizado con storageService. Ningún componente toca localStorage directamente.
 */

import { useState, useCallback } from 'react'
import {
  getNewsBank,
  saveNewsBank,
  appendToNewsBank,
  removeFromNewsBank,
  getPostHistory,
  addToPostHistory,
  clearPostHistory,
  getRecentHistoryForAgents,
} from '@/services/storageService'

/**
 * useStorage — Estado reactivo del banco de noticias y el historial de posts.
 *
 * @returns {{
 *   newsBank: object[],
 *   postHistory: object[],
 *   appendNewsBank: (items: object[]) => void,
 *   removeNewsBankItem: (id: string) => void,
 *   clearNewsBank: () => void,
 *   savePost: (post: object) => void,
 *   clearHistory: () => void,
 *   getHistoryForAgents: (limit?: number) => object[]
 * }}
 */
function useStorage() {
  const [newsBank,    setNewsBank]    = useState(() => getNewsBank())
  const [postHistory, setPostHistory] = useState(() => getPostHistory())

  // ─── Banco de Noticias ─────────────────────────────────────────────────

  const appendNewsBank = useCallback((newItems) => {
    appendToNewsBank(newItems)
    setNewsBank(getNewsBank())
  }, [])

  const removeNewsBankItem = useCallback((id) => {
    removeFromNewsBank(id)
    setNewsBank(getNewsBank())
  }, [])

  const clearNewsBank = useCallback(() => {
    saveNewsBank([])
    setNewsBank([])
  }, [])

  // ─── Historial de Posts ────────────────────────────────────────────────

  const savePost = useCallback((post) => {
    addToPostHistory(post)
    setPostHistory(getPostHistory())
  }, [])

  const clearHistory = useCallback(() => {
    clearPostHistory()
    setPostHistory([])
  }, [])

  const getHistoryForAgents = useCallback((limit = 7) => {
    return getRecentHistoryForAgents(limit)
  }, [])

  return {
    newsBank,
    postHistory,
    appendNewsBank,
    removeNewsBankItem,
    clearNewsBank,
    savePost,
    clearHistory,
    getHistoryForAgents,
  }
}

export default useStorage
