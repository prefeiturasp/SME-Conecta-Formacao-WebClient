/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import SelectModalidade from './index';
import { obterModalidades } from '../../../../core/services/modalidade-service';

jest.mock('../../../../core/services/modalidade-service', () => ({
  obterModalidades: jest.fn(),
}));

const setFieldValueMock = jest.fn();

const formItemMock = jest.fn();
const selectMock = jest.fn();

jest.mock('antd', () => ({
  Form: {
    Item: ({ children, ...props }: any) => {
      formItemMock(props);
      return <>{children}</>;
    },
  },
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => ({
    setFieldValue: setFieldValueMock,
  }),
}));

jest.mock('~/components/lib/inputs/select', () => (props: any) => {
  selectMock(props);

  return (
    <button
      data-testid="select-modalidade"
      onClick={() => props.onChange?.(1)}
    >
      Select
    </button>
  );
});

describe('SelectModalidade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar modalidades com sucesso', async () => {
    (obterModalidades as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [
        {
          id: 1,
          descricao: 'Infantil',
        },
        {
          id: 2,
          descricao: 'Fundamental',
        },
      ],
    });

    render(<SelectModalidade />);

    await waitFor(() =>
      expect(obterModalidades).toHaveBeenCalled()
    );

    expect(selectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        options: [
          {
            label: 'Infantil',
            value: 1,
          },
          {
            label: 'Fundamental',
            value: 2,
          },
        ],
      })
    );
  });

  it('deve deixar opções vazias quando serviço falhar', async () => {
    (obterModalidades as jest.Mock).mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    render(<SelectModalidade />);

    await waitFor(() =>
      expect(selectMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: [],
        })
      )
    );
  });

  it('deve configurar Form.Item corretamente', () => {
    render(
      <SelectModalidade
        campoRequerido
        formItemProps={{
          required: true,
        }}
      />
    );

    expect(formItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Etapa/Modalidade',
        name: 'modalidade',
        required: true,
        rules: [
          {
            required: true,
            message: expect.any(String),
          },
        ],
      })
    );
  });

  it('deve repassar selectProps', () => {
    render(
      <SelectModalidade
        selectProps={{
          disabled: true,
          mode: 'multiple',
        }}
      />
    );

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        mode: 'multiple',
      })
    );
  });

  it('deve configurar propriedades padrão do Select', () => {
    render(<SelectModalidade />);

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        allowClear: true,
        placeholder: 'Etapa/Modalidade',
        id: 'CF_SELECT_MODALIDADE',
      })
    );
  });

  it('deve limpar anosTurmas e componentesCurriculares ao alterar modalidade', () => {
    render(<SelectModalidade />);

    const props = selectMock.mock.calls[0][0];

    act(() => {
      props.onChange();
    });

    expect(setFieldValueMock).toHaveBeenNthCalledWith(
      1,
      'anosTurmas',
      []
    );

    expect(setFieldValueMock).toHaveBeenNthCalledWith(
      2,
      'componentesCurriculares',
      []
    );
  });

  it('deve configurar campo não obrigatório por padrão', () => {
    render(<SelectModalidade />);

    expect(formItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rules: [
          expect.objectContaining({
            required: false,
          }),
        ],
      })
    );
  });
});