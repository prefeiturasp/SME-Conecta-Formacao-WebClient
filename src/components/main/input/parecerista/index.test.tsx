/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { SelectPareceristas } from './index';
import { obterPareceristas } from '../../../../core/services/funcionario-service';
import { confirmacao } from '../../../../core/services/alerta-service';

jest.mock('~/core/services/funcionario-service', () => ({
  obterPareceristas: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

const formMock = {
  setFieldValue: jest.fn(),
};

const formItemMock = jest.fn();
const selectMock = jest.fn();

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => formMock,
}));

jest.mock('~/components/lib/inputs/select', () => (props: any) => {
  selectMock(props);

  return (
    <>
      <div data-testid="select-pareceristas" />

      <button
        data-testid="btn-deselect"
        onClick={() => props.onDeselect?.()}
      />
    </>
  );
});

jest.mock('antd', () => ({
  Form: {
    Item: ({ children, ...props }: any) => {
      formItemMock(props);
      return <>{children}</>;
    },
  },
}));

describe('SelectPareceristas', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (obterPareceristas as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [
        {
          nome: 'João',
          login: 'joao',
        },
        {
          nome: 'Maria',
          login: 'maria',
        },
      ],
    });
  });

  const renderComponent = async (props: Partial<React.ComponentProps<typeof SelectPareceristas>> = {}) => {
    await act(async () => {
      render(<SelectPareceristas {...props} />);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(obterPareceristas).toHaveBeenCalled();
    });
  
    await waitFor(() => {
      expect(selectMock.mock.calls.length).toBeGreaterThan(1);
    });
  };

  it('deve carregar os pareceristas', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          {
            nome: 'João',
            login: 'joao',
            label: 'João',
            value: 'joao',
          },
          {
            nome: 'Maria',
            login: 'maria',
            label: 'Maria',
            value: 'maria',
          },
        ],
      })
    );
  });

  it('deve deixar options vazio quando serviço falhar', async () => {
    (obterPareceristas as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    await renderComponent();

    await waitFor(() =>
      expect(selectMock).toHaveBeenCalledWith(
        expect.objectContaining({
          options: [],
        })
      )
    );
  });

  it('deve configurar o Form.Item corretamente', async () => {
    await renderComponent();

    expect(formItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'pareceristas',
        label: 'Pareceristas',
      })
    );
  });

  it('deve possuir regra obrigatória', async () => {
    await renderComponent();

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules).toEqual([
      {
        required: true,
        message: 'É necessário informar pelo menos um parecerista',
      },
    ]);
  });

  it('deve possuir id correto', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'CF_SELECT_PARECERISTA',
      })
    );
  });

  it('deve configurar placeholder', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: 'Pareceristas',
      })
    );
  });

  it('deve configurar modo multiple', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'multiple',
      })
    );
  });

  it('deve configurar allowClear', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        allowClear: true,
      })
    );
  });

  it('deve executar normalize retornando o novo valor', async () => {
    await renderComponent();

    const props = formItemMock.mock.calls[0][0];

    const retorno = props.normalize(
      ['joao'],
      ['maria']
    );

    expect(retorno).toEqual(['joao']);
  });

  it('deve retornar o valor no getValueFromEvent', async () => {
    await renderComponent();

    const props = formItemMock.mock.calls[0][0];

    expect(
      props.getValueFromEvent({}, ['joao'])
    ).toEqual(['joao']);
  });

  it('deve abrir confirmação ao desselecionar', async () => {
    await renderComponent();

    const props = formItemMock.mock.calls[0][0];

    act(() => {
      props.normalize(['joao'], ['maria']);
    });

    await act(async () => {
      fireEvent.click(document.querySelector('[data-testid="btn-deselect"]')!);
    });

    await waitFor(() =>
      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content:
            'Deseja realmente excluir este Parecerista desta proposta?',
          onCancel: expect.any(Function),
        })
      )
    );
  });

  it('deve restaurar valor ao cancelar confirmação', async () => {
    await renderComponent();

  const props = formItemMock.mock.calls[0][0];

  act(() => {
    props.normalize(['joao'], ['maria']);
  });

    await act(async () => {
      fireEvent.click(document.querySelector('[data-testid="btn-deselect"]')!);
    });

  await waitFor(() => {
    expect(confirmacao).toHaveBeenCalled();
  });

  const { onCancel } = (confirmacao as jest.Mock).mock.calls[0][0];

    act(() => {
      onCancel();
    });

  expect(formMock.setFieldValue).toHaveBeenCalledWith(
    'pareceristas',
    undefined
  );
});

  it('deve repassar selectProps', async () => {
    const onChange = jest.fn();

    await renderComponent({
      selectProps: {
        disabled: true,
        onChange,
      },
    });

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        onChange,
      })
    );
  });

  it('deve repassar formItemProps', async () => {
    await renderComponent({
      formItemProps: {
        required: false,
      },
    });

    expect(formItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        required: false,
      })
    );
  });
});