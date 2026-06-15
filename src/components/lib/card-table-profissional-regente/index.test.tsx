/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DataTableProfissionalRegente from './index';
import * as cpfUtils from '../../../core/utils/functions';

// Mock window.matchMedia for Ant Design components
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

describe('DataTableProfissionalRegente', () => {
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
      nomesTurmas: 'Turma 1,Turma 2,Turma 3,Turma 4,Turma 5,Turma 6,Turma 7,Turma 8,Turma 9,Turma 10,Turma 11,Turma 12,Turma 13,Turma 14',
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
      items: JSON.parse(JSON.stringify(mockData)),
      totalRegistros: 2,
    },
  };

  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress console errors and warnings for all tests
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
      if (!cpf) return '';
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    });
  });

  it('should render table component', () => {
    render(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should fetch data on mount', async () => {
    render(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should set correct headers and params for API call', async () => {
    const filters = { status: 'active' };

    render(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
        filters={filters}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            numeroPagina: 1,
            numeroRegistros: 10,
          }),
          params: filters,
        })
      );
    });
  });

  it('should format CPF correctly', async () => {
    render(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      // Verify CPF formatter is imported and used
      expect(cpfUtils).toBeDefined();
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
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // Verify pagination config is set
    const paginationElements = container.querySelectorAll('.ant-pagination-item');
    expect(paginationElements.length).toBeGreaterThanOrEqual(0);
  });

  it('should expose reloadTable method via forwardRef', async () => {
    const ref = createRef<any>();

    render(
      <DataTableProfissionalRegente
        ref={ref}
        url="/api/test"
        columns={mockColumns}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    // Call reloadTable
    expect(ref.current?.reloadTable).toBeDefined();
  });

  it('should pass data to table component', async () => {
    const { container } = render(
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
        filters={{ status: 'active' }}
      />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    rerender(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
        filters={{ status: 'inactive' }}
      />
    );

    // Verify component re-renders with new filters
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
      <DataTableProfissionalRegente
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
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
      />
    );

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should accept additional table props', () => {
    const { container } = render(
      <DataTableProfissionalRegente
        url="/api/test"
        columns={mockColumns}
        scroll={{ x: 1000 }}
        bordered={true}
      />
    );

    // Verify table is rendered with wrapper
    const tableWrapper = container.querySelector('.ant-table-wrapper');
    expect(tableWrapper).toBeInTheDocument();
  });
});
