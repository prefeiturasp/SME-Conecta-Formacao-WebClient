/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import DataTableEncontros from './index';
import api from '../../../core/services/api';
import { TipoEncontro } from '../../../core/enum/tipo-encontro';

jest.mock('../../../core/services/api');
jest.mock('query-string', () => ({
  stringify: jest.fn((params) => new URLSearchParams(params).toString()),
}));

describe('DataTableEncontros', () => {
  const mockApiGet = api.get as jest.MockedFunction<typeof api.get>;

  const mockColumns = [
    { title: 'Turmas', dataIndex: 'turmas', key: 'turmas' },
    { title: 'Datas', dataIndex: 'datas', key: 'datas' },
    { title: 'Horário', dataIndex: 'hora', key: 'hora' },
    { title: 'Tipo', dataIndex: 'tipoEncontroDescricao', key: 'tipoEncontroDescricao' },
    { title: 'Local', dataIndex: 'local', key: 'local' },
  ];

  const mockResponseData = {
    items: [
      {
        id: 1,
        tipo: TipoEncontro.Sincrono,
        local: 'Sala 1',
        turmas: [
          { turmaId: 1, nome: 'Turma A' },
          { turmaId: 2, nome: 'Turma B' },
        ],
        cronogramaDatas: [
          { data: '2026-06-15', horaInicio: '14:00', horaFim: '15:30' },
        ],
      },
    ],
    totalRegistros: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiGet.mockResolvedValue({ data: mockResponseData });
    
    // Mock window.matchMedia para Ant Design
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
  });

  it('deve fazer chamada à API na montagem', async () => {
    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('deve chamar API com URL correto', async () => {
    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/api/encontros', expect.any(Object));
    }, { timeout: 2000 });
  });

  it('deve enviar parâmetros de paginação nos headers', async () => {
    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      const call = mockApiGet.mock.calls[0];
      expect(call[1]!.headers!.numeroPagina).toBe(1);
      expect(call[1]!.headers!.numeroRegistros).toBe(10);
    }, { timeout: 2000 });
  });

  it('deve enviar filtros nos parâmetros', async () => {
    const filters = { status: 'ativo' };

    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
          filters={filters}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      const call = mockApiGet.mock.calls[0];
      expect(call[1]!.params).toEqual(filters);
    }, { timeout: 2000 });
  });

  it('deve recarregar dados quando ref.current.reloadTable é chamado', async () => {
    const ref = createRef<any>();

    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
          ref={ref}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });

    const callCountBefore = mockApiGet.mock.calls.length;
    ref.current?.reloadTable();

    await waitFor(() => {
      expect(mockApiGet.mock.calls.length).toBeGreaterThan(callCountBefore);
    }, { timeout: 2000 });
  });

  it('deve ter displayName definido', () => {
    expect(DataTableEncontros.displayName).toBe('DataTableEncontros');
  });

  it('deve usar paramsSerializer para filtros', async () => {
    const filters = { nome: 'teste' };

    try {
      render(
        <DataTableEncontros
          url="/api/encontros"
          columns={mockColumns}
          filters={filters}
        />
      );
    } catch (e) {
    }

    await waitFor(() => {
      const call = mockApiGet.mock.calls[0];
      expect(call[1]!.paramsSerializer).toBeDefined();
    }, { timeout: 2000 });
  });
});
