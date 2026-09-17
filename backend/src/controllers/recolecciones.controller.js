import asyncHandler from '../utils/asyncHandler.js';
import { validarCrearRecoleccion } from '../validators/recolecciones.validator.js';
import recoleccionesService from '../services/recolecciones.service.js';

/**
 * Capa de controladores: adapta HTTP <-> lógica de negocio.
 * No contiene reglas de negocio; delega en el service y da forma a la respuesta.
 */
export class RecoleccionesController {
  #service;

  constructor(service = recoleccionesService) {
    this.#service = service;
  }

  /** POST /api/recolecciones */
  crear = asyncHandler(async (req, res) => {
    const datos = validarCrearRecoleccion(req.body);
    const recoleccion = await this.#service.crearRecoleccion(datos);

    res.status(201).json({
      success: true,
      message: 'Solicitud de recolección registrada correctamente.',
      data: recoleccion,
    });
  });

  /** GET /api/recolecciones/:codigo */
  consultar = asyncHandler(async (req, res) => {
    const recoleccion = await this.#service.consultarPorCodigo(req.params.codigo);

    res.status(200).json({
      success: true,
      data: recoleccion,
    });
  });

  /** PATCH /api/recolecciones/:codigo/estado (auxiliar) */
  cambiarEstado = asyncHandler(async (req, res) => {
    const { estado, descripcion } = req.body;
    const recoleccion = await this.#service.cambiarEstado(req.params.codigo, estado, descripcion);

    res.status(200).json({
      success: true,
      message: `Estado actualizado a "${recoleccion.estadoActualEtiqueta}".`,
      data: recoleccion,
    });
  });
}

export default new RecoleccionesController();
