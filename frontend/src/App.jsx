import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import SolicitarPage from './pages/SolicitarPage.jsx';
import ConsultarPage from './pages/ConsultarPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/solicitar" element={<SolicitarPage />} />
          <Route path="/consultar" element={<ConsultarPage />} />
          <Route path="/consultar/:codigo" element={<ConsultarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
