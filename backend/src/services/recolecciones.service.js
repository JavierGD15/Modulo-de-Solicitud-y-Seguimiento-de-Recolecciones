import AppError from '../utils/AppError.js';
import { generarCodigoSolicitud } from '../utils/codeGenerator.js';
import { ESTADOS, FLUJO_ESTADOS, FRANJAS_HORARIAS } from '../config/constants.js';
import recoleccionesRepository from '../repositories/recolecciones.repository.js';
import sucursalesRepository from '../repositories/sucursales.repository.js';
import notificationService from './notification.service.js';

/**
 * Capa de servicio: concentra la lógica de negocio de las recolecciones.
 *
 * Recibe sus dependencias por inyección (repositorios y notificador), lo que
 * facilita las pruebas unitarias y el cambio de implementación de persistencia.
 */
export class RecoleccionesService {
  #repo;
  #sucursalesRepo;
  #notifier;

  constructor(
    repo = recoleccionesRepository,
    sucursalesRepo = sucursalesRepository,
    notifier = notificationService,
  ) {
    this.#repo = repo;
    this.#sucursalesRepo = sucursalesRepo;
    this.#notifier = notifier;
  }

  /**
   * Consulta una solicitud por su código.
   * @param {string} codigo
   * @throws {AppError} 404 si no existe.
   * @returns {Promise<object>} DTO de la solicitud.
   */
  async consultarPorCodigo(codigo) {
    if (!codigo || String(codigo).trim() === '') {
      throw AppError.badRequest('Debe indicar un código de solicitud.');
    }

    const recoleccion = await this.#repo.findByCodigo(codigo);
    if (!recoleccion) {
      throw AppError.notFound(
        `No encontramos ninguna solicitud con el código "${codigo}". Verifica que esté bien escrito e inténtalo de nuevo.`,
      );
    }

    return this.#toDTO(recoleccion);
  }

  /**
   * Registra una nueva solicitud de recolección.
   * @param {object} datos Datos ya validados por el validator.
   * @throws {AppError} 400 si la franja horaria solicitada ya pasó.
   * @returns {Promise<object>} DTO de la solicitud creada.
   */
  async crearRecoleccion(datos) {
    this.#validarFranjaNoPasada(datos.fechaRecoleccion, datos.franjaHoraria);

    const sucursal = await this.#asignarSucursal(datos.direccion);
    const codigo = await this.#generarCodigoUnico();
    const ahora = new Date().toISOString();

    const estadoInicial = 'PENDIENTE_ASIGNACION';
    const nuevaRecoleccion = {
      codigo,
      direccion: datos.direccion,
      fechaRecoleccion: datos.fechaRecoleccion,
      franjaHoraria: datos.franjaHoraria,
      pesoAproximado: datos.pesoAproximado,
      estadoActual: estadoInicial,
      sucursal: { id: sucursal.id, nombre: sucursal.nombre },
      cliente: datos.cliente || { nombre: 'Cliente' },
      historial: [
        {
          estado: estadoInicial,
          etiqueta: ESTADOS[estadoInicial],
          fecha: ahora,
          descripcion: 'Solicitud registrada. En espera de asignación de recolector.',
        },
      ],
      createdAt: ahora,
      updatedAt: ahora,
    };

    const creada = await this.#repo.create(nuevaRecoleccion);

    // Notificación simulada por el cambio de estado (registro inicial).
    this.#notifier.notificarCambioEstado(creada, estadoInicial);

    return this.#toDTO(creada);
  }

