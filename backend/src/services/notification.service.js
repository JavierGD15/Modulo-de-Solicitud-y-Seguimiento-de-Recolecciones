import { ESTADOS } from '../config/constants.js';

/**
 * Servicio de notificaciones SIMULADO.
 *
 * En un sistema real esto integraría un proveedor de correo (SendGrid, SES) o
 * de SMS (Twilio). Para la prueba técnica únicamente se imprime en consola un
 * mensaje que simula el envío al cliente cada vez que cambia el estado de una
 * solicitud.
 */
class NotificationService {
  /**
   * Notifica al cliente el cambio de estado de su solicitud.
   * @param {object} recoleccion  Solicitud afectada.
   * @param {string} nuevoEstado  Clave del nuevo estado (ver ESTADOS).
   */
  notificarCambioEstado(recoleccion, nuevoEstado) {
    const etiqueta = ESTADOS[nuevoEstado] || nuevoEstado;
    const destinatario = recoleccion?.cliente?.email || 'cliente@sin-correo.com';
    const telefono = recoleccion?.cliente?.telefono || 'N/D';
    const timestamp = new Date().toISOString();

    // Simulación de correo electrónico
    console.log('\n──────────────── 📧 NOTIFICACIÓN (EMAIL SIMULADO) ────────────────');
    console.log(`  Para:     ${destinatario}`);
    console.log(`  Asunto:   Actualización de tu recolección ${recoleccion.codigo}`);
    console.log(`  Mensaje:  Hola ${recoleccion?.cliente?.nombre || 'cliente'}, tu solicitud`);
    console.log(`            ${recoleccion.codigo} cambió al estado: "${etiqueta}".`);
    console.log(`  Enviado:  ${timestamp}`);

    // Simulación de SMS
    console.log('  ── SMS ──');
    console.log(`  A ${telefono}: Cargo Express | ${recoleccion.codigo} ahora está "${etiqueta}".`);
    console.log('───────────────────────────────────────────────────────────────────\n');
  }
}

export default new NotificationService();
