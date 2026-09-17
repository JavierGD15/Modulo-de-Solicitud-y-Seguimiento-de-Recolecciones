import { useOutletContext, useNavigate } from 'react-router-dom';
import RequestForm from '../components/RequestForm.jsx';

export default function SolicitarPage() {
  const { notify } = useOutletContext();
  const navigate = useNavigate();

  // Al registrar, se lleva al usuario a la pantalla de consulta con su código.
  const handleCreated = (codigo) => {
    navigate(`/consultar/${codigo}`);
  };

  return (
    <div className="page page--narrow">
      <RequestForm onCreated={handleCreated} notify={notify} />
    </div>
  );
}
