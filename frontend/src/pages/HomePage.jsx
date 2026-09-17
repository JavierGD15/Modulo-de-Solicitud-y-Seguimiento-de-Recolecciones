import { Link } from 'react-router-dom';

const CODIGOS_DEMO = [
  { codigo: 'REC-2026-CARGO002', estado: 'Recolector en Camino' },
  { codigo: 'REC-2026-CARGO003', estado: 'Recolectado' },
  { codigo: 'REC-2026-CARGO004', estado: 'Cancelada' },
];

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <h2>Bienvenido al portal de recolecciones</h2>
        <p>
          Solicita la recolección de tus paquetes a domicilio u oficina y da
          seguimiento al estado de tu solicitud en tiempo real.
        </p>
      </section>

      <div className="home-actions">
        <Link to="/solicitar" className="action-card">
          <div className="action-card__icon action-card__icon--red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Solicitar recolección</h3>
          <p>Agenda una nueva recolección indicando dirección, fecha y peso.</p>
          <span className="action-card__cta">Comenzar →</span>
        </Link>

        <Link to="/consultar" className="action-card">
          <div className="action-card__icon action-card__icon--navy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Consultar solicitud</h3>
          <p>Consulta el estado, la sucursal asignada y el historial por código.</p>
          <span className="action-card__cta">Consultar →</span>
        </Link>
      </div>

      <section className="card" style={{ marginTop: 4 }}>
        <h3 style={{ fontSize: '1rem' }}>Códigos de ejemplo para probar</h3>
        <p className="card__subtitle" style={{ marginBottom: 12 }}>
          Usa estos códigos precargados en la pantalla de consulta.
        </p>
        <div className="demo-codes">
          {CODIGOS_DEMO.map((d) => (
            <Link key={d.codigo} to={`/consultar/${d.codigo}`} className="demo-code">
              <span className="demo-code__code">{d.codigo}</span>
              <span className="demo-code__estado">{d.estado}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
