import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import RequestForm from './components/RequestForm.jsx';
import TrackSearch from './components/TrackSearch.jsx';
import ToastContainer from './components/Toast.jsx';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [codigoConsulta, setCodigoConsulta] = useState('');

  const notify = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cuando se registra una solicitud, se envía su código al buscador.
  const handleCreated = useCallback((codigo) => {
    setCodigoConsulta(codigo);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Header />
      <main className="app-main">
        <div className="container grid-2">
          <RequestForm onCreated={handleCreated} notify={notify} />
          <TrackSearch codigoInicial={codigoConsulta} notify={notify} />
        </div>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
