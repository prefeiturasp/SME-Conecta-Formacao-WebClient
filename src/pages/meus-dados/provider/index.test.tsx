/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { HttpStatusCode } from 'axios';
import { useContext } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MeusDadosContext } from '.';
import usuarioService from '../../../core/services/usuario-service';

jest.mock('antd/es/form/Form', () => {
  const actual = jest.requireActual('antd');
  return { useForm: actual.Form.useForm };
});

const mockDispatch = jest.fn();
const mockUseAppSelector = jest.fn();

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (store: unknown) => unknown) => mockUseAppSelector(selector),
}));

jest.mock('~/core/services/usuario-service', () => ({
  obterMeusDados: jest.fn(),
}));

const mockUsuarioService = usuarioService as jest.Mocked<typeof usuarioService>;

const ConsumerComponent = () => {
  const { meusDados, obterDados } = useContext(MeusDadosContext);
  return (
    <div>
      <span data-testid='nome'>{meusDados?.nome}</span>
      <button onClick={obterDados}>Obter</button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MeusDadosContextProvider = require('.').default;

describe('MeusDadosContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockImplementation((selector: (store: unknown) => unknown) =>
      selector({ auth: { usuarioLogin: 'usuario.teste' } }),
    );
  });

  it('obtém os dados do usuário ao montar e atualiza o contexto', async () => {
    mockUsuarioService.obterMeusDados.mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: { nome: 'Maria da Silva' },
    } as never);

    render(
      <MeusDadosContextProvider>
        <ConsumerComponent />
      </MeusDadosContextProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('nome')).toHaveTextContent('Maria da Silva'));

    expect(mockUsuarioService.obterMeusDados).toHaveBeenCalledWith('usuario.teste');
    expect(mockDispatch).toHaveBeenCalledWith({ type: expect.anything(), payload: true });
    expect(mockDispatch).toHaveBeenCalledWith({ type: expect.anything(), payload: false });
  });

  it('não atualiza os dados quando a resposta não é HTTP 200', async () => {
    mockUsuarioService.obterMeusDados.mockResolvedValue({
      status: HttpStatusCode.NoContent,
      data: { nome: 'Não deveria aparecer' },
    } as never);

    render(
      <MeusDadosContextProvider>
        <ConsumerComponent />
      </MeusDadosContextProvider>,
    );

    await waitFor(() => expect(mockUsuarioService.obterMeusDados).toHaveBeenCalled());

    expect(screen.getByTestId('nome')).toHaveTextContent('');
  });

  it('exibe um alerta quando ocorre erro ao obter os dados', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockUsuarioService.obterMeusDados.mockRejectedValue(new Error('falha'));

    render(
      <MeusDadosContextProvider>
        <ConsumerComponent />
      </MeusDadosContextProvider>,
    );

    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('erro ao obter meus dados'));

    alertSpy.mockRestore();
  });

  it('permite chamar obterDados novamente pelo contexto', async () => {
    mockUsuarioService.obterMeusDados.mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: { nome: 'Primeira Chamada' },
    } as never);

    render(
      <MeusDadosContextProvider>
        <ConsumerComponent />
      </MeusDadosContextProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('nome')).toHaveTextContent('Primeira Chamada'));

    mockUsuarioService.obterMeusDados.mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: { nome: 'Segunda Chamada' },
    } as never);

    await act(async () => {
      screen.getByText('Obter').click();
    });

    await waitFor(() => expect(screen.getByTestId('nome')).toHaveTextContent('Segunda Chamada'));
    expect(mockUsuarioService.obterMeusDados).toHaveBeenCalledTimes(2);
  });
});
