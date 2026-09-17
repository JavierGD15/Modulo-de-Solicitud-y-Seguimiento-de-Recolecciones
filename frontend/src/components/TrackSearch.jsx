import { useState, useEffect, useCallback } from 'react';
import { consultarRecoleccion } from '../api/recoleccionesApi.js';
import StatusResult from './StatusResult.jsx';

/**
 * Buscador por código de solicitud + visualización del resultado.
 * @param {{codigoInicial?: string, notify: Function}} props
 */
export default function TrackSearch({ codigoInicial = '', notify }) {
  const [codigo, setCodigo] = useState(codigoInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [recoleccion, setRecoleccion] = useState(null);

  const buscar = useCallback(
    async (valor) => {
      const cod = (valor ?? codigo).trim();
      if (!cod) {
        setError('Ingresa un código de solicitud.');
        return;
      }
      setCargando(true);
      setError(null);
      setRecoleccion(null);
      try {
        const resp = await consultarRecoleccion(cod);
        setRecoleccion(resp.data);
      } catch (err) {
        setError(err.message);
        if (err.status !== 404) {
          notify?.({ type: 'error', title: 'Error al consultar', message: err.message });
        }
      } finally {
        setCargando(false);
      }
    },
    [codigo, notify],
  );

  // Si llega un código desde el formulario (tras registrar), busca automáticamente.
  useEffect(() => {
    if (codigoInicial) {
      setCodigo(codigoInicial);
      buscar(codigoInicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoInicial]);

  function handleSubmit(e) {
    e.preventDefault();
    buscar();
  }

  return (
    <section className="card">
      <div className="card__header">
        <div className="card__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="card__title">Consultar solicitud</h2>
          <p className="card__subtitle">Ingresa tu código de seguimiento (ej. REC-2026-CARGO001).</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="codigo">Código de solicitud</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="codigo"
              className="input"
              placeholder="REC-2026-XXXXXXXX"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="btn btn--navy" disabled={cargando} style={{ flex: '0 0 auto' }}>
              {cargando ? <span className="spinner" /> : null}
              {cargando ? 'Buscando…' : 'Consultar'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert--error">
          <strong>No encontramos la solicitud</strong>
          {error}
        </div>
      )}

      {recoleccion ? (
        <StatusResult recoleccion={recoleccion} />
      ) : (
        !error &&
        !cargando && (
          <div className="empty-state">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
              <path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round" />
            </svg>
            <p>Consulta el estado, la sucursal asignada y el historial de tu recolección.</p>
          </div>
        )
      )}
    </section>
  );
}
