/**
 * Estados posibles de una solicitud de recolección.
 * La clave se guarda en la base de datos; la etiqueta es la que se muestra
 * al usuario final en el frontend.
 */
export const ESTADOS = Object.freeze({
  PENDIENTE_ASIGNACION: 'Pendiente de Asignación',
  RECOLECTOR_EN_CAMINO: 'Recolector en Camino',
  RECOLECTADO: 'Recolectado',
  CANCELADA: 'Cancelada',
});

/**
 * Orden cronológico "feliz" del ciclo de vida de una solicitud.
 * Se usa para pintar la línea de tiempo y para validar transiciones.
 */
export const FLUJO_ESTADOS = [
  'PENDIENTE_ASIGNACION',
  'RECOLECTOR_EN_CAMINO',
  'RECOLECTADO',
];

/**
 * Franjas horarias disponibles para agendar una recolección.
 * `inicio` se usa para calcular si la franja ya pasó.
 */
export const FRANJAS_HORARIAS = Object.freeze({
  '08:00-12:00': { inicio: '08:00', fin: '12:00', etiqueta: 'Mañana (08:00 - 12:00)' },
  '12:00-16:00': { inicio: '12:00', fin: '16:00', etiqueta: 'Tarde (12:00 - 16:00)' },
  '16:00-20:00': { inicio: '16:00', fin: '20:00', etiqueta: 'Noche (16:00 - 20:00)' },
});

export default { ESTADOS, FLUJO_ESTADOS, FRANJAS_HORARIAS };
