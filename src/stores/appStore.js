/**
 * appStore.js — Store global de la aplicación (Zustand).
 *
 * Responsabilidades:
 *   - API keys (Anthropic + NewsAPI)
 *   - Paso activo del flujo (1-5)
 *   - Errores y notificaciones globales
 */

import { create } from 'zustand'
import { getApiKeys, saveApiKeys } from '@/services/storageService'
import { isValidAnthropicKey, isValidNewsApiKey, isValidNewsDataKey } from '@/utils/validators'

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} NotificationType
 *
 * @typedef {{
 *   id: string,
 *   type: NotificationType,
 *   message: string,
 *   autoDismiss?: boolean
 * }} Notification
 */

const useAppStore = create((set, get) => ({
  // ─── Estado ───────────────────────────────────────────────────────────────

  /** @type {{ anthropic: string, newsdata: string }} */
  apiKeys: getApiKeys(),   // Carga las keys guardadas al inicializar

  /** Paso activo del flujo principal (1 = Descubrir, ..., 5 = Publicar) */
  currentStep: 1,

  /** @type {number[]} Pasos ya completados */
  completedSteps: [],

  /** @type {Notification[]} Cola de notificaciones */
  notifications: [],

  // ─── API Keys ─────────────────────────────────────────────────────────────

  /**
   * Guarda una API key individual y persiste en localStorage.
   * @param {'anthropic' | 'newsdata'} service
   * @param {string} key
   */
  setApiKey: (service, key) => {
    const updated = { ...get().apiKeys, [service]: key.trim() }
    set({ apiKeys: updated })
    saveApiKeys(updated)
  },

  /**
   * Verifica si la API key de Anthropic está presente y válida.
   * La key de NewsData.io es opcional — si no está, se usa el modo manual.
   * @returns {boolean}
   */
  hasValidApiKeys: () => {
    const { anthropic } = get().apiKeys
    return isValidAnthropicKey(anthropic)
  },

  /**
   * Verifica si una key específica es válida.
   * @param {'anthropic' | 'newsapi' | 'newsdata'} service
   * @returns {boolean}
   */
  isKeyValid: (service) => {
    const key = get().apiKeys[service]
    if (service === 'anthropic') return isValidAnthropicKey(key)
    if (service === 'newsdata')  return isValidNewsDataKey(key)
    return isValidNewsApiKey(key)
  },

  // ─── Flujo de pasos ───────────────────────────────────────────────────────

  /** @param {1|2|3|4|5} step */
  setCurrentStep: (step) => set({ currentStep: step }),

  /** Marca el paso actual como completado y avanza al siguiente */
  completeCurrentStep: () => {
    const { currentStep, completedSteps } = get()
    const alreadyCompleted = completedSteps.includes(currentStep)
    set({
      completedSteps: alreadyCompleted
        ? completedSteps
        : [...completedSteps, currentStep],
      currentStep: Math.min(currentStep + 1, 5),
    })
  },

  /** Reinicia el flujo completo al paso 1 */
  resetFlow: () => set({ currentStep: 1, completedSteps: [] }),

  // ─── Notificaciones ───────────────────────────────────────────────────────

  /**
   * Agrega una notificación a la cola.
   * @param {Omit<Notification, 'id'>} notification
   */
  addNotification: (notification) => {
    const id = crypto.randomUUID()
    set(state => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))
    // Auto-dismiss después de 4 segundos si se solicita
    if (notification.autoDismiss !== false) {
      setTimeout(() => get().dismissNotification(id), 4000)
    }
    return id
  },

  /** @param {string} id */
  dismissNotification: (id) =>
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))

export default useAppStore
