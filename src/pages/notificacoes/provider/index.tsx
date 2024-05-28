/* eslint-disable @typescript-eslint/no-empty-function */
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import React, { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import notificacaoService from '~/core/services/notificacao-service';

type NotificacoesContextProps = {
  connection: HubConnection | null;
  urlConnection: string;
  quantidadeNotificacoes: number;
};

const DEFAULT_VALUES: NotificacoesContextProps = {
  connection: null,
  urlConnection: '',
  quantidadeNotificacoes: 0,
};

export const NotificacoesContext = createContext<NotificacoesContextProps>(DEFAULT_VALUES);

const NotificacoesContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { spinning } = useAppSelector((state) => state.spin);

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [quantidadeNotificacoes, setQuantidadeNotificacoes] = useState<number>(0);
  const [iniciarNotificacoesSemWebSocket, setIniciarNotificacoesSemWebSocket] =
    useState<boolean>(false);

  const usuarioRf = useAppSelector((store) => store.auth.usuarioLogin);
  const perfilID = useAppSelector((store) => store.perfil.perfilSelecionado?.perfil);

  const urlConnection = import.meta.env.VITE_SME_CF_SIGNALR;

  const qtdNotificacoesNaoLidas = async () => {
    const resposta = await notificacaoService.obterNotificacoesNaoLida();

    if (resposta.sucesso) {
      setQuantidadeNotificacoes(resposta.dados);
    }
  };

  const conectarSignalR = useCallback(async () => {
    if (urlConnection) {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${urlConnection}/notificacaoHub`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: () => 60000,
        })
        .configureLogging(LogLevel.Information)
        .build();

      connection?.invoke('Registrar', usuarioRf, perfilID);

      setConnection(hubConnection);
    } else {
      setConnection(null);
      setIniciarNotificacoesSemWebSocket(true);
    }
  }, [urlConnection, usuarioRf]);

  useEffect(() => {
    qtdNotificacoesNaoLidas();
  }, []);

  useEffect(() => {
    conectarSignalR();
  }, [urlConnection, conectarSignalR]);

  const startConnection = useCallback(async () => {
    if (connection) {
      await connection.stop();

      connection
        .start()
        .then(() => {
          connection.on('Criada', () => qtdNotificacoesNaoLidas());

          connection.on('Lida', () => qtdNotificacoesNaoLidas());

          connection.on('Excluida', () => qtdNotificacoesNaoLidas());

          setIniciarNotificacoesSemWebSocket(false);
        })
        .catch(async () => {
          setIniciarNotificacoesSemWebSocket(true);

          await connection.stop();

          setTimeout(() => {
            startConnection();
          }, 60000);
        });

      connection.onclose(() => {
        setIniciarNotificacoesSemWebSocket(true);
      });

      connection.onreconnecting(() => {
        setIniciarNotificacoesSemWebSocket(true);
      });

      connection.onreconnected(() => {
        setIniciarNotificacoesSemWebSocket(false);
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) startConnection();
    return () => {
      if (connection) connection.stop();
    };
  }, [connection, startConnection]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!spinning) {
        qtdNotificacoesNaoLidas();
      }
    }, 60000);

    if (!iniciarNotificacoesSemWebSocket) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [spinning, iniciarNotificacoesSemWebSocket]);

  return (
    <NotificacoesContext.Provider
      value={{
        connection,
        urlConnection,
        quantidadeNotificacoes,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
};

export default NotificacoesContextProvider;
