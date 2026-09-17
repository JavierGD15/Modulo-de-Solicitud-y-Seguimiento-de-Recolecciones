import { Router } from 'express';
import recoleccionesController from '../controllers/recolecciones.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';

const router = Router();

// Todas las rutas de recolecciones requieren API Key.
router.use(apiKeyMiddleware);

/**
 * @openapi
 * /api/recolecciones:
 *   post:
 *     tags: [Recolecciones]
 *     summary: Registra una nueva solicitud de recolección
 *     description: >
 *       Crea una solicitud, le asigna una sucursal/hub automáticamente y devuelve
 *       un código único de seguimiento. Rechaza (400) si la franja horaria ya pasó
 *       o si los datos son inválidos.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearRecoleccionRequest'
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recoleccion' }
 *       400:
 *         description: Datos inválidos o franja horaria ya pasada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: API Key ausente o inválida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', recoleccionesController.crear);

/**
 * @openapi
 * /api/recolecciones/{codigo}:
 *   get:
 *     tags: [Recolecciones]
 *     summary: Consulta el estado de una solicitud
 *     description: Devuelve estado actual, sucursal asignada e historial cronológico.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema: { type: string }
 *         example: REC-2026-CARGO001
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Recoleccion' }
 *       401:
 *         description: API Key ausente o inválida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: No existe una solicitud con ese código
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get('/:codigo', recoleccionesController.consultar);

/**
 * @openapi
 * /api/recolecciones/{codigo}/estado:
 *   patch:
 *     tags: [Recolecciones]
 *     summary: Cambia el estado de una solicitud (auxiliar)
 *     description: >
 *       Actualiza el estado, lo agrega al historial y dispara la notificación
 *       simulada (email/SMS en consola).
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema: { type: string }
 *         example: REC-2026-CARGO001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CambiarEstadoRequest'
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recoleccion' }
 *       400:
 *         description: Estado inválido o sin cambios
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       401:
 *         description: API Key ausente o inválida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: No existe una solicitud con ese código
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.patch('/:codigo/estado', recoleccionesController.cambiarEstado);

export default router;
