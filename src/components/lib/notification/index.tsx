import { notification } from 'antd';
import { TipoAlerta } from '~/core/enum/tipo-alerta';
import { Colors } from '~/core/styles/colors';

const styleNotificacao: React.CSSProperties = {
  color: Colors.BRANCO,
  fontWeight: 'bold',
};
type NotificacaoPropos = {
  type: TipoAlerta;
  message: string;
  description: string;
};
const Notificacao: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const tituloNotificacao = <p style={styleNotificacao}>Sucesso</p>;
  const iconeClose = <p style={styleNotificacao}>X</p>;
  const textoNotificacao = (
    <p style={styleNotificacao}>Você tem apenas permissão de consulta nesta tela.</p>
  );

  const openNotification = (type: TipoAlerta) => {
    api[type]({
      message: tituloNotificacao,
      description: textoNotificacao,
      style: { background: Colors.FUNDO_DARK },
      closeIcon: iconeClose,
    });
  };
  return (
    <>
      {contextHolder} {openNotification(TipoAlerta.Success)}
    </>
  );
};

export default Notificacao;
