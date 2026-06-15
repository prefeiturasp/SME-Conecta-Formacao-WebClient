/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { useContext } from 'react';

import NotificacoesContextProvider, {
  NotificacoesContext,
} from './index';

import notificacaoService from '../../../core/services/notificacao-service';
import { useAppSelector } from '../../../core/hooks/use-redux';

import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from '@microsoft/signalr';

jest.mock('../../../core/hooks/use-redux');
jest.mock('../../../core/services/notificacao-service');

const invoke = jest.fn();
const start = jest.fn();
const stop = jest.fn();
const on = jest.fn();
const onclose = jest.fn();
const onreconnecting = jest.fn();
const onreconnected = jest.fn();

const connectionMock = {
  invoke,
  start,
  stop,
  on,
  onclose,
  onreconnecting,
  onreconnected,
};

const build = jest.fn(() => connectionMock);
const withUrl = jest.fn(() => ({
  withAutomaticReconnect,
}));

const withAutomaticReconnect = jest.fn(() => ({
  configureLogging,
}));

const configureLogging = jest.fn(() => ({
  build,
}));

jest.mock('@microsoft/signalr', () => ({
  HttpTransportType: {
    WebSockets: 1,
  },
  LogLevel: {
    Information: 1,
  },
  HubConnectionBuilder: jest.fn(() => ({
    withUrl,
  })),
}));

const Consumer = () => {
  const ctx = useContext(NotificacoesContext);

  return (
    <>
      <span data-testid="url">{ctx.urlConnection}</span>
      <span data-testid="qtd">{ctx.quantidadeNotificacoes}</span>
    </>
  );
};

describe('NotificacoesContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

process.env.VITE_SME_CF_SIGNALR = 'http://localhost';

    (useAppSelector as jest.Mock)
      .mockImplementation((selector) =>
        selector({
          spin: { spinning: false },
          auth: {
            usuarioLogin: '1111111',
          },
          perfil: {
            perfilSelecionado: {
              perfil: 10,
            },
          },
        })
      );

    (
      notificacaoService.obterNotificacoesNaoLida as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: 5,
    });

    start.mockResolvedValue(undefined);
    stop.mockResolvedValue(undefined);
  });

  it('deve renderizar o provider', () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );
  });

  it('deve buscar quantidade de notificações', async () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(
        notificacaoService.obterNotificacoesNaoLida
      ).toHaveBeenCalled()
    );
  });

  it('deve criar conexão SignalR', async () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() => {
      expect(HubConnectionBuilder).toHaveBeenCalled();
    });

    expect(withUrl).toHaveBeenCalledWith(
      'http://localhost/notificacaoHub',
      {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      }
    );

    expect(withAutomaticReconnect).toHaveBeenCalled();

    expect(configureLogging).toHaveBeenCalledWith(
      LogLevel.Information
    );
  });

  it('deve iniciar conexão', async () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(start).toHaveBeenCalled()
    );
  });

  it('deve registrar os eventos do SignalR', async () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(on).toHaveBeenCalled()
    );

    expect(on).toHaveBeenCalledWith(
      'Criada',
      expect.any(Function)
    );

    expect(on).toHaveBeenCalledWith(
      'Lida',
      expect.any(Function)
    );

    expect(on).toHaveBeenCalledWith(
      'Excluida',
      expect.any(Function)
    );
  });

  it('deve registrar callbacks de reconexão', async () => {
    render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(onclose).toHaveBeenCalled()
    );

    expect(onreconnecting).toHaveBeenCalled();
    expect(onreconnected).toHaveBeenCalled();
  });

  it('deve parar conexão ao desmontar', async () => {
    const { unmount } = render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    unmount();

    await waitFor(() =>
      expect(stop).toHaveBeenCalled()
    );
  });

  it('deve atualizar quantidade de notificações no contexto', async () => {
    const { getByTestId } = render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(getByTestId('qtd')).toHaveTextContent('5')
    );
  });

  it('deve expor urlConnection no contexto', () => {
    const { getByTestId } = render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    expect(getByTestId('url')).toHaveTextContent(
      'http://localhost'
    );
  });

  it('não deve atualizar quantidade quando serviço retornar erro', async () => {
    (
      notificacaoService.obterNotificacoesNaoLida as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });

    const { getByTestId } = render(
      <NotificacoesContextProvider>
        <Consumer />
      </NotificacoesContextProvider>
    );

    await waitFor(() =>
      expect(
        notificacaoService.obterNotificacoesNaoLida
      ).toHaveBeenCalled()
    );

    expect(getByTestId('qtd')).toHaveTextContent('0');
  });
});