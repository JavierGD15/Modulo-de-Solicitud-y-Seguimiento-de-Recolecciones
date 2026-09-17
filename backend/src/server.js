import { createApp } from './app.js';
import env from './config/env.js';
import { waitForDb } from './config/db.js';

async function bootstrap() {
  // Espera a que MySQL acepte conexiones (importante en Docker).
  await waitForDb();

  const app = createApp();

  app.listen(env.port, () => {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   API de Recolecciones — Cargo Express (prueba técnica)  ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`  Entorno:   ${env.nodeEnv}`);
    console.log(`  BD:        mysql://${env.db.host}:${env.db.port}/${env.db.name}`);
    console.log(`  Servidor:  http://localhost:${env.port}`);
    console.log(`  Health:    http://localhost:${env.port}/health`);
    console.log(`  API:       http://localhost:${env.port}/api/recolecciones`);
    console.log(`  Swagger:   http://localhost:${env.port}/api-docs`);
    console.log('  (Recuerda enviar el header x-api-key en cada petición)\n');
  });
}

bootstrap().catch((err) => {
  console.error('No se pudo iniciar el servidor:', err.message);
  process.exit(1);
});
