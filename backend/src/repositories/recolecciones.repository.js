import pool from '../config/db.js';
import { ESTADOS } from '../config/constants.js';

/**
 * Repositorio de solicitudes de recolección respaldado por MySQL.
 *
 * Implementa el patrón Repository: expone una interfaz de persistencia
 * (`findAll`, `findByCodigo`, `create`, `registrarCambioEstado`) independiente
 * de la lógica de negocio. Recibe el pool por constructor (inyección de
 * dependencias) para facilitar las pruebas.
 */
export class MysqlRecoleccionesRepository {
  #pool;

  constructor(dbPool = pool) {
    this.#pool = dbPool;
  }

  /** Convierte una fila de recolección + su historial en el objeto de dominio. */
  #mapRecoleccion(row, historialRows) {
    return {
      codigo: row.codigo,
      direccion: row.direccion,
      fechaRecoleccion: row.fecha_recoleccion,
      franjaHoraria: row.franja_horaria,
      pesoAproximado: Number(row.peso_aproximado),
      estadoActual: row.estado_actual,
      sucursal: row.sucursal_id
        ? { id: row.sucursal_id, nombre: row.sucursal_nombre }
        : null,
      cliente: {
        nombre: row.cliente_nombre,
        email: row.cliente_email,
        telefono: row.cliente_telefono,
      },
      historial: historialRows.map((e) => ({
        estado: e.estado,
        etiqueta: ESTADOS[e.estado] || e.estado,
        fecha: e.fecha,
        descripcion: e.descripcion,
      })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async #getHistorial(conn, codigo) {
    const [rows] = await conn.query(
      'SELECT estado, fecha, descripcion FROM evento_historial WHERE recoleccion_codigo = ? ORDER BY fecha ASC, id ASC',
      [codigo],
    );
    return rows;
  }

  /** @returns {Promise<Array>} Todas las solicitudes con su historial. */
  async findAll() {
    const conn = await this.#pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT r.*, s.nombre AS sucursal_nombre
           FROM recoleccion r
           LEFT JOIN sucursal s ON s.id = r.sucursal_id
          ORDER BY r.created_at DESC`,
      );
      const resultado = [];
      for (const row of rows) {
        // eslint-disable-next-line no-await-in-loop
        const historial = await this.#getHistorial(conn, row.codigo);
        resultado.push(this.#mapRecoleccion(row, historial));
      }
      return resultado;
    } finally {
      conn.release();
    }
  }

  /**
   * Busca una solicitud por su código (case-insensitive).
   * @param {string} codigo
   * @returns {Promise<object|null>}
   */
  async findByCodigo(codigo) {
    const conn = await this.#pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT r.*, s.nombre AS sucursal_nombre
           FROM recoleccion r
           LEFT JOIN sucursal s ON s.id = r.sucursal_id
          WHERE UPPER(r.codigo) = UPPER(?)
          LIMIT 1`,
        [String(codigo).trim()],
      );
      if (rows.length === 0) return null;
      const historial = await this.#getHistorial(conn, rows[0].codigo);
      return this.#mapRecoleccion(rows[0], historial);
    } finally {
      conn.release();
    }
  }

  /**
   * Inserta una nueva solicitud junto con su primer evento de historial
   * (transacción).
   * @param {object} r Objeto de dominio con `historial` (evento inicial).
   * @returns {Promise<object>} La solicitud creada.
   */
  async create(r) {
    const conn = await this.#pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `INSERT INTO recoleccion
           (codigo, direccion, fecha_recoleccion, franja_horaria, peso_aproximado,
            estado_actual, sucursal_id, cliente_nombre, cliente_email, cliente_telefono,
            created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.codigo,
          r.direccion,
          r.fechaRecoleccion,
          r.franjaHoraria,
          r.pesoAproximado,
          r.estadoActual,
          r.sucursal?.id || null,
          r.cliente?.nombre || null,
          r.cliente?.email || null,
          r.cliente?.telefono || null,
          new Date(r.createdAt),
          new Date(r.updatedAt),
        ],
      );

      for (const ev of r.historial) {
        // eslint-disable-next-line no-await-in-loop
        await conn.query(
          'INSERT INTO evento_historial (recoleccion_codigo, estado, fecha, descripcion) VALUES (?, ?, ?, ?)',
          [r.codigo, ev.estado, new Date(ev.fecha), ev.descripcion || null],
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.findByCodigo(r.codigo);
  }

  /**
   * Actualiza el estado de una solicitud y registra el evento en el historial
   * (transacción).
   * @param {string} codigo
   * @param {{estadoActual: string, updatedAt: string, evento: object}} cambios
   * @returns {Promise<object|null>} La solicitud actualizada o null si no existe.
   */
  async registrarCambioEstado(codigo, { estadoActual, updatedAt, evento }) {
    const conn = await this.#pool.getConnection();
    try {
      await conn.beginTransaction();

      const [res] = await conn.query(
        'UPDATE recoleccion SET estado_actual = ?, updated_at = ? WHERE UPPER(codigo) = UPPER(?)',
        [estadoActual, new Date(updatedAt), String(codigo).trim()],
      );

      if (res.affectedRows === 0) {
        await conn.rollback();
        return null;
      }

      await conn.query(
        'INSERT INTO evento_historial (recoleccion_codigo, estado, fecha, descripcion) VALUES (?, ?, ?, ?)',
        [String(codigo).trim(), evento.estado, new Date(evento.fecha), evento.descripcion || null],
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return this.findByCodigo(codigo);
  }
}

// Instancia por defecto usada por la aplicación (inyección simple).
export default new MysqlRecoleccionesRepository();
