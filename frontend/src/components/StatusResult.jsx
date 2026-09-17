import Timeline from './Timeline.jsx';

const fmtFechaLarga = (iso) =>
  new Date(iso).toLocaleString('es-GT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Muestra el detalle de una solicitud consultada.
 * @param {{recoleccion: object}} props
 */
export default function StatusResult({ recoleccion }) {
  return (
    <div>
      <div className="result__top">
        <span className="codigo-pill">{recoleccion.codigo}</span>
        <span className={`badge-estado estado--${recoleccion.estadoActual}`}>
          {recoleccion.estadoActualEtiqueta}
        </span>
      </div>

      <div className="result__meta">
        <div className="meta-item">
          <span>Sucursal / Hub asignado</span>
          <strong>{recoleccion.sucursal?.nombre || 'Por asignar'}</strong>
        </div>
        <div className="meta-item">
          <span>Fecha y franja</span>
          <strong>
            {recoleccion.fechaRecoleccion} · {recoleccion.franjaHorariaEtiqueta}
          </strong>
        </div>
        <div className="meta-item">
          <span>Dirección</span>
          <strong>{recoleccion.direccion}</strong>
        </div>
        <div className="meta-item">
          <span>Peso aproximado</span>
          <strong>{recoleccion.pesoAproximado} kg</strong>
        </div>
      </div>

      <Timeline recoleccion={recoleccion} />

      <div className="historial">
        <h4>Historial de estados</h4>
        {[...recoleccion.historial]
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .map((ev, i) => (
            <div className="historial__item" key={`${ev.estado}-${i}`}>
              <div className="historial__marker" aria-hidden="true" />
              <div>
                <div className="historial__estado">{ev.etiqueta}</div>
                <div className="historial__fecha">{fmtFechaLarga(ev.fecha)}</div>
                {ev.descripcion && <div className="historial__desc">{ev.descripcion}</div>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
