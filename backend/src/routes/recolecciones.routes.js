import { Router } from 'express';
import recoleccionesController from '../controllers/recolecciones.controller.js';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';

const router = Router();

// Todas las rutas de recolecciones requieren API Key.
router.use(apiKeyMiddleware);

router.post('/', recoleccionesController.crear);
router.get('/:codigo', recoleccionesController.consultar);
router.patch('/:codigo/estado', recoleccionesController.cambiarEstado);

export default router;
