/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { CadastroDeUsuario } from './index';

import funcionarioExternoService from '~/core/services/funcionario-externo-service';
import usuarioService from '~/core/services/usuario-service';

import { sucesso } from '~/core/services/alerta-service';
import { onClickVoltar } from '~/core/utils/form';
import { useAppDispatch } from '~/core/hooks/use-redux';
import {
  CF_INPUT_CONFIRMAR_EMAIL,
  CF_INPUT_EMAIL,
} from '~/core/constants/ids/input';

const mockFormState: Record<string, any> = {
  cpf: '12345678901',
  nomePessoa: 'João Silva',
  email: 'joao@teste.com',
  confirmarEmail: 'joao@teste.com',
  tipoEmail: 1,
  nomeUnidade: 'UE Teste',
  emailEducacional: 'joao.silva',
  codigoUnidade: '123',
  senha: 'Senha@123',
  confirmarSenha: 'Senha@123',
  ues: [1],
};

const defaultMockFormState = {
  ...mockFormState,
};

jest.mock('~/core/hooks/use-redux');
jest.mock('~/core/services/funcionario-externo-service');
jest.mock('~/core/services/usuario-service');

jest.mock('~/core/services/alerta-service', () => ({
  sucesso: jest.fn(),
}));

jest.mock('~/core/utils/form', () => ({
  __esModule: true,
  onClickVoltar: jest.fn(),
}));

jest.mock('~/core/redux/modules/spin/actions', () => ({
  setSpinning: jest.fn(() => ({
    type: 'SPIN',
  })),
}));

jest.mock('antd', () => {
  const React = require('react');

  const formApi = {
    getFieldValue: jest.fn((fieldName: string) => mockFormState[fieldName]),
    setFieldsValue: jest.fn((values: Record<string, any>) => Object.assign(mockFormState, values)),
    setFieldValue: jest.fn((fieldName: string, value: any) => {
      mockFormState[fieldName] = value;
    }),
    setFields: jest.fn(),
    getFieldInstance: jest.fn(() => ({
      focus: jest.fn(),
    })),
  };

  const Form = ({ children, onFinish, onFinishFailed }: any) => (
    <form
      role='form'
      onSubmit={(event) => {
        event.preventDefault();
        onFinish?.({ ...mockFormState });
      }}
    >
      {children}
    </form>
  );

  Form.useForm = () => [formApi];
  Form.Item = ({ children, label }: any) => (
    <div>
      {label}
      {children}
    </div>
  );

  const Button = ({ children, htmlType, type: _visualType, onClick, disabled, ...rest }: any) => (
    <button type={htmlType === 'submit' ? 'submit' : 'button'} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );

  const Checkbox = ({ children, checked, onChange }: any) => (
    <label>
      <input type='checkbox' checked={checked} onChange={onChange} />
      {children}
    </label>
  );

  const Col = ({ children }: any) => <div>{children}</div>;
  const Row = ({ children }: any) => <div>{children}</div>;
  const Input = (props: any) => <input {...props} />;

  return {
    __esModule: true,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [
    {
      getFieldValue: jest.fn((fieldName: string) => {
        if (fieldName === 'cpf') {
          return '12345678901';
        }

        if (fieldName === 'tipoEmail') {
          return 1;
        }

        if (fieldName === 'nomePessoa') {
          return 'João Silva';
        }

        if (fieldName === 'email') {
          return 'joao@teste.com';
        }

        if (fieldName === 'confirmarEmail') {
          return 'joao@teste.com';
        }

        if (fieldName === 'nomeUnidade') {
          return 'UE Teste';
        }

        return undefined;
      }),
      setFieldsValue: jest.fn((values: Record<string, any>) => Object.assign(mockFormState, values)),
      setFieldValue: jest.fn((fieldName: string, value: any) => {
        mockFormState[fieldName] = value;
      }),
      setFields: jest.fn(),
      getFieldInstance: jest.fn(() => ({
        focus: jest.fn(),
      })),
    },
  ],
}));

jest.mock('~/components/main/input/cpf', () => ({
  __esModule: true,
  default: ({ inputProps }: any) => (
    <input
      data-testid='cpf'
      {...inputProps}
      onChange={(event) => {
        mockFormState.cpf = event.target.value;
        inputProps?.onChange?.(event);
      }}
    />
  ),
}));

jest.mock('~/components/main/input/email', () => ({
  __esModule: true,
  default: ({ inputProps, formItemProps }: any) => {
    const testId = inputProps?.id === CF_INPUT_CONFIRMAR_EMAIL ? CF_INPUT_CONFIRMAR_EMAIL : CF_INPUT_EMAIL;

    return (
      <input
        data-testid={testId}
        {...inputProps}
        onChange={(event) => {
          if (inputProps?.id === CF_INPUT_CONFIRMAR_EMAIL) {
            mockFormState.confirmarEmail = event.target.value;
          }

          if (inputProps?.id === CF_INPUT_EMAIL) {
            mockFormState.email = event.target.value;
          }

          inputProps?.onChange?.(event);
        }}
        onKeyUp={(event) => {
          inputProps?.onKeyUp?.(event);
        }}
        onPaste={(event) => {
          inputProps?.onPaste?.(event);
        }}
        onCopy={(event) => {
          inputProps?.onCopy?.(event);
        }}
      />
    );
  },
}));

