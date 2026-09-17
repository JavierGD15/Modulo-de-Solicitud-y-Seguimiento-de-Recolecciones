import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import env from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

/**
 * Construye y configura la aplicación Express.
 * Se exporta como factory para poder instanciarla también en pruebas.
 */
export function createApp() {
  const app = express();

  // Middlewares base
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
  });

  // Rutas de la API
  app.use('/api', apiRoutes);

  // 404 y manejador central de errores (siempre al final)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
