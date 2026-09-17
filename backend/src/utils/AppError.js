/**
 * Error operacional de la aplicación.
 *
 * Permite lanzar errores con un `statusCode` HTTP y un `code` semántico desde
 * cualquier capa (service, validator, etc.). El middleware central de errores
 * los distingue de los errores inesperados (bugs) para responder de forma
 * amigable y consistente.
 */
export default class AppError extends Error {
  /**
   * @param {number} statusCode  Código HTTP (400, 404, 401, ...)
   * @param {string} message     Mensaje amigable para el cliente
   * @param {string} [code]      Código semántico interno (ej. "NOT_FOUND")
   * @param {object} [details]   Información adicional (ej. errores de validación)
   */
  constructor(statusCode, message, code = 'APP_ERROR', details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new AppError(400, message, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Credenciales inválidas') {
    return new AppError(401, message, 'UNAUTHORIZED');
  }

  static notFound(message = 'Recurso no encontrado') {
    return new AppError(404, message, 'NOT_FOUND');
  }
}
