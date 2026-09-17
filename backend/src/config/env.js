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
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'recolecciones',
    password: process.env.DB_PASSWORD || 'recolecciones123',
    name: process.env.DB_NAME || 'recolecciones',
  },
};

export default env;
