export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        Módulo de Solicitud y Seguimiento de Recolecciones · Prueba técnica ·{' '}
        {new Date().getFullYear()}
      </div>
    </footer>
  );
}
