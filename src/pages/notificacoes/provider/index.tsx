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
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [urlConnection, setUrlConnection] = useState('');
  const [quantidadeNotificacoes, setQuantidadeNotificacoes] = useState<number>(0);

  const usuarioRf = useAppSelector((store) => store.auth.usuarioLogin);
  const perfilID = useAppSelector((store) => store.perfil.perfilSelecionado?.perfil);

  const qtdNotificacoesNaoLidas = async () => {
    const resposta = await notificacaoService.obterNotificacoesNaoLida();

    if (resposta.sucesso) {
      setQuantidadeNotificacoes(resposta.dados);
    }
  };

  const conectarSignalR = useCallback(async () => {
    if (urlConnection) {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${urlConnection}/notificacao`, {
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
      // setIniciarNotificacoesSemWebSocket(true);
    }
  }, [urlConnection, usuarioRf]);

  useEffect(() => {
    qtdNotificacoesNaoLidas();
  }, []);

  useEffect(() => {
    conectarSignalR();
  }, [urlConnection, conectarSignalR]);

  useEffect(() => {
    // if (obterUrlSignalR) {
    // setUrlConnection(obterUrlSignalR);
    // } else {
    // setUrlConnection('');
    // dispatch(setIniciarNotificacoesSemWebSocket(true));
    // }
  }, []);

  const startConnection = useCallback(async () => {
    if (connection) {
      await connection.stop();
      connection
        .start()
        .then(() => {
          connection.on('NotificacaoCriada', (codigo, data, titulo, id) => {
            const params = {
              codigo,
              data,
              titulo,
              id,
            };
            // webSocketNotificacaoCriada(params);
          });
          connection.on('NotificacaoLida', (codigo, isAnoAnterior) => {
            const params = {
              codigo,
              isAnoAnterior,
            };
            // webSocketNotificacaoLida(params);
          });
          connection.on('NotificacaoExcluida', (codigo, status, isAnoAnterior) => {
            const params = {
              codigo,
              status,
              isAnoAnterior,
            };
            // webSocketNotificacaoExcluida(params);
          });
          // setIniciarNotificacoesSemWebSocket(false);
        })
        .catch(async () => {
          // setIniciarNotificacoesSemWebSocket(true);
          await connection.stop();
          setTimeout(() => {
            startConnection();
          }, 60000);
        });

      connection.onclose(async () => {
        // setIniciarNotificacoesSemWebSocket(true);
      });
      connection.onreconnecting(() => {
        // setIniciarNotificacoesSemWebSocket(true);
      });
      connection.onreconnected(() => {
        // setIniciarNotificacoesSemWebSocket(false);
      });
    }
  }, [connection]);

  useEffect(() => {
    if (connection) startConnection();
    return () => {
      if (connection) connection.stop();
    };
  }, [connection, startConnection]);

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
