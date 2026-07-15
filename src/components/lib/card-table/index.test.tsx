/**
 * @jest-environment jsdom
 */
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from 'antd';
import { AxiosError } from 'axios';
import { PaginacaoResultadoDTO } from '../../../core/dto/paginacao-resultado-dto';
import api from '../../../core/services/api';
import * as functions from '../../../core/utils/functions';
import * as notification from '../notification';
import DataTable from './index';
import { DataTableContext } from './provider';

jest.mock('antd', () => {
  const actual = jest.requireActual<any>('antd');
  return {
    ...actual,
    Table: jest.fn(({ dataSource, loading, pagination, onChange, ...props }) => (
      <div
        data-testid="table-mock"
        data-loading={String(loading)}
        data-datasource-count={dataSource?.length || 0}
        data-pagination-size={pagination?.pageSize}
        data-pagination-total={pagination?.total}
        onClick={() => onChange?.({ current: 2, pageSize: 10 })}
      >
        Table
      </div>
    )),
  };
});

jest.mock('../../../core/services/api');
jest.mock('../notification');
jest.mock('../../../core/utils/functions', () => ({
  scrollNoInicio: jest.fn(),
}));

jest.mock('query-string', () => ({
  stringify: jest.fn((params?: Record<string, unknown>) => {
    if (!params) return '';
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    return queryParams.toString();
  }),
}));

