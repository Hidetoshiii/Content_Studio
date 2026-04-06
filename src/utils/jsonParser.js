/**
 * jsonParser.js — Parser robusto de respuestas JSON de Claude.
 *
 * Claude a veces devuelve el JSON envuelto en markdown (```json ... ```)
 * o con texto adicional antes/después. Este módulo maneja los 3 casos
 * con una estrategia en cascada para máxima resiliencia.
 */

export class ClaudeParseError extends Error {
  /**
   * @param {string} rawResponse - La respuesta cruda de Claude que no pudo parsearse
   */
  constructor(rawResponse) {
    super('No se pudo parsear la respuesta de Claude como JSON válido.')
    this.name    = 'ClaudeParseError'
    this.rawResponse = rawResponse
  }
}

/**
 * parseClaudeResponse — Intenta parsear la respuesta de Claude en 3 pasos.
 *
 * Estrategia:
 *   1. JSON.parse() directo (caso ideal)
 *   2. Extrae bloque ```json ... ``` con regex
 *   3. Extrae el primer objeto JSON encontrado con regex
 *
 * @param {string} rawText - Texto crudo devuelto por la Claude API
 * @returns {object} El objeto JSON parseado
 * @throws {ClaudeParseError} Si ninguna estrategia funciona
 */
export function parseClaudeResponse(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) {
    throw new ClaudeParseError(rawText)
  }

  const text = rawText.trim()

  // ── Estrategia 1: Parse directo ─────────────────────────────────────────
  try {
    return JSON.parse(text)
  } catch (_) {
    // Continúa con la siguiente estrategia
  }

  // ── Estrategia 2: Extrae bloque ```json ... ``` ──────────────────────────
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonBlock?.[1]) {
    try {
      return JSON.parse(jsonBlock[1])
    } catch (_) {
      // Continúa con la siguiente estrategia
    }
  }

  // ── Estrategia 3: Extrae el primer objeto JSON { ... } ───────────────────
  const jsonObject = text.match(/\{[\s\S]*\}/)
  if (jsonObject?.[0]) {
    try {
      return JSON.parse(jsonObject[0])
    } catch (_) {
      // Ninguna estrategia funcionó
    }
  }

  throw new ClaudeParseError(rawText)
}
