import React from 'react';
import ListaRegentes from './components/lista-regentes';
import ListaTutores from './components/lista-tutores';

const FormularioProfissionais: React.FC = () => {
  return (
    <>
      <ListaRegentes />
      <ListaTutores />
    </>
  );
};

export default FormularioProfissionais;
