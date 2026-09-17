import env from '../config/env.js';
import AppError from '../utils/AppError.js';

/**
 * Middleware de seguridad por API Key.
 *
 * Exige que cada petición incluya el header `x-api-key` con el valor
 * configurado en la variable de entorno `API_KEY`. Si falta o no coincide,
 * responde 401 (delegando al middleware central de errores).
 */
export function apiKeyMiddleware(req, _res, next) {
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return next(AppError.unauthorized('Falta el header x-api-key.'));
  }

  if (apiKey !== env.apiKey) {
    return next(AppError.unauthorized('API Key inválida.'));
  }

  return next();
}

export default apiKeyMiddleware;