  /**
   * Cambia el estado de una solicitud existente y registra el cambio en el
   * historial. (Endpoint auxiliar para demostrar la notificación simulada.)
   * @param {string} codigo
   * @param {string} nuevoEstado Clave de estado (ver ESTADOS).
   * @param {string} [descripcion]
   * @returns {Promise<object>} DTO actualizado.
   */
  async cambiarEstado(codigo, nuevoEstado, descripcion) {
    if (!ESTADOS[nuevoEstado]) {
      throw AppError.badRequest(
        `Estado inválido. Estados permitidos: ${Object.keys(ESTADOS).join(', ')}.`,
      );
    }

    const recoleccion = await this.#repo.findByCodigo(codigo);
    if (!recoleccion) {
      throw AppError.notFound(`No encontramos ninguna solicitud con el código "${codigo}".`);
    }

    if (recoleccion.estadoActual === nuevoEstado) {
      throw AppError.badRequest(`La solicitud ya se encuentra en estado "${ESTADOS[nuevoEstado]}".`);
    }

    const ahora = new Date().toISOString();
    const evento = {
      estado: nuevoEstado,
      etiqueta: ESTADOS[nuevoEstado],
      fecha: ahora,
      descripcion: descripcion || `Estado actualizado a "${ESTADOS[nuevoEstado]}".`,
    };

    const actualizada = await this.#repo.registrarCambioEstado(codigo, {
      estadoActual: nuevoEstado,
      updatedAt: ahora,
      evento,
    });

    this.#notifier.notificarCambioEstado(actualizada, nuevoEstado);

    return this.#toDTO(actualizada);
  }

  // ---------------------------------------------------------------------------
  // Helpers privados
  // ---------------------------------------------------------------------------

  /**
   * Regla de negocio: la franja horaria solicitada no puede ser anterior al
   * momento actual.
   */
  #validarFranjaNoPasada(fechaRecoleccion, franjaHoraria) {
    const franja = FRANJAS_HORARIAS[franjaHoraria];
    const inicioProgramado = new Date(`${fechaRecoleccion}T${franja.inicio}:00`);

    if (Number.isNaN(inicioProgramado.getTime())) {
      throw AppError.badRequest('No se pudo interpretar la fecha y franja horaria indicadas.');
    }

    if (inicioProgramado.getTime() < Date.now()) {
      throw AppError.badRequest(
        'La franja horaria solicitada ya pasó. Elige una fecha y hora futuras para la recolección.',
      );
    }
  }

  /**
   * Asigna una sucursal/hub: intenta hacer match con la cobertura según la
   * dirección; si no encuentra coincidencia usa el hub metropolitano.
   */
  async #asignarSucursal(direccion) {
    const sucursales = await this.#sucursalesRepo.findAll();
    const dir = direccion.toLowerCase();

    const match = sucursales.find((s) =>
      (s.cobertura || []).some((zona) => dir.includes(zona.toLowerCase())),
    );

    return match || sucursales.find((s) => s.id === 'GUA-02') || sucursales[0];
  }

  /** Genera un código garantizando que no colisione con uno existente. */
  async #generarCodigoUnico() {
    let codigo;
    let existe = true;
    let intentos = 0;
    do {
      codigo = generarCodigoSolicitud();
      existe = Boolean(await this.#repo.findByCodigo(codigo));
      intentos += 1;
    } while (existe && intentos < 5);
    return codigo;
  }

  /**
   * Convierte el modelo de almacenamiento en el DTO que consume el frontend,
   * enriqueciéndolo con etiquetas legibles y el catálogo de estados del flujo.
   */
  #toDTO(recoleccion) {
    const franja = FRANJAS_HORARIAS[recoleccion.franjaHoraria];
    return {
      codigo: recoleccion.codigo,
      direccion: recoleccion.direccion,
      fechaRecoleccion: recoleccion.fechaRecoleccion,
      franjaHoraria: recoleccion.franjaHoraria,
      franjaHorariaEtiqueta: franja ? franja.etiqueta : recoleccion.franjaHoraria,
      pesoAproximado: recoleccion.pesoAproximado,
      estadoActual: recoleccion.estadoActual,
      estadoActualEtiqueta: ESTADOS[recoleccion.estadoActual] || recoleccion.estadoActual,
      sucursal: recoleccion.sucursal,
      cliente: recoleccion.cliente,
      historial: recoleccion.historial,
      flujoEstados: FLUJO_ESTADOS.map((estado) => ({ estado, etiqueta: ESTADOS[estado] })),
      createdAt: recoleccion.createdAt,
      updatedAt: recoleccion.updatedAt,
    };
  }
}

export default new RecoleccionesService();
