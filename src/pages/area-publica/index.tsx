import { FC } from 'react';
import FiltroAreaPublica from './components/filtro';
import { useForm } from 'antd/es/form/Form';
import HeaderAreaPublica from './components/header';
import { Form, Row } from 'antd';

const AreaPublica: FC = () => {
  const buscarInformacoes = () => {
    // Alinhar com o back DTO para enviar na API
    const dtoParaEnviarNoEndpoint = {
      areaPromotora,
      data,
      formato,
      palavrasChaves,
      publicosAlvo,
      titulo,
    };
    // console para verificar se o DTO esta sendo montado certo , remover depois
    console.log(dtoParaEnviarNoEndpoint);
  };
  const [formAreaPublica] = useForm();
  const areaPromotora = Form.useWatch('areaPromotora', formAreaPublica);
  const data = Form.useWatch('data', formAreaPublica);
  const formato = Form.useWatch('formato', formAreaPublica);
  const palavrasChaves = Form.useWatch('palavrasChaves', formAreaPublica);
  const publicosAlvo = Form.useWatch('publicosAlvo', formAreaPublica);
  const titulo = Form.useWatch('titulo', formAreaPublica);
  return <></>;
};

export default AreaPublica;
