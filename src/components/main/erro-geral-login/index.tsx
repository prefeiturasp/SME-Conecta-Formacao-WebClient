import React from 'react';
import { ContainerErroGeralLogin } from './style';

type ErroGeralLoginProps = {
  erros: string[];
};

const ErroGeralLogin: React.FC<ErroGeralLoginProps> = ({ erros }) => {
  return (
    <ContainerErroGeralLogin>
      {erros.map((erro) => (
        <p key={erro}>{erro}</p>
      ))}
    </ContainerErroGeralLogin>
  );
};

export default ErroGeralLogin;
