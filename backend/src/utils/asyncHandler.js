/**
 * Envuelve un controlador asíncrono para capturar los errores de promesas
 * rechazadas y delegarlos al middleware central de errores mediante `next`.
 *
 * Evita tener que escribir bloques try/catch repetidos en cada controlador.
 *
 * @param {Function} fn Controlador async (req, res, next)
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
