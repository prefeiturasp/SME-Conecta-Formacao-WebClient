import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PagNotFound = () => {
  const navigate = useNavigate();
  const voltar = () => navigate('/');

  return (
    <Result
      status='404'
      title='404'
      subTitle='Desculpe, a página que você visitou não existe.'
      extra={
        <Button type='primary' onClick={() => voltar()}>
          Voltar
        </Button>
      }
    />
  );
};

export default PagNotFound;
