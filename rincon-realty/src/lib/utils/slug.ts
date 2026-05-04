/**
 * Genera un slug URL-safe a partir de un nombre.
 * Solo contiene caracteres [a-z0-9-], nunca vacío.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')                        // descomponer acentos
    .replace(/[\u0300-\u036f]/g, '')         // eliminar diacríticos
    .replace(/[^a-z0-9\s-]/g, '')           // eliminar caracteres especiales
    .trim()
    .replace(/[\s_]+/g, '-')                 // espacios/guiones bajos → guión
    .replace(/-+/g, '-')                     // múltiples guiones → uno
    .replace(/^-|-$/g, '')                   // eliminar guiones al inicio/fin
    || 'item'                                // fallback si queda vacío
}
