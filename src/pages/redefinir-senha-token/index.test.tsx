
/**
 * @jest-environment jsdom
 */

declare const require: any;

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import usuarioService from '../../core/services/usuario-service';
const navigateMock = jest.fn();
const mockTokenRecuperacaoSenhaEstaValido =
  usuarioService.tokenRecuperacaoSenhaEstaValido as jest.MockedFunction<
    typeof usuarioService.tokenRecuperacaoSenhaEstaValido
  >;
const mockAlterarSenhaComTokenRecuperacao =
  usuarioService.alterarSenhaComTokenRecuperacao as jest.MockedFunction<
    typeof usuarioService.alterarSenhaComTokenRecuperacao
  >;

beforeEach(() => {
  const reduxModule = jest.requireMock('~/core/redux') as {
    store: { dispatch: jest.Mock };
  };
  reduxModule.store.dispatch = jest.fn();
});

const RedefinirSenhaToken = require('./index').default;

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    tokenRecuperacaoSenhaEstaValido: jest.fn(),
    alterarSenhaComTokenRecuperacao: jest.fn(),
  },
}));

jest.mock('../../core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    tokenRecuperacaoSenhaEstaValido: jest.fn(),
    alterarSenhaComTokenRecuperacao: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => navigateMock,
  useParams: () => ({ token: 'token-teste' }),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  __esModule: true,
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/redux', () => ({
  __esModule: true,
  store: {
    dispatch: jest.fn(),
  },
}));

jest.mock('../../core/redux', () => ({
  __esModule: true,
  store: {
    dispatch: jest.fn(),
  },
}));

jest.mock('~/core/utils/form', () => ({
  __esModule: true,
  hasError: jest.fn(),
  onClickVoltar: jest.fn(),
}));

jest.mock('../../core/utils/form', () => ({
  __esModule: true,
  hasError: jest.fn(),
  onClickVoltar: jest.fn(),
}));

jest.mock('antd', () => {
  const Form = ({ children, onFinish }: any) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onFinish?.({ novaSenha: 'senha-teste' });
      }}
    >
      {children}
    </form>
  );

  Form.Item = ({ children }: any) => <div>{children}</div>;

  return {
    Button: ({ children, htmlType, block, type: _type, ...rest }: any) => (
      <button type={htmlType === 'submit' ? 'submit' : 'button'} {...rest}>
        {children}
      </button>
    ),
    Col: ({ children }: any) => <div>{children}</div>,
    Form,
    Row: ({ children }: any) => <div>{children}</div>,
    Typography: {
      Text: ({ children }: any) => <span>{children}</span>,
    },
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{ resetFields: jest.fn(), getFieldValue: jest.fn() }],
}));

jest.mock('./token-expirado', () => () => (
  <div data-testid="token-expirado" />
));

jest.mock('~/components/main/spin', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

jest.mock('~/components/main/input/senha-cadastro', () => ({
  __esModule: true,
  default: () => <input />,
}));

jest.mock('~/components/main/erro-geral-login', () => ({
  __esModule: true,
  default: ({ erros }: any) => <div>{erros.join(',')}</div>,
}));

it('deve renderizar formulário quando token for válido', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockResolvedValue({
    status: 200,
    data: true,
  } as any);

  render(<RedefinirSenhaToken />);

  expect(
    await screen.findByText('Redefinição de Senha')
  ).toBeInTheDocument();
});

it('deve chamar onClickVoltar', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockResolvedValue({
    status: 200,
    data: true,
  } as any);

  render(<RedefinirSenhaToken />);

  await screen.findByText('Voltar');

  fireEvent.click(screen.getByText('Voltar'));

  expect(navigateMock).toHaveBeenCalled();
});

it('deve tratar erro ao alterar senha', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockResolvedValue({
    status: 200,
    data: true,
  } as any);

  mockAlterarSenhaComTokenRecuperacao.mockRejectedValue({
    response: {
      data: {
        mensagens: ['Senha inválida'],
      },
    },
  } as any);

  render(<RedefinirSenhaToken />);

  await screen.findByText('Voltar');

  fireEvent.submit(
    screen.getByRole('button', {
      name: /confirmar redefinição/i,
    }),
  );

  expect(
    await screen.findByText('Senha inválida')
  ).toBeInTheDocument();
});

it('deve alterar senha com sucesso', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockResolvedValue({
    status: 200,
    data: true,
  } as any);

  mockAlterarSenhaComTokenRecuperacao.mockResolvedValue({
    status: 200,
    data: {
      perfilUsuario: [],
    },
  } as any);

  render(<RedefinirSenhaToken />);

  await screen.findByText('Voltar');

  fireEvent.submit(
    screen.getByRole('button', {
      name: /confirmar redefinição/i,
    }),
  );

  await waitFor(() =>
    expect(
      mockAlterarSenhaComTokenRecuperacao
    ).toHaveBeenCalled()
  );
});

it('deve exibir erro quando validar token falhar', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockRejectedValue({
    response: {
      data: {
        mensagens: ['Erro Token'],
      },
    },
  } as any);

  render(<RedefinirSenhaToken />);

  expect(
    await screen.findByText('Erro Token')
  ).toBeInTheDocument();
});

it('deve exibir TokenExpirado quando token não for válido', async () => {
  mockTokenRecuperacaoSenhaEstaValido.mockResolvedValue({
    status: 200,
    data: false,
  } as any);

  render(<RedefinirSenhaToken />);

  expect(
    await screen.findByTestId('token-expirado')
  ).toBeInTheDocument();
});