import AppError from '../utils/AppError.js';
import { FRANJAS_HORARIAS } from '../config/constants.js';

/**
 * Valida y normaliza el cuerpo de una solicitud de creación de recolección.
 *
 * Reglas (requerimiento "Manejo de Errores"):
 *  - `direccion`: obligatoria, texto no vacío.
 *  - `fechaRecoleccion`: obligatoria, fecha válida en formato YYYY-MM-DD.
 *  - `franjaHoraria`: obligatoria, debe existir en el catálogo de franjas.
 *  - `pesoAproximado`: obligatorio, numérico y estrictamente positivo.
 *  - `cliente`: opcional; si viene, se normaliza nombre/email/telefono.
 *
 * @param {object} body
 * @throws {AppError} 400 con el detalle de todos los campos inválidos.
 * @returns {object} Datos normalizados listos para el service.
 */
export function validarCrearRecoleccion(body = {}) {
  const errores = {};
  const datos = {};

  // ---- dirección ----------------------------------------------------------
  if (typeof body.direccion !== 'string' || body.direccion.trim() === '') {
    errores.direccion = 'La dirección es obligatoria y no puede ir vacía.';
  } else {
    datos.direccion = body.direccion.trim();
  }

  // ---- fecha de recolección ----------------------------------------------
  if (!body.fechaRecoleccion) {
    errores.fechaRecoleccion = 'La fecha de recolección es obligatoria.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.fechaRecoleccion))) {
    errores.fechaRecoleccion = 'La fecha debe tener el formato YYYY-MM-DD.';
  } else if (Number.isNaN(Date.parse(body.fechaRecoleccion))) {
    errores.fechaRecoleccion = 'La fecha de recolección no es una fecha válida.';
  } else {
    datos.fechaRecoleccion = body.fechaRecoleccion;
  }

  // ---- franja horaria -----------------------------------------------------
  if (!body.franjaHoraria) {
    errores.franjaHoraria = 'La franja horaria es obligatoria.';
  } else if (!FRANJAS_HORARIAS[body.franjaHoraria]) {
    errores.franjaHoraria = `Franja horaria inválida. Opciones: ${Object.keys(FRANJAS_HORARIAS).join(', ')}.`;
  } else {
    datos.franjaHoraria = body.franjaHoraria;
  }

  // ---- peso aproximado ----------------------------------------------------
  const peso = Number(body.pesoAproximado);
  if (body.pesoAproximado === undefined || body.pesoAproximado === null || body.pesoAproximado === '') {
    errores.pesoAproximado = 'El peso aproximado es obligatorio.';
  } else if (Number.isNaN(peso)) {
    errores.pesoAproximado = 'El peso aproximado debe ser un valor numérico.';
  } else if (peso <= 0) {
    errores.pesoAproximado = 'El peso aproximado debe ser un número positivo mayor a 0.';
  } else {
    datos.pesoAproximado = peso;
  }

  // ---- cliente (opcional) -------------------------------------------------
  if (body.cliente && typeof body.cliente === 'object') {
    datos.cliente = {
      nombre: String(body.cliente.nombre || '').trim() || 'Cliente',
      email: String(body.cliente.email || '').trim() || undefined,
      telefono: String(body.cliente.telefono || '').trim() || undefined,
    };
  }

  if (Object.keys(errores).length > 0) {
    throw AppError.badRequest('Los datos enviados no son válidos.', errores);
  }

  return datos;
}

export default { validarCrearRecoleccion };
