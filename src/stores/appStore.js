/**
 * appStore.js — Store global de la aplicación (Zustand).
 *
 * Responsabilidades:
 *   - Paso activo del flujo (1-5)
 *   - Errores y notificaciones globales
 *
 * Las API keys ya no se gestionan aquí — se configuran en Vercel
 * como variables de entorno y nunca llegan al browser.
 */

import { create } from 'zustand'

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

  /** Paso activo del flujo principal (1 = Descubrir, ..., 5 = Publicar) */
  currentStep: 1,

  /** @type {number[]} Pasos ya completados */
  completedSteps: [],

  /** @type {Notification[]} Cola de notificaciones */
  notifications: [],

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