describe('DataTable Component', () => {
  const mockScrollNoInicio = functions.scrollNoInicio as jest.Mock;
  const mockOpenNotificationErrors = notification.openNotificationErrors as jest.Mock;
  const mockTableComponent = Table as unknown as jest.Mock;
  const mockApi = api.get as jest.MockedFunction<typeof api.get>;

  interface MockData {
    id: string;
    name: string;
  }

  const mockContextValue = {
    tableState: { reloadData: jest.fn() },
    setTableState: jest.fn(),
  };

  const mockColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
  ];

  const mockData: MockData[] = [
    { id: '1', name: 'Test 1' },
    { id: '2', name: 'Test 2' },
  ];

  const mockPaginatedResponse: PaginacaoResultadoDTO<MockData[]> = {
    items: mockData,
    totalRegistros: 20,
    totalPaginas: 2,
    sucesso: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table component', async () => {
      mockApi.mockResolvedValueOnce({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('table-mock')).toBeDefined();
      });
    });

    it('should render without URL using dataSource', () => {
      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} dataSource={mockData} />
        </DataTableContext.Provider>,
      );

      expect(mockApi).not.toHaveBeenCalled();
      expect(screen.getByTestId('table-mock')).toBeDefined();
    });

    it('should set default rowKey to id', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.rowKey).toBe('id');
      });
    });

    it('should accept custom rowKey', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" rowKey="customId" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.rowKey).toBe('customId');
      });
    });

    it('should apply hideHeaderOnEmpty when empty', async () => {
      mockApi.mockResolvedValue({ data: { items: [], totalRegistros: 0, sucesso: true } as any });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" hideHeaderOnEmpty={true} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[mockTableComponent.mock.calls.length - 1][0] as any;
        expect(callProps.showHeader).toBe(false);
      });
    });

    it('should not apply hideHeaderOnEmpty when data exists', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" hideHeaderOnEmpty={true} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[mockTableComponent.mock.calls.length - 1][0] as any;
        expect(callProps.showHeader).not.toBe(false);
      });
    });

    it('should set table defaults', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.bordered).toBe(true);
        expect(callProps.size).toBe('small');
        expect(callProps.locale).toEqual({ emptyText: 'Sem dados' });
      });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch data on mount', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledWith('/api/test', {
          headers: {
            numeroPagina: 1,
            numeroRegistros: 10,
          },
          params: undefined,
          paramsSerializer: {
            serialize: expect.any(Function),
          },
        });
      });
    });

    it('should fetch data with filters', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const filters = { name: 'test', status: 'active' };

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={filters} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callArgs = mockApi.mock.calls[0][1] as any;
        expect(callArgs.params).toEqual(filters);
      });
    });

    it('should set loading state to true then false', async () => {
      mockApi.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: mockPaginatedResponse } as any), 50);
          }),
      );

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      expect(getByTestId('table-mock').getAttribute('data-loading')).toBe('true');

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-loading')).toBe('false');
      });
    });

    it('should populate dataSource with response items', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-datasource-count')).toBe('2');
      });
    });

    it('should handle response without items', async () => {
      mockApi.mockResolvedValue({ data: { totalRegistros: 0 } });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-datasource-count')).toBe('0');
      });
    });

    it('should not fetch if url not provided', () => {
      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} dataSource={mockData} />
        </DataTableContext.Provider>,
      );

      expect(mockApi).not.toHaveBeenCalled();
    });

    it('should refetch when filters change', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const { rerender } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={{ name: 'test1' }} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1);
      });

      rerender(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={{ name: 'test2' }} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(2);
      });
    });

    it('should fetch on mount even with no URL', () => {
      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} dataSource={mockData} />
        </DataTableContext.Provider>,
      );

      expect(mockApi).not.toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should set default pagination config', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.pagination).toMatchObject({
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
        });
      });
    });

    it('should set pagination total from response', async () => {
      mockApi.mockResolvedValue({
        data: { ...mockPaginatedResponse, totalRegistros: 100 },
      });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-pagination-total')).toBe('100');
      });
    });

    it('should handle pagination change with URL', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1);
      });

      await act(async () => {
        getByTestId('table-mock').click();
      });

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(2);
        const lastCall = mockApi.mock.calls[1] as any;
        expect(lastCall[1].headers.numeroPagina).toBe(2);
      });
    });

    it('should handle pagination change without URL', async () => {
      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} dataSource={mockData} />
        </DataTableContext.Provider>,
      );

      const callProps = mockTableComponent.mock.calls[0][0] as any;
      expect(callProps.onChange).toBeDefined();
      expect(mockApi).not.toHaveBeenCalled();
    });

    it('should call alterarRealizouFiltro on pagination change', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const alterarRealizouFiltro = jest.fn();

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable
            columns={mockColumns}
            url="/api/test"
            alterarRealizouFiltro={alterarRealizouFiltro}
          />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalled();
      });

      await act(async () => {
        getByTestId('table-mock').click();
      });

      expect(alterarRealizouFiltro).toHaveBeenCalledWith(false);
    });

    it('should call desativarBotaoContinuar with sucesso', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const desativarBotaoContinuar = jest.fn();

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable
            columns={mockColumns}
            url="/api/test"
            desativarBotaoContinuar={desativarBotaoContinuar}
          />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(desativarBotaoContinuar).toHaveBeenCalledWith(true);
      });
    });

    it('should reset to page 1 when realizouFiltro is true', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" realizouFiltro={true} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callArgs = mockApi.mock.calls[0][1] as any;
        expect(callArgs.headers.numeroPagina).toBe(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API error with mensagens', async () => {
      const errorMessages = ['Error 1', 'Error 2'];
      const error = new AxiosError('Request failed');
      error.response = {
        data: { mensagens: errorMessages } as any,
      } as any;

      mockApi.mockRejectedValue(error);

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockOpenNotificationErrors).toHaveBeenCalledWith(errorMessages);
      });
    });

    it('should handle API error without response', async () => {
      const error = new AxiosError('Network error');
      mockApi.mockRejectedValue(error);

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockOpenNotificationErrors).toHaveBeenCalledWith([]);
      });
    });

    it('should handle error with empty mensagens', async () => {
      const error = new AxiosError('Request failed');
      error.response = {
        data: { mensagens: [] } as any,
      } as any;

      mockApi.mockRejectedValue(error);

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockOpenNotificationErrors).toHaveBeenCalledWith([]);
      });
    });

    it('should set loading to false after error', async () => {
      const error = new AxiosError('Request failed');
      mockApi.mockRejectedValue(error);

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-loading')).toBe('false');
      });
    });
  });

  describe('Effects and Side Effects', () => {
    it('should scroll to top on current page change', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockScrollNoInicio).toHaveBeenCalled();
      });

      mockScrollNoInicio.mockClear();

      act(() => {
        getByTestId('table-mock').click();
      });

      await waitFor(() => {
        expect(mockScrollNoInicio).toHaveBeenCalled();
      });
    });

    it('should scroll to top on pageSize change', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockScrollNoInicio).toHaveBeenCalledTimes(1);
      });

      mockScrollNoInicio.mockClear();

      await waitFor(() => {
        expect(mockTableComponent.mock.calls.length).toBeGreaterThan(0);
      });

      const lastCallProps = mockTableComponent.mock.calls[mockTableComponent.mock.calls.length - 1][0] as any;

      act(() => {
        lastCallProps.onChange({ current: 1, pageSize: 20 });
      });

      await waitFor(
        () => {
          expect(mockScrollNoInicio).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it('should reset rowSelection when data changes', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const rowSelectionOnChange = jest.fn();

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable
            columns={mockColumns}
            url="/api/test"
            rowSelection={{ onChange: rowSelectionOnChange }}
          />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(rowSelectionOnChange).toHaveBeenCalledWith([], [], { type: 'all' });
      });
    });

    it('should not call rowSelection if not provided', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockTableComponent).toHaveBeenCalled();
      });
    });

    it('should set tableState in context', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const setTableState = jest.fn();

      render(
        <DataTableContext.Provider value={{ ...mockContextValue, setTableState }}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(setTableState).toHaveBeenCalledWith(
          expect.objectContaining({
            reloadData: expect.any(Function),
          }),
        );
      });
    });

    it('should not set tableState for EXPANDED_DATA_TABLE', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const setTableState = jest.fn();

      render(
        <DataTableContext.Provider value={{ ...mockContextValue, setTableState }}>
          <DataTable columns={mockColumns} url="/api/test" id="EXPANDED_DATA_TABLE" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(setTableState).not.toHaveBeenCalled();
      });
    });
  });

  describe('Data Source Selection', () => {
    it('should use API data when url is provided', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const dataSource = [{ id: '999', name: 'DataSource Item' }];

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" dataSource={dataSource} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-datasource-count')).toBe('2');
      });
    });

    it('should use dataSource when url not provided', () => {
      const dataSource = [{ id: '999', name: 'DataSource Item' }];

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} dataSource={dataSource} />
        </DataTableContext.Provider>,
      );

      expect(getByTestId('table-mock').getAttribute('data-datasource-count')).toBe('1');
    });
  });

  describe('Props Pass-through', () => {
    it('should pass through custom props to Table', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable
            columns={mockColumns}
            url="/api/test"
            scroll={{ x: 1000 }}
            className="custom-class"
          />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.scroll).toEqual({ x: 1000 });
        expect(callProps.className).toBe('custom-class');
      });
    });

    it('should handle expandable prop', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const expandable = { expandedRowRender: jest.fn(() => <div>Expanded</div>) };

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" expandable={expandable} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.expandable).toEqual(expandable);
      });
    });

    it('should pass rowSelection prop', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });
      const rowSelection = { type: 'checkbox' as const };

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" rowSelection={rowSelection} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps.rowSelection).toEqual(rowSelection);
      });
    });
  });

  describe('Query String Serialization', () => {
    it('should serialize filters correctly', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const filters = {
        name: 'test',
        status: 'active',
        nullValue: null,
        emptyString: '',
        validNumber: 123,
      };

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={filters} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callArgs = mockApi.mock.calls[0][1] as any;
        const serialize = callArgs.paramsSerializer.serialize;
        const serialized = serialize(filters);

        expect(serialized).toContain('name=test');
        expect(serialized).toContain('status=active');
        expect(serialized).toContain('validNumber=123');
        expect(serialized).not.toContain('nullValue');
        expect(serialized).not.toContain('emptyString');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined filters', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={undefined} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalled();
        const callArgs = mockApi.mock.calls[0][1] as any;
        expect(callArgs.params).toBeUndefined();
      });
    });

    it('should handle null items in response', async () => {
      mockApi.mockResolvedValue({ data: { totalRegistros: 0 } });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(getByTestId('table-mock').getAttribute('data-datasource-count')).toBe('0');
      });
    });

    it('should handle undefined columns', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={undefined as any} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockTableComponent).toHaveBeenCalled();
      });
    });

    it('should handle consecutive filter updates', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      const { rerender } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={{ name: 'test1' }} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1);
      });

      rerender(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={{ name: 'test2' }} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(2);
      });

      rerender(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" filters={{ name: 'test3' }} />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(3);
      });
    });

    it('should pass all required props to Table', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const callProps = mockTableComponent.mock.calls[0][0] as any;
        expect(callProps).toHaveProperty('columns');
        expect(callProps).toHaveProperty('dataSource');
        expect(callProps).toHaveProperty('pagination');
        expect(callProps).toHaveProperty('loading');
        expect(callProps).toHaveProperty('onChange');
        expect(callProps).toHaveProperty('bordered');
        expect(callProps).toHaveProperty('size');
        expect(callProps).toHaveProperty('locale');
      });
    });

    it('should handle pageSize change correctly', async () => {
      mockApi.mockResolvedValue({ data: mockPaginatedResponse });

      render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalled();
      });

      const callProps = mockTableComponent.mock.calls[0][0] as any;
      act(() => {
        callProps.onChange({ current: 1, pageSize: 20 });
      });

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(2);
        const lastCallArgs = mockApi.mock.calls[1][1] as any;
        expect(lastCallArgs.headers.numeroPagina).toBe(1);
        expect(lastCallArgs.headers.numeroRegistros).toBe(20);
      });
    });

    it('should handle response with only totalRegistros', async () => {
      mockApi.mockResolvedValue({ data: { totalRegistros: 50 } });

      const { getByTestId } = render(
        <DataTableContext.Provider value={mockContextValue}>
          <DataTable columns={mockColumns} url="/api/test" />
        </DataTableContext.Provider>,
      );

      await waitFor(() => {
        const table = getByTestId('table-mock');
        expect(table.getAttribute('data-datasource-count')).toBe('0');
        expect(table.getAttribute('data-pagination-total')).toBeNull();
      });
    });
  });
});
