import { useOutletContext, useParams } from 'react-router-dom';
import TrackSearch from '../components/TrackSearch.jsx';

export default function ConsultarPage() {
  const { notify } = useOutletContext();
  const { codigo } = useParams();

  return (
    <div className="page page--narrow">
      <TrackSearch codigoInicial={codigo || ''} notify={notify} />
    </div>
  );
}
