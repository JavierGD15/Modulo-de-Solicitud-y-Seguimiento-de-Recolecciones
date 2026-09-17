import { createApp } from './app.js';
import env from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   API de Recolecciones — Cargo Express (prueba técnica)  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`  Entorno:   ${env.nodeEnv}`);
  console.log(`  Servidor:  http://localhost:${env.port}`);
  console.log(`  Health:    http://localhost:${env.port}/health`);
  console.log(`  API:       http://localhost:${env.port}/api/recolecciones`);
  console.log('  (Recuerda enviar el header x-api-key en cada petición)\n');
});
