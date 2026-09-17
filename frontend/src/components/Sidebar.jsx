import { NavLink } from 'react-router-dom';

const NAV = [
  {
    to: '/',
    label: 'Inicio',
    end: true,
    icon: (
      <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    ),
  },
  {
    to: '/solicitar',
    label: 'Solicitar recolección',
    icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  },
  {
    to: '/consultar',
    label: 'Consultar solicitud',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </>
    ),
  },
];

/**
 * Barra lateral de navegación.
 * @param {{open: boolean, onNavigate: Function}} props
 */
export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <svg className="sidebar__logo" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="12" fill="#d32027" />
          <path
            d="M32 12 54 24v16L32 52 10 40V24z"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M10 24l22 12 22-12M32 36v16"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <strong>Cargo Express</strong>
          <span>Recolecciones</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__badge">Portal de autoservicio</span>
      </div>
    </aside>
  );
}
