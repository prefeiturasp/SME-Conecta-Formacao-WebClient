import React from 'react';
import ListaRegentes from './components/lista-regentes';
import ListaTutores from './components/lista-tutores';

type FormularioProfissionaisProps = {
  recarregarTurmas: boolean;
};

const FormularioProfissionais: React.FC<FormularioProfissionaisProps> = ({ recarregarTurmas }) => {
  return (
    <>
      <ListaRegentes recarregarTurmas={recarregarTurmas} />
      <ListaTutores recarregarTurmas={recarregarTurmas} />
    </>
  );
};

export default FormularioProfissionais;
