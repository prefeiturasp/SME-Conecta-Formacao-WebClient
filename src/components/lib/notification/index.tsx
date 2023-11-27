import React from 'react';
import { notification } from 'antd';
import { TipoAlerta } from '~/core/enum/tipo-alerta';
import { Colors } from '~/core/styles/colors';

const styleNotificacao: React.CSSProperties = {
  //color: Colors.Neutral.WHITE,
  fontWeight: 'bold',
};
type NotificacaoPropos = {
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
};
const Notificacao: React.FC<NotificacaoPropos> = ({ tipo, titulo, mensagem }) => {
  const [api, contextHolder] = notification.useNotification();

  //const tituloNotificacao = <p style={styleNotificacao}>Sucesso</p>;
  const iconeClose = <p style={styleNotificacao}>X</p>;
  // const textoNotificacao = (
  //   <p style={styleNotificacao}>Você tem apenas permissão de consulta nesta tela.</p>
  // );

  const openNotification = (type: TipoAlerta) => {
    api[type]({
      message: titulo,
      description: mensagem,
      closeIcon: iconeClose,
    });
  };
  return (
    <>
      {contextHolder} {openNotification(tipo)}
    </>
  );
};

export default Notificacao;
