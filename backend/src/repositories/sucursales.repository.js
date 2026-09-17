import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'sucursales.json');

/**
 * Repositorio de sucursales/hubs (solo lectura).
 * Se usa para asignar automáticamente una sucursal a cada nueva solicitud.
 */
export class JsonSucursalesRepository {
  #dataFile;

  constructor(dataFile = DATA_FILE) {
    this.#dataFile = dataFile;
  }

  async findAll() {
    const raw = await readFile(this.#dataFile, 'utf-8');
    return JSON.parse(raw);
  }
}

export default new JsonSucursalesRepository();
