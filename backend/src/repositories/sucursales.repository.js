import pool from '../config/db.js';

/**
 * Repositorio de sucursales/hubs (solo lectura) respaldado por MySQL.
 * Se usa para asignar automáticamente una sucursal a cada nueva solicitud.
 */
export class MysqlSucursalesRepository {
  #pool;

  constructor(dbPool = pool) {
    this.#pool = dbPool;
  }

  /** @returns {Promise<Array>} Sucursales con su cobertura (array). */
  async findAll() {
    const [rows] = await this.#pool.query(
      'SELECT id, nombre, departamento, cobertura FROM sucursal',
    );
    return rows.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      departamento: s.departamento,
      // La columna JSON puede venir ya parseada (array) o como texto según el driver.
      cobertura: Array.isArray(s.cobertura)
        ? s.cobertura
        : JSON.parse(s.cobertura || '[]'),
    }));
  }
}

export default new MysqlSucursalesRepository();
