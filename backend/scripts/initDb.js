/**
 * Inicializa la base de datos MySQL para desarrollo local:
 *   1. Crea la base de datos si no existe.
 *   2. Ejecuta el esquema (db/init/01-schema.sql).
 *   3. Carga los datos de prueba (db/init/02-seed.sql).
 *
 * Uso:  npm run db:setup
 *
 * En Docker esto NO es necesario: MySQL ejecuta automáticamente los scripts de
 * db/init al inicializar el contenedor.
 */
import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const initDir = path.join(__dirname, '..', '..', 'db', 'init');

const cfg = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'recolecciones',
  password: process.env.DB_PASSWORD || 'recolecciones123',
  database: process.env.DB_NAME || 'recolecciones',
};

async function main() {
  const schema = await readFile(path.join(initDir, '01-schema.sql'), 'utf-8');
  const seed = await readFile(path.join(initDir, '02-seed.sql'), 'utf-8');

  // Conexión sin base de datos para poder crearla.
  const conn = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  console.log(`→ Creando base de datos "${cfg.database}" (si no existe)…`);
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
  );
  await conn.query(`USE \`${cfg.database}\`;`);

  console.log('→ Aplicando esquema…');
  await conn.query(schema);

  console.log('→ Cargando datos de prueba…');
  await conn.query(seed);

  const [rows] = await conn.query('SELECT COUNT(*) AS total FROM recoleccion;');
  console.log(`✓ Listo. Solicitudes precargadas: ${rows[0].total}`);

  await conn.end();
}

main().catch((err) => {
  console.error('✗ Error inicializando la base de datos:', err.message);
  process.exit(1);
});
