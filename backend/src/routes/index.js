import { Router } from 'express';
import recoleccionesRoutes from './recolecciones.routes.js';

const router = Router();

router.use('/recolecciones', recoleccionesRoutes);

export default router;
