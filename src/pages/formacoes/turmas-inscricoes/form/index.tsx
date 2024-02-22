import { useParams } from 'react-router-dom';

const FormCadastrosInscricoes: React.FC = () => {
  const paramsRoute = useParams();
  const id = paramsRoute?.id || 0;
  return <>{id}</>;
};

export default FormCadastrosInscricoes;
