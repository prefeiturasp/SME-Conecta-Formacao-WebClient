/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import InputRegistroFuncionalNome from './index';
import { obterNomeProfissional } from '../../../../core/services/proposta-service';
import { notification } from '../../../../components/lib/notification';

jest.mock('../../../../core/services/proposta-service', () => ({
  obterNomeProfissional: jest.fn(),
}));

jest.mock('../../../../components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

jest.mock('../cpf', () => () => <div data-testid="input-cpf" />);

const formMock = {
  setFieldValue: jest.fn(),
};

const useWatchMock = jest.fn();

const formItemMock = jest.fn();
const searchMock = jest.fn();
const inputMock = jest.fn();

jest.mock('antd', () => ({
  Col: ({ children }: any) => <div>{children}</div>,

  Tooltip: ({ children }: any) => children,

  Form: {
    useFormInstance: () => formMock,

    useWatch: (...args: any[]) => useWatchMock(...args),

    Item: ({ children, ...props }: any) => {
      formItemMock(props);

      if (typeof children === 'function') {
        return children(formMock);
      }

      return <>{children}</>;
    },
  },

  Input: Object.assign(
    (props: any) => {
      inputMock(props);

      return (
        <input
          data-testid="input-nome"
          {...props}
        />
      );
    },
    {
      Search: (props: any) => {
        searchMock(props);

        const { loading: _loading, onSearch, ...inputProps } = props;

        return (
          <>
            <input
              data-testid="input-rf"
              {...inputProps}
            />

            <button
              data-testid="search-button"
              onClick={onSearch}
            />
          </>
        );
      },
    }
  ),
}));

describe('InputRegistroFuncionalNome', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '';

        case 'profissionalRedeMunicipal':
          return false;

        default:
          return undefined;
      }
    });
  });

  const renderComponent = (props = {}) =>
    render(
      <InputRegistroFuncionalNome
        exibirCpf={false}
        formItemPropsNome={{ name: 'nome' }}
        {...props}
      />
    );

  it('deve renderizar InputCPF quando exibirCpf=true', () => {
    render(
      <InputRegistroFuncionalNome
        exibirCpf
        formItemPropsNome={{ name: 'nome' }}
      />
    );

    expect(screen.getByTestId('input-cpf')).toBeInTheDocument();
  });

  it('deve renderizar pesquisa de RF quando exibirCpf=false', () => {
    renderComponent();

    expect(screen.getByTestId('input-rf')).toBeInTheDocument();
  });

  it('deve renderizar campo Nome', () => {
    renderComponent();

    expect(screen.getByTestId('input-nome')).toBeInTheDocument();
  });

  it('deve adicionar regra len=7', () => {
    renderComponent({
      formItemPropsRF: {},
    });

    const rfItem = formItemMock.mock.calls.find(
      (call) => call[0].name === 'registroFuncional'
    )[0];

    expect(rfItem.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          len: 7,
        }),
      ])
    );
  });

  it('deve concatenar regras existentes', () => {
    const regra = { required: true };

    renderComponent({
      formItemPropsRF: {
        rules: [regra],
      },
    });

    const rfItem = formItemMock.mock.calls.find(
      (call) => call[0].name === 'registroFuncional'
    )[0];

    expect(rfItem.rules).toEqual([
      regra,
      { len: 7 },
    ]);
  });

  it('não deve buscar quando RF não possui 7 caracteres', async () => {
    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '123';

        case 'profissionalRedeMunicipal':
          return false;

        default:
          return undefined;
      }
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(obterNomeProfissional).not.toHaveBeenCalled();
    });
  });

  it('deve preencher nome quando encontrar profissional', async () => {
    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '1234567';

        case 'profissionalRedeMunicipal':
          return false;

        default:
          return undefined;
      }
    });

    (obterNomeProfissional as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: 'João da Silva',
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(obterNomeProfissional).toHaveBeenCalledWith('1234567');
    });

    expect(formMock.setFieldValue).toHaveBeenCalledWith(
      'nome',
      'João da Silva'
    );
  });

  it('deve exibir notificação quando não encontrar profissional', async () => {
    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '1234567';

        case 'profissionalRedeMunicipal':
          return false;

        default:
          return undefined;
      }
    });

    (obterNomeProfissional as jest.Mock).mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalledWith({
        message: 'Erro',
        description:
          'Não foi possível encontrar nenhum profissional com o RF informado',
      });
    });

    expect(formMock.setFieldValue).not.toHaveBeenCalledWith('nome', '');
  });

  it('deve limpar nome quando profissional da rede e não encontrar RF', async () => {
    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '1234567';

        case 'profissionalRedeMunicipal':
          return true;

        default:
          return undefined;
      }
    });

    (obterNomeProfissional as jest.Mock).mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(formMock.setFieldValue).toHaveBeenCalledWith(
        'nome',
        ''
      );
    });
  });

  it('deve passar loading para Input.Search', async () => {
    useWatchMock.mockImplementation((campo: string) => {
      switch (campo) {
        case 'registroFuncional':
          return '1234567';

        case 'profissionalRedeMunicipal':
          return false;

        default:
          return undefined;
      }
    });

    (obterNomeProfissional as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: 'João',
    });

    renderComponent();

    fireEvent.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(searchMock).toHaveBeenCalled();
    });
  });

  it('deve configurar estilo uppercase no campo nome', () => {
    renderComponent();

    expect(inputMock).toHaveBeenCalledWith(
      expect.objectContaining({
        style: {
          textTransform: 'uppercase',
        },
      })
    );
  });
});