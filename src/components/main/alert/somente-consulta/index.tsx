import React from 'react';
import Alert from '~/components/lib/alert';
import { TipoAlerta } from '~/core/enum/tipo-alerta';

type AlertaSomenteConsultaProps = {
  somenteConsulta?: boolean;
};
const AlertaSomenteConsulta: React.FC<AlertaSomenteConsultaProps> = ({
  somenteConsulta = false,
}) => {
  if (somenteConsulta) {
    return (
      <Alert
        type={TipoAlerta.Warning}
        message='Atenção'
        description='Você tem apenas permissão de consulta nesta tela.'
      />
    );
  }

  return <></>;
};

export default AlertaSomenteConsulta;
