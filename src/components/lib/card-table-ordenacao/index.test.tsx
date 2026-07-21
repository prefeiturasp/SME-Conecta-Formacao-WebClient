/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import DataTableOrdenacao from './index';
import { TipoOrdenacaoEnum } from '../../../core/enum/tipo-ordenacao';

const apiGetMock = jest.fn();

jest.mock('~/core/services/api', () => ({
  __esModule: true,
  default: {
    get: (...args: any[]) => apiGetMock(...args),
  },
}));

jest.mock('query-string', () => ({
  stringify: jest.fn(() => ''),
}));

const tablePropsCapture = jest.fn();

jest.mock('antd', () => ({
  Table: (props: any) => {
    tablePropsCapture(props);

    return (
      <div data-testid="table">
        <button
          data-testid="change-page"
          onClick={() =>
            props.onChange({
              current: 2,
              pageSize: 10,
            })
          }
        >
          mudar página
        </button>

        {JSON.stringify(props.dataSource)}
      </div>
    );
  },
}));

jest.mock('~/components/main/button/ordenacao', () => {
  return (props: any) => (
    <button
      data-testid="ordenacao"
      onClick={() => props.onClick(TipoOrdenacaoEnum.AZ)}
    >
      ordenar
    </button>
  );
});

describe('DataTableOrdenacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    apiGetMock.mockResolvedValue({
      data: {
        items: [
          {
            id: 1,
            nome: 'Registro 1',
          },
        ],
        totalRegistros: 1,
      },
    });
  });

  const renderComponent = () =>
    render(
      <DataTableOrdenacao
        url="/api/teste"
        columns={[
          {
            title: 'Nome',
            dataIndex: 'nome',
          },
        ]}
      />,
    );

  it('deve carregar dados ao montar componente', async () => {
    renderComponent();

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalled();
    });

    expect(apiGetMock).toHaveBeenCalledWith(
     `/api/teste?numeroPagina=1&numeroRegistros=10&ordenacao=${TipoOrdenacaoEnum.DATA}`,
      expect.any(Object),
    );
  });

  it('deve renderizar tabela', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByTestId('table')).toBeTruthy();
    });
  });

  it('deve atualizar dados após retorno da api', async () => {
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText(/Registro 1/i)).toBeTruthy();
    });
  });

  it('deve ordenar ao clicar no botão', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(getByTestId('ordenacao'));
    });

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledTimes(2);
    });
  });

  it('deve alterar página', async () => {
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      fireEvent.click(getByTestId('change-page'));
    });

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledTimes(2);
    });
  });

  it('deve passar loading para a tabela', async () => {
    renderComponent();

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalled();
      expect(tablePropsCapture).toHaveBeenCalled();
    });

    const ultimaChamada =
      tablePropsCapture.mock.calls[
        tablePropsCapture.mock.calls.length - 1
      ][0];

    expect(ultimaChamada.loading).toBeDefined();
  });

  it('deve recarregar quando filters mudar', async () => {
    const { rerender } = render(
      <DataTableOrdenacao
        url="/api/teste"
        filters={{ nome: 'A' }}
        columns={[]}
      />,
    );

    await waitFor(() => {
      expect(apiGetMock).toHaveBeenCalledTimes(1);
    });

    rerender(
      <DataTableOrdenacao
        url="/api/teste"
        filters={{ nome: 'B' }}
        columns={[]}
      />,
    );

    await waitFor(() => {
      expect(apiGetMock.mock.calls.length).toBeGreaterThan(1);
    });
  });
});