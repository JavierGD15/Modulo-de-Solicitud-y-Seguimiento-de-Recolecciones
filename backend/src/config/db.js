import mysql from 'mysql2/promise';
import env from './env.js';

/**
 * Pool de conexiones MySQL compartido por toda la aplicación.
 * - `dateStrings`: devuelve DATE/DATETIME como texto (evita conversiones de zona
 *   horaria inesperadas al serializar a JSON).
 * - `timezone: 'Z'`: interpreta/almacena los objetos Date en UTC.
 */
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  timezone: 'Z',
  charset: 'utf8mb4',
});

/**
 * Espera a que la base de datos esté disponible (útil en Docker, donde MySQL
 * puede tardar en aceptar conexiones tras arrancar).
 * @param {number} retries Número de intentos.
 * @param {number} delayMs Espera entre intentos.
 */
export async function waitForDb(retries = 20, delayMs = 3000) {
  for (let intento = 1; intento <= retries; intento += 1) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('✓ Conexión a MySQL establecida.');
      return;
    } catch (err) {
      console.log(`Esperando a MySQL... (${intento}/${retries}) ${err.code || ''}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('No se pudo conectar a MySQL tras varios intentos.');
}

export default pool;
