import { useState } from 'react';
import { crearRecoleccion } from '../api/recoleccionesApi.js';

const FRANJAS = [
  { value: '08:00-12:00', label: 'Mañana (08:00 - 12:00)' },
  { value: '12:00-16:00', label: 'Tarde (12:00 - 16:00)' },
  { value: '16:00-20:00', label: 'Noche (16:00 - 20:00)' },
];

const ESTADO_INICIAL = {
  direccion: '',
  fechaRecoleccion: '',
  franjaHoraria: '',
  pesoAproximado: '',
  nombre: '',
  email: '',
  telefono: '',
};

const hoyISO = () => new Date().toISOString().split('T')[0];

/**
 * Formulario para registrar una nueva solicitud de recolección.
 * @param {{onCreated: Function, notify: Function}} props
 */
export default function RequestForm({ onCreated, notify }) {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errorServidor, setErrorServidor] = useState(null);

  const setCampo = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  /** Validación en cliente (espeja las reglas del backend). */
  function validar() {
    const errs = {};
    if (!form.direccion.trim()) {
      errs.direccion = 'La dirección es obligatoria.';
    }
    if (!form.fechaRecoleccion) {
      errs.fechaRecoleccion = 'Selecciona una fecha.';
    } else if (form.fechaRecoleccion < hoyISO()) {
      errs.fechaRecoleccion = 'La fecha no puede ser anterior a hoy.';
    }
    if (!form.franjaHoraria) {
      errs.franjaHoraria = 'Selecciona una franja horaria.';
    }
    const peso = Number(form.pesoAproximado);
    if (form.pesoAproximado === '') {
      errs.pesoAproximado = 'Ingresa el peso aproximado.';
    } else if (Number.isNaN(peso)) {
      errs.pesoAproximado = 'El peso debe ser numérico.';
    } else if (peso <= 0) {
      errs.pesoAproximado = 'El peso debe ser mayor a 0.';
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      errs.email = 'Correo electrónico inválido.';
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setResultado(null);
    setErrorServidor(null);
    if (!validar()) return;

    setEnviando(true);
    try {
      const payload = {
        direccion: form.direccion.trim(),
        fechaRecoleccion: form.fechaRecoleccion,
        franjaHoraria: form.franjaHoraria,
        pesoAproximado: Number(form.pesoAproximado),
      };
      if (form.nombre.trim() || form.email.trim() || form.telefono.trim()) {
        payload.cliente = {
          nombre: form.nombre.trim() || undefined,
          email: form.email.trim() || undefined,
          telefono: form.telefono.trim() || undefined,
        };
      }

      const resp = await crearRecoleccion(payload);
      setResultado(resp.data);
      setForm(ESTADO_INICIAL);
      notify?.({
        type: 'success',
        title: 'Solicitud registrada',
        message: `Código: ${resp.data.codigo}`,
      });
    } catch (err) {
      // Errores de validación campo por campo enviados por el backend
      if (err.details && typeof err.details === 'object') {
        setErrores(err.details);
      }
      setErrorServidor(err.message);
      notify?.({ type: 'error', title: 'No se pudo registrar', message: err.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="card">
      <div className="card__header">
        <div className="card__icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="card__title">Solicitar recolección</h2>
          <p className="card__subtitle">Agenda la recolección de tu paquete a domicilio.</p>
        </div>
      </div>

      {resultado && (
        <div className="alert alert--success">
          <strong>¡Solicitud registrada correctamente!</strong>
          Guarda tu código de seguimiento:
          <div style={{ marginTop: 8 }}>
            <span className="codigo-pill">
              {resultado.codigo}
              <button
                type="button"
                title="Copiar código"
                onClick={() => {
                  navigator.clipboard?.writeText(resultado.codigo);
                  notify?.({ type: 'success', title: 'Código copiado' });
                }}
              >
                ⧉
              </button>
            </span>
          </div>
          <button
            type="button"
            className="btn btn--navy"
            style={{ marginTop: 12 }}
            onClick={() => onCreated?.(resultado.codigo)}
          >
            Consultar esta solicitud →
          </button>
        </div>
      )}

      {errorServidor && !resultado && (
        <div className="alert alert--error">
          <strong>No se pudo registrar la solicitud</strong>
          {errorServidor}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={`field ${errores.direccion ? 'field--error' : ''}`}>
          <label htmlFor="direccion">
            Dirección de recolección <span className="required">*</span>
          </label>
          <textarea
            id="direccion"
            className="textarea"
            placeholder="Ej. 5a Avenida 12-34, Zona 1, Ciudad de Guatemala"
            value={form.direccion}
            onChange={setCampo('direccion')}
          />
          {errores.direccion && <div className="field__error">{errores.direccion}</div>}
        </div>

        <div className="row-2">
          <div className={`field ${errores.fechaRecoleccion ? 'field--error' : ''}`}>
            <label htmlFor="fecha">
              Fecha <span className="required">*</span>
            </label>
            <input
              id="fecha"
              type="date"
              className="input"
              min={hoyISO()}
              value={form.fechaRecoleccion}
              onChange={setCampo('fechaRecoleccion')}
            />
            {errores.fechaRecoleccion && (
              <div className="field__error">{errores.fechaRecoleccion}</div>
            )}
          </div>

          <div className={`field ${errores.franjaHoraria ? 'field--error' : ''}`}>
            <label htmlFor="franja">
              Franja horaria <span className="required">*</span>
            </label>
            <select
              id="franja"
              className="select"
              value={form.franjaHoraria}
              onChange={setCampo('franjaHoraria')}
            >
              <option value="">Selecciona…</option>
              {FRANJAS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            {errores.franjaHoraria && (
              <div className="field__error">{errores.franjaHoraria}</div>
            )}
          </div>
        </div>

        <div className={`field ${errores.pesoAproximado ? 'field--error' : ''}`}>
          <label htmlFor="peso">
            Peso aproximado (kg) <span className="required">*</span>
          </label>
          <input
            id="peso"
            type="number"
            step="0.1"
            min="0.1"
            className="input"
            placeholder="Ej. 3.5"
            value={form.pesoAproximado}
            onChange={setCampo('pesoAproximado')}
          />
          {errores.pesoAproximado && (
            <div className="field__error">{errores.pesoAproximado}</div>
          )}
        </div>

        <details style={{ margin: '4px 0 16px' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-blue)' }}>
            Datos de contacto (opcional)
          </summary>
          <div style={{ marginTop: 12 }}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                className="input"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={setCampo('nombre')}
              />
            </div>
            <div className="row-2">
              <div className={`field ${errores.email ? 'field--error' : ''}`}>
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={setCampo('email')}
                />
                {errores.email && <div className="field__error">{errores.email}</div>}
              </div>
              <div className="field">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  id="telefono"
                  className="input"
                  placeholder="+502 5555-5555"
                  value={form.telefono}
                  onChange={setCampo('telefono')}
                />
              </div>
            </div>
          </div>
        </details>

        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? <span className="spinner" /> : null}
          {enviando ? 'Registrando…' : 'Registrar solicitud'}
        </button>
      </form>
    </section>
  );
}
