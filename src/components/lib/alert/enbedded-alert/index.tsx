import { Alert } from 'antd';
import { FC } from 'react';
import { TipoAlerta } from '~/core/enum/tipo-alerta';
import { Colors } from '~/core/styles/colors';

const styleAlert: React.CSSProperties = {
  color: Colors.BRANCO,
  fontWeight: 'bold',
};
type EnbeddedAlertProps = {
  type: TipoAlerta;
  message: string;
  description: string;
};
const EnbeddedAlert: FC = () => {
  return (
    <Alert
      style={{ background: Colors.FUNDO_DARK }}
      message={<p style={styleAlert}>Sucesso</p>}
      description={<p style={styleAlert}>Você tem apenas permissão de consulta nesta tela.</p>}
      type={TipoAlerta.Success}
      showIcon
      closeIcon={<p style={styleAlert}>X</p>}
    />
  );
};

export default EnbeddedAlert;
