import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'recolecciones.json');

/**
 * Repositorio de solicitudes de recolección respaldado por un archivo JSON.
 *
 * Implementa el patrón Repository: expone una interfaz de persistencia
 * (`findAll`, `findByCodigo`, `create`, `update`) independiente del motor de
 * almacenamiento. Para migrar a MySQL/SQL Server bastaría con crear otra clase
 * que exponga estos mismos métodos e inyectarla en el service, sin modificar la
 * lógica de negocio.
 */
export class JsonRecoleccionesRepository {
  #dataFile;

  constructor(dataFile = DATA_FILE) {
    this.#dataFile = dataFile;
  }

  /** Lee y parsea el archivo JSON completo. */
  async #read() {
    const raw = await readFile(this.#dataFile, 'utf-8');
    return JSON.parse(raw);
  }

  /** Persiste el arreglo completo en disco (formateado). */
  async #write(recolecciones) {
    await writeFile(this.#dataFile, `${JSON.stringify(recolecciones, null, 2)}\n`, 'utf-8');
  }

  /** @returns {Promise<Array>} Todas las solicitudes. */
  async findAll() {
    return this.#read();
  }

  /**
   * Busca una solicitud por su código (case-insensitive).
   * @param {string} codigo
   * @returns {Promise<object|null>}
   */
  async findByCodigo(codigo) {
    const recolecciones = await this.#read();
    const objetivo = String(codigo).trim().toUpperCase();
    return recolecciones.find((r) => r.codigo.toUpperCase() === objetivo) || null;
  }

  /**
   * Inserta una nueva solicitud.
   * @param {object} recoleccion
   * @returns {Promise<object>} La solicitud creada.
   */
  async create(recoleccion) {
    const recolecciones = await this.#read();
    recolecciones.push(recoleccion);
    await this.#write(recolecciones);
    return recoleccion;
  }

  /**
   * Actualiza una solicitud existente identificada por su código.
   * @param {string} codigo
   * @param {object} cambios
   * @returns {Promise<object|null>} La solicitud actualizada o null si no existe.
   */
  async update(codigo, cambios) {
    const recolecciones = await this.#read();
    const idx = recolecciones.findIndex(
      (r) => r.codigo.toUpperCase() === String(codigo).trim().toUpperCase(),
    );
    if (idx === -1) return null;

    recolecciones[idx] = { ...recolecciones[idx], ...cambios };
    await this.#write(recolecciones);
    return recolecciones[idx];
  }
}

// Instancia por defecto usada por la aplicación (inyección simple).
export default new JsonRecoleccionesRepository();
