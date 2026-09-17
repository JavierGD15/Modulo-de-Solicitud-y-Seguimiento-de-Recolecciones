import { useEffect } from 'react';

/**
 * Contenedor de notificaciones tipo "toast".
 * @param {{toasts: Array, onDismiss: Function}} props
 */
export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast--${toast.type || 'info'}`} role="status">
      <strong>{toast.title}</strong>
      {toast.message && <p>{toast.message}</p>}
    </div>
  );
}
