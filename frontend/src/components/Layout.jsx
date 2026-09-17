import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ToastContainer from './Toast.jsx';

/**
 * Estructura general de la aplicación: sidebar de navegación + área de contenido.
 * Provee la función `notify` a las páginas mediante el contexto del Outlet.
 */
export default function Layout() {
  const [toasts, setToasts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const notify = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const titulos = {
    '/': 'Inicio',
    '/solicitar': 'Solicitar recolección',
    '/consultar': 'Consultar solicitud',
  };
  const tituloActual =
    titulos[location.pathname] ||
    (location.pathname.startsWith('/consultar') ? 'Consultar solicitud' : 'Recolecciones');

  return (
    <div className="layout">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      {/* Backdrop para cerrar el menú en móvil */}
      {menuOpen && <div className="layout__backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="layout__main">
        {/* Barra superior (visible en móvil para abrir el menú) */}
        <header className="topbar">
          <button
            type="button"
            className="topbar__menu"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <h1 className="topbar__title">{tituloActual}</h1>
        </header>

        <main className="content">
          <Outlet context={{ notify }} />
        </main>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