jest.mock('~/components/main/input/email-educacional', () => ({
  __esModule: true,
  default: () => <input data-testid='emailEdu' />,
}));

jest.mock('~/components/main/input/codigo-eol-ue', () => ({
  __esModule: true,
  default: () => <input data-testid='codigoEolUE' />,
}));

jest.mock('~/components/main/input/senha-cadastro', () => ({
  __esModule: true,
  default: ({ inputProps }: any) => <input data-testid={inputProps?.id} {...inputProps} />,
}));

jest.mock('~/components/main/input/tipo-email', () => ({
  __esModule: true,
  default: ({ selectProps }: any) => (
    <select data-testid='tipoEmail' onChange={selectProps?.onChange}>
      <option value='1'>Funcionário</option>
    </select>
  ),
}));

jest.mock('~/components/main/erro-geral-login', () => ({
  __esModule: true,
  default: () => <div>Erro</div>,
}));

describe('CadastroDeUsuario', () => {
  const renderPage = () =>
    render(
      <BrowserRouter>
        <CadastroDeUsuario />
      </BrowserRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(jest.fn());
    Object.assign(mockFormState, defaultMockFormState);
    (funcionarioExternoService.obterFuncionarioExterno as jest.Mock).mockResolvedValue({
      dados: undefined,
    });
    (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockResolvedValue({
      dados: undefined,
    });
  });

  it('deve renderizar formulário', () => {
    renderPage();

    expect(
      screen.getByText('As informações prestadas são verdadeiras e me responsabilizo por elas'),
    ).toBeInTheDocument();
  });

  it('botão continuar inicia desabilitado', () => {
    renderPage();

    expect(screen.getByText('Continuar')).toBeDisabled();
  });

  it('deve habilitar continuar ao marcar checkbox', () => {
    renderPage();

    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByText('Continuar')).toBeEnabled();
  });

  it('deve chamar voltar', () => {
    renderPage();

    fireEvent.click(screen.getByText('Voltar'));

    expect(onClickVoltar).toHaveBeenCalled();
  });

  it('deve buscar funcionário ao digitar CPF completo', async () => {
    (funcionarioExternoService.obterFuncionarioExterno as jest.Mock).mockResolvedValue({
      dados: {
        nomePessoa: 'João Silva',
        codigoUE: '123',
        nomeUe: 'UE Teste',
        ues: [{ id: 1 }],
      },
    });

    renderPage();

    fireEvent.change(screen.getByTestId('cpf'), {
      target: {
        value: '12345678901',
      },
    });

    await waitFor(() => {
      expect(funcionarioExternoService.obterFuncionarioExterno).toHaveBeenCalledWith('12345678901');
    });
  });

  it('deve cadastrar usuário com sucesso', async () => {
    (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockResolvedValue({
      dados: {
        mensagem: 'Cadastro realizado',
      },
    });

    renderPage();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(usuarioService.cadastrarUsuarioExterno).toHaveBeenCalled();
      expect(sucesso).toHaveBeenCalled();
    });
  });

  it('deve tratar erro de cadastro com mensagens', async () => {
    (usuarioService.cadastrarUsuarioExterno as jest.Mock).mockRejectedValue({
      response: {
        data: {
          mensagens: ['Erro teste'],
        },
      },
    });

    renderPage();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('Erro')).toBeInTheDocument();
    });
  });

  it('deve validar email diferente', async () => {
    renderPage();

    fireEvent.change(screen.getByTestId(CF_INPUT_EMAIL), {
      target: {
        value: 'email@teste.com',
      },
    });

    fireEvent.change(screen.getByTestId(CF_INPUT_CONFIRMAR_EMAIL), {
      target: {
        value: 'outro@teste.com',
      },
    });

    fireEvent.submit(screen.getByRole('form'));

    expect(usuarioService.cadastrarUsuarioExterno).not.toHaveBeenCalled();
  });

  it('não permite copiar confirmação email', () => {
    renderPage();

    const input = screen.getByTestId(CF_INPUT_CONFIRMAR_EMAIL);

    const copyEvent = new Event('copy', { bubbles: true, cancelable: true }) as Event & {
      preventDefault: jest.Mock;
    };
    copyEvent.preventDefault = jest.fn();

    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true }) as Event & {
      preventDefault: jest.Mock;
    };
    pasteEvent.preventDefault = jest.fn();

    input.dispatchEvent(copyEvent);
    input.dispatchEvent(pasteEvent);

    expect(copyEvent.preventDefault).toHaveBeenCalled();
    expect(pasteEvent.preventDefault).toHaveBeenCalled();
  });
});