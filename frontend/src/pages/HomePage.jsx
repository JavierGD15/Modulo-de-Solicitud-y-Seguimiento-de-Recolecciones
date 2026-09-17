import { Link } from 'react-router-dom';

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
    </div>
  );
}
