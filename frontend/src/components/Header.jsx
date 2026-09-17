export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <svg className="header__logo" viewBox="0 0 64 64" aria-hidden="true">
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
        <div className="header__titles">
          <h1>Recolecciones a domicilio</h1>
          <p>Portal de autoservicio · Cargo Express</p>
        </div>
        <span className="header__badge">Paquetería</span>
      </div>
    </header>
  );
}
