import dotenv from 'dotenv';

dotenv.config();

/**
 * Centraliza el acceso a las variables de entorno.
 * Cualquier otra capa de la aplicación debe importar la configuración desde
 * aquí en lugar de leer `process.env` directamente (single source of truth).
 */
const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || 'cargo-express-demo-key-2026',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export default env;
