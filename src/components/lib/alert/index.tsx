import { Alert } from 'antd';
import { FC } from 'react';
import { TipoAlerta } from '~/core/enum/tipo-alerta';
import { Colors } from '~/core/styles/colors';
import React from 'react';

const styleAlert: React.CSSProperties = {
  // color: Colors.Neutral.WHITE,
  fontWeight: 'bold',
};
type AlertaPropos = {
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
};
const Alerta: FC<AlertaPropos> = ({ tipo, titulo, mensagem }) => {
  return (
    <Alert
      style={{ background: Colors.Components.BACKGROUND_ALERT }}
      message={titulo}
      description={mensagem}
      type={tipo}
      showIcon

      // closeIcon={<p style={styleAlert}>X</p>}
    />
  );
};

export default Alerta;
