import env from '../config/env.js';
import AppError from '../utils/AppError.js';

/**
 * Middleware central de manejo de errores.
 *
 * Distingue entre errores operacionales conocidos (AppError) y errores
 * inesperados (bugs). Siempre responde con una estructura JSON consistente.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const esOperacional = err instanceof AppError;

  const statusCode = esOperacional ? err.statusCode : 500;
  const payload = {
    success: false,
    error: {
      code: esOperacional ? err.code : 'INTERNAL_SERVER_ERROR',
      message: esOperacional
        ? err.message
        : 'Ocurrió un error inesperado en el servidor. Inténtalo más tarde.',
    },
  };

  if (esOperacional && err.details) {
    payload.error.details = err.details;
  }

  // En desarrollo se incluye el stack para facilitar la depuración.
  if (!esOperacional) {
    console.error('[ERROR NO CONTROLADO]', err);
    if (env.nodeEnv === 'development') {
      payload.error.stack = err.stack;
    }
  }

  res.status(statusCode).json(payload);
}

export default errorHandler;
