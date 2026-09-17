const fmtFecha = (iso) =>
  new Date(iso).toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Línea de tiempo horizontal del flujo de estados de una solicitud.
 * Marca los estados completados, resalta el actual y atenúa los pendientes.
 *
 * @param {{recoleccion: object}} props
 */
export default function Timeline({ recoleccion }) {
  const { flujoEstados = [], historial = [], estadoActual } = recoleccion;
  const cancelada = estadoActual === 'CANCELADA';

  // Fecha del primer evento registrado para cada estado del flujo.
  const fechaPorEstado = historial.reduce((acc, ev) => {
    if (!acc[ev.estado]) acc[ev.estado] = ev.fecha;
    return acc;
  }, {});

  const currentIndex = flujoEstados.findIndex((s) => s.estado === estadoActual);

  return (
    <div className="timeline-wrap">
      <h3>Seguimiento de la solicitud</h3>

      <div className="timeline" role="list">
        {flujoEstados.map((step, idx) => {
          const alcanzado = Boolean(fechaPorEstado[step.estado]);
          let clase = '';
          if (!cancelada && idx < currentIndex) clase = 'is-done';
          if (!cancelada && idx === currentIndex) clase = 'is-current';
          if (cancelada && alcanzado) clase = 'is-done';

          return (
            <div className={`timeline__step ${clase}`} role="listitem" key={step.estado}>
              <div className="timeline__dot" aria-hidden="true">
                {clase === 'is-done' ? '✓' : idx + 1}
              </div>
              <div className="timeline__label">{step.etiqueta}</div>
              {fechaPorEstado[step.estado] && (
                <div className="timeline__date">{fmtFecha(fechaPorEstado[step.estado])}</div>
              )}
              {clase === 'is-current' && <span className="timeline__badge">Estado actual</span>}
            </div>
          );
        })}
      </div>

      {cancelada && (
        <div className="cancelada-banner">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
          </svg>
          <div>
            <strong>Solicitud cancelada</strong>
            {fechaPorEstado.CANCELADA && (
              <div style={{ fontSize: '0.8rem' }}>El {fmtFecha(fechaPorEstado.CANCELADA)}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
