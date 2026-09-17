/**
 * Cliente HTTP para la API de recolecciones.
 * Centraliza la URL base, el header de API Key y el manejo de errores para que
 * los componentes no dependan de detalles de `fetch`.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

/**
 * Realiza una petición a la API y normaliza la respuesta/errores.
 * @throws {Error} con `.status` y `.details` cuando la API responde con error.
 */
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...(options.headers || {}),
      },
    });
  } catch {
    const err = new Error(
      'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.',
    );
    err.status = 0;
    throw err;
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const err = new Error(body?.error?.message || 'Ocurrió un error al procesar la solicitud.');
    err.status = response.status;
    err.code = body?.error?.code;
    err.details = body?.error?.details;
    throw err;
  }

  return body;
}

/**
 * Registra una nueva solicitud de recolección.
 * @param {object} payload direccion, fechaRecoleccion, franjaHoraria, pesoAproximado, cliente?
 * @returns {Promise<object>} respuesta { success, message, data }
 */
export function crearRecoleccion(payload) {
  return request('/api/recolecciones', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Consulta una solicitud por su código.
 * @param {string} codigo
 * @returns {Promise<object>} respuesta { success, data }
 */
export function consultarRecoleccion(codigo) {
  return request(`/api/recolecciones/${encodeURIComponent(codigo.trim())}`, {
    method: 'GET',
  });
}

export default { crearRecoleccion, consultarRecoleccion };
