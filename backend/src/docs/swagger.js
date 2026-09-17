import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import env from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Definición base de la especificación OpenAPI 3.0.
 * Los esquemas y endpoints concretos se documentan con anotaciones @openapi
 * en los archivos de rutas (ver ../routes/recolecciones.routes.js).
 */
const definition = {
  openapi: '3.0.3',
  info: {
    title: 'API de Recolecciones — Cargo Express',
    version: '1.0.0',
    description:
      'API REST para registrar y dar seguimiento a solicitudes de recolección de paquetería. ' +
      'Todos los endpoints bajo /api requieren el header **x-api-key**.',
    contact: { name: 'JavierGD15' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: `http://localhost:${env.port}`, description: 'Servidor local' },
  ],
  tags: [
    { name: 'Recolecciones', description: 'Registro y seguimiento de solicitudes' },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Clave de acceso a la API (variable de entorno API_KEY).',
      },
    },
    schemas: {
      EventoHistorial: {
        type: 'object',
        properties: {
          estado: { type: 'string', example: 'PENDIENTE_ASIGNACION' },
          etiqueta: { type: 'string', example: 'Pendiente de Asignación' },
          fecha: { type: 'string', format: 'date-time', example: '2026-09-17T09:15:00.000Z' },
          descripcion: { type: 'string', example: 'Solicitud registrada.' },
        },
      },
      Sucursal: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'MIX-01' },
          nombre: { type: 'string', example: 'Sucursal Central Mixco' },
        },
      },
      Cliente: {
        type: 'object',
        properties: {
          nombre: { type: 'string', example: 'María López' },
          email: { type: 'string', format: 'email', example: 'maria.lopez@example.com' },
          telefono: { type: 'string', example: '+502 5555-1001' },
        },
      },
      Recoleccion: {
        type: 'object',
        properties: {
          codigo: { type: 'string', example: 'REC-2026-CARGO001' },
          direccion: { type: 'string', example: '5a Avenida 12-34, Zona 1, Ciudad de Guatemala' },
          fechaRecoleccion: { type: 'string', format: 'date', example: '2026-09-18' },
          franjaHoraria: { type: 'string', example: '08:00-12:00' },
          franjaHorariaEtiqueta: { type: 'string', example: 'Mañana (08:00 - 12:00)' },
          pesoAproximado: { type: 'number', example: 3.5 },
          estadoActual: { type: 'string', example: 'PENDIENTE_ASIGNACION' },
          estadoActualEtiqueta: { type: 'string', example: 'Pendiente de Asignación' },
          sucursal: { $ref: '#/components/schemas/Sucursal' },
          cliente: { $ref: '#/components/schemas/Cliente' },
          historial: {
            type: 'array',
            items: { $ref: '#/components/schemas/EventoHistorial' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CrearRecoleccionRequest: {
        type: 'object',
        required: ['direccion', 'fechaRecoleccion', 'franjaHoraria', 'pesoAproximado'],
        properties: {
          direccion: { type: 'string', example: '7a Avenida 1-01, Zona 9, Guatemala' },
          fechaRecoleccion: { type: 'string', format: 'date', example: '2026-12-20' },
          franjaHoraria: {
            type: 'string',
            enum: ['08:00-12:00', '12:00-16:00', '16:00-20:00'],
            example: '08:00-12:00',
          },
          pesoAproximado: { type: 'number', minimum: 0.01, example: 4.2 },
          cliente: { $ref: '#/components/schemas/Cliente' },
        },
      },
      CambiarEstadoRequest: {
        type: 'object',
        required: ['estado'],
        properties: {
          estado: {
            type: 'string',
            enum: ['PENDIENTE_ASIGNACION', 'RECOLECTOR_EN_CAMINO', 'RECOLECTADO', 'CANCELADA'],
            example: 'RECOLECTOR_EN_CAMINO',
          },
          descripcion: { type: 'string', example: 'Recolector asignado.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'No encontramos ninguna solicitud con ese código.' },
              details: { type: 'object', nullable: true },
            },
          },
        },
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
};

const options = {
  definition,
  // Rutas de los archivos con anotaciones @openapi
  apis: [path.join(__dirname, '..', 'routes', '*.js')],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
