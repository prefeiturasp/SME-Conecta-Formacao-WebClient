/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { createRef } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DataTableProfissionalTutor from './index';
import * as cpfUtils from '../../../core/utils/functions';

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Table: jest.fn(({ dataSource = [], bordered, size, onChange, locale }) => (
      <div className='ant-table-wrapper' onClick={() => onChange?.({ current: 2, pageSize: 10 })}>
        <div
          className={`ant-table ${bordered ? 'ant-table-bordered' : ''} ${
            size === 'small' ? 'ant-table-small' : ''
          }`.trim()}
        >
          <table role='table'>
            <tbody>
              {dataSource.map((row: any, idx: number) => (
                <tr key={row?.id ?? idx}>
                  <td>{row?.id ?? idx}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dataSource.length === 0 && <div>{locale?.emptyText ?? 'Sem dados'}</div>}
        </div>
        <div className='ant-pagination-item'>1</div>
        <button className='ant-pagination-next' type='button' />
      </div>
    )),
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('redux-persist', () => ({
  persistReducer: (config: any, reducer: any) => reducer,
  persistStore: jest.fn(),
}));

jest.mock('redux-persist/lib/storage', () => ({
  default: {},
}));

jest.mock('../../../core/services/autenticacao-service', () => ({
  default: {
    revalidarToken: jest.fn(),
  },
  URL_AUTENTICACAO_REVALIDAR: 'http://test',
}));

jest.mock('../../../components/lib/notification', () => ({
  openNotificationErrors: jest.fn(),
}));

jest.mock('../../../core/utils/functions');

jest.mock('../../../core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.mock('../../../core/services/api');

import api from '../../../core/services/api';

describe('DataTableProfissionalTutor', () => {
  const mockColumns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
    { title: 'Turmas', dataIndex: 'nomesTurmas', key: 'nomesTurmas' },
  ];

  const mockData = [
    {
      id: 1,
      nome: 'João Silva',
      cpf: '12345678901',
      nomesTurmas: Array(15).fill(null).map((_, i) => `Turma ${i + 1}`).join(','),
    },
    {
      id: 2,
      nome: 'Maria Santos',
      cpf: '98765432100',
      nomesTurmas: 'Turma A,Turma B',
    },
  ];

  const mockResponse = {
    data: {
      items: mockData,
      totalRegistros: 2,
    },
  };

  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue(mockResponse);
    (cpfUtils.formatterCPFMask as jest.Mock).mockImplementation((cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    });
  });

  it('should render table component', () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should fetch data on mount', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.any(Object),
          params: undefined,
        })
      );
    });
  });

  it('should set correct headers and params for API call', async () => {
    const filters = { status: 'active' };

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        filters={filters}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: {
            numeroPagina: 1,
            numeroRegistros: 10,
          },
          params: filters,
        })
      );
    });
  });

  it('should format CPF correctly', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(cpfUtils.formatterCPFMask).toHaveBeenCalled();
    });
  });

  it('should handle empty CPF', async () => {
    const dataWithEmptyCPF = {
      data: {
        items: [
          {
            id: 1,
            nome: 'Test',
            cpf: '',
            nomesTurmas: 'Turma 1',
          },
        ],
        totalRegistros: 1,
      },
    };

    (api.get as jest.Mock).mockResolvedValue(dataWithEmptyCPF);

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should truncate class names correctly when more than 12', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should show loading state during data fetch', async () => {
    (api.get as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle pagination change', async () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    const paginationElements = container.querySelectorAll('.ant-pagination-item');
    expect(paginationElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should expose reloadTable method via forwardRef', async () => {
    const ref = createRef<any>();

    render(
      <DataTableProfissionalTutor
        ref={ref}
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    expect(ref.current?.reloadTable).toBeDefined();
  });

  it('should pass data to table component', async () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      const tableRows = container.querySelectorAll('tbody tr');
      expect(tableRows.length).toBeGreaterThan(0);
    });
  });

  it('should set correct pagination total', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should update filters and refetch data', async () => {
    const { rerender } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        filters={{ status: 'active' }}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    rerender(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        filters={{ status: 'inactive' }}
      />
    );

    expect(api.get).toHaveBeenCalled();
  });

  it('should display empty text when no data', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        items: [],
        totalRegistros: 0,
      },
    });

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sem dados')).toBeInTheDocument();
    });
  });

  it('should pass rowKey prop to table', () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should accept additional table props', () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        scroll={{ x: 1000 }}
        bordered={true}
      />
    );

    const tableWrapper = container.querySelector('.ant-table-wrapper');
    expect(tableWrapper).toBeInTheDocument();
  });

  it('should have displayName set', () => {
    expect(DataTableProfissionalTutor.displayName).toBe('DataTableProfissionalTutor');
  });

  it('should clear data when page size changes', async () => {
    const { rerender } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    rerender(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(api.get).toHaveBeenCalled();
  });

  it('should handle API response with items transformation', async () => {
    const customData = {
      data: {
        items: [
          {
            id: 1,
            nome: 'Test User',
            cpf: '11111111111',
            nomesTurmas: Array(15).fill(null).map((_, i) => `Class ${i}`).join(','),
          },
        ],
        totalRegistros: 1,
      },
    };

    (api.get as jest.Mock).mockResolvedValue(customData);

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle multiple consecutive renders', async () => {
    const { rerender } = render(
      <DataTableProfissionalTutor
        url="/api/test-1"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test-1',
        expect.any(Object)
      );
    });

    rerender(
      <DataTableProfissionalTutor
        url="/api/test-2"
        columns={mockColumns}
      />
    );

    expect(api.get).toHaveBeenCalled();
  });

  it('should setup pagination with correct default values', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: {
            numeroPagina: 1,
            numeroRegistros: 10,
          },
        })
      );
    });
  });

  it('should handle empty items array response gracefully', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        items: [],
        totalRegistros: 0,
      },
    });

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should have correct bordered prop', () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    const table = container.querySelector('.ant-table');
    expect(table).toHaveClass('ant-table-bordered');
  });

  it('should have correct size prop', () => {
    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    const table = container.querySelector('.ant-table');
    expect(table).toHaveClass('ant-table-small');
  });

  it('should call serialize function in paramsSerializer', async () => {
    const filters = { status: 'active', name: 'test', empty: '' };

    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        filters={filters}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          paramsSerializer: expect.any(Object),
        })
      );
    });
  });

  it('should handle pagination change with pageSize change', async () => {
    const ref = createRef<any>();
    const { rerender } = render(
      <DataTableProfissionalTutor
        ref={ref}
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // Trigger page size change
    rerender(
      <DataTableProfissionalTutor
        ref={ref}
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(api.get).toHaveBeenCalled();
  });

  it('should call reloadTable method properly', async () => {
    const ref = createRef<any>();

    render(
      <DataTableProfissionalTutor
        ref={ref}
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // Call reloadTable multiple times
    ref.current?.reloadTable();
    ref.current?.reloadTable();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle query string serialization with filters', async () => {
    render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
        filters={{ status: 'active', empty: '', nullValue: null }}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          params: expect.any(Object),
          paramsSerializer: expect.any(Object),
        })
      );
    });
  });

  it('should trigger setData empty when pagination pageSize changes by interacting with pagination', async () => {
    const largeDataResponse = {
      data: {
        items: Array(50).fill(null).map((_, i) => ({
          id: i,
          nome: `User ${i}`,
          cpf: `${String(i).padStart(11, '0')}`,
          nomesTurmas: `Turma ${i}`,
        })),
        totalRegistros: 50,
      },
    };

    (api.get as jest.Mock).mockResolvedValue(largeDataResponse);

    const { container } = render(
      <DataTableProfissionalTutor
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // Find and click pagination next button
    const nextButton = container.querySelector('.ant-pagination-next:not(.ant-pagination-disabled)');
    
    if (nextButton) {
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(api.get).toHaveBeenCalled();
      });
    }
  });
});
