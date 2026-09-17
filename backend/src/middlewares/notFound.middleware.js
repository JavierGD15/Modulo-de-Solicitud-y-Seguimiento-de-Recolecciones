/**
 * Middleware para rutas no encontradas (404 a nivel de routing).
 * Se coloca al final de la cadena, antes del errorHandler.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `La ruta ${req.method} ${req.originalUrl} no existe en esta API.`,
    },
  });
}

export default notFoundHandler;
