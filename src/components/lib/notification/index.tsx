import React from 'react';
import { notification } from 'antd';
import { TipoAlerta } from '~/core/enum/tipo-alerta';

type NotificacaoPropos = {
  tipo: TipoAlerta;
  titulo: string;
  mensagem: string;
};
const Notificacao: React.FC<NotificacaoPropos> = ({ tipo, titulo, mensagem }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: TipoAlerta) => {
    api[type]({
      message: titulo,
      description: mensagem,
    });
  };
  return (
    <>
      {contextHolder} {openNotification(tipo)}
    </>
  );
};

export default Notificacao;
