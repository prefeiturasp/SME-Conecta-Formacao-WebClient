import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';

const PageForbidden = () => {
  const navigate = useNavigate();
  const voltar = () => navigate(ROUTES.PRINCIPAL);

  return (
    <Result
      status='403'
      title='403'
      subTitle='Você não tem permissão a esta funcionalidade!'
      extra={
        <Button type='primary' onClick={() => voltar()}>
          Voltar
        </Button>
      }
    />
  );
};

export default PageForbidden;
