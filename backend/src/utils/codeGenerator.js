/**
 * Genera un código único y legible para una solicitud de recolección.
 * Formato: REC-<AÑO>-<8 caracteres alfanuméricos en mayúscula>
 * Ejemplo: REC-2026-A1B2C3D4
 *
 * @returns {string}
 */
export function generarCodigoSolicitud() {
  const anio = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `REC-${anio}-${random}`;
}

export default generarCodigoSolicitud;
