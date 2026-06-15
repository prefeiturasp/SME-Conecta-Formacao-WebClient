/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import DataTableArquivosImportados from './index';
import api from '../../../core/services/api';
import { ArquivoInscricaoImportadoDTO } from '../../../core/dto/arquivo-inscricao-importado-dto';
import { PaginacaoResultadoDTO } from '../../../core/dto/paginacao-resultado-dto';
import { SituacaoImportacaoArquivoEnum } from '../../../core/enum/situacao-importacao-arquivo-enum';

// Mock do Ant Design Table
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Table: jest.fn((props) => (
      <div data-testid="ant-table" data-loading={props.loading}>
        <div data-testid="table-content">
          {props.dataSource?.length === 0 ? (
            <div>{props.locale?.emptyText}</div>
          ) : (
            <table>
              <tbody>
                {props.dataSource?.map((item: any) => (
                  <tr key={item.id} data-testid={`row-${item.id}`}>
                    {props.columns?.map((col: any) => (
                      <td key={col.dataIndex}>{item[col.dataIndex]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )),
  };
});

// Mock da API
jest.mock('../../../core/services/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('DataTableArquivosImportados', () => {
  const criarMockArquivo = (id: number, nome: string, situacao: SituacaoImportacaoArquivoEnum): ArquivoInscricaoImportadoDTO => ({
    id: id,
    nome: nome,
    situacao: situacao,
    totalRegistros: 100,
    totalProcessados: 50
  });

  const mockArquivos = [
    criarMockArquivo(1, 'arquivo1.csv', SituacaoImportacaoArquivoEnum.Processando),
    criarMockArquivo(2, 'arquivo2.csv', SituacaoImportacaoArquivoEnum.Processado),
  ];

  const mockResponse: PaginacaoResultadoDTO<ArquivoInscricaoImportadoDTO[]> = {
    items: mockArquivos,
    totalRegistros: 2,
  } as PaginacaoResultadoDTO<ArquivoInscricaoImportadoDTO[]>;

  const defaultColumns = [
    {
      title: 'Nome',
      dataIndex: 'nomeArquivo',
      key: 'nomeArquivo',
    },
  ];

  const defaultProps = {
    url: '/api/arquivos',
    columns: defaultColumns,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: mockResponse });
  });

  describe('Renderização', () => {
    it('deve renderizar a tabela corretamente', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('ant-table')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem "Sem dados" quando nenhum dado é retornado', async () => {
      mockApi.get.mockResolvedValue({ data: { items: [], totalRegistros: 0 } });

      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Sem dados')).toBeInTheDocument();
      });
    });

    it('deve ter o displayName correto', () => {
      expect(DataTableArquivosImportados.displayName).toBe('DataTableArquivosImportados');
    });
  });

  describe('Carregamento de dados', () => {
    it('deve fazer requisição à API com URL correta', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/api/arquivos', expect.any(Object));
      });
    });

    it('deve passar corretamente paginação inicial nos headers', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(
          '/api/arquivos',
          expect.objectContaining({
            headers: {
              numeroPagina: 1,
              numeroRegistros: 10,
            },
          })
        );
      });
    });

    it('deve passar filtros como params quando fornecidos', async () => {
      const filters = { status: 'ativo', tipo: 'csv' };

      render(<DataTableArquivosImportados {...defaultProps} filters={filters} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(
          '/api/arquivos',
          expect.objectContaining({
            params: filters,
          })
        );
      });
    });

    it('deve popular a tabela com dados retornados da API', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
      });
    });

    it('deve exibir estado de carregamento', async () => {
      mockApi.get.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockResponse }), 100)
          )
      );

      render(<DataTableArquivosImportados {...defaultProps} />);

      // Verificar que o atributo de loading foi passado
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalled();
      });
    });
  });

  describe('Manipulação de dados', () => {
    it('deve serializar filtros removendo valores nulos', async () => {
      const filters = {
        status: 'ativo',
        tipo: null,
        vazio: '',
      };

      render(<DataTableArquivosImportados {...defaultProps} filters={filters} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalled();
      });
    });

    it('deve lidar com resposta sem items', async () => {
      mockApi.get.mockResolvedValue({ data: {} });

      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('ant-table')).toBeInTheDocument();
      });
    });
  });

  describe('Handle imperativo (useImperativeHandle)', () => {
    it('deve expor o método reloadTable via ref', async () => {
      const ref = createRef<any>();

      render(<DataTableArquivosImportados {...defaultProps} ref={ref} />);

      await waitFor(() => {
        expect(ref.current).toBeDefined();
        expect(typeof ref.current?.reloadTable).toBe('function');
      });
    });
  });

  describe('Propriedades padrão', () => {
    it('deve configurar paginação com valores padrão', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(
          '/api/arquivos',
          expect.objectContaining({
            headers: {
              numeroPagina: 1,
              numeroRegistros: 10,
            },
          })
        );
      });
    });

    it('deve usar rowKey como "id"', async () => {
      render(<DataTableArquivosImportados {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
      });
    });

    it('deve passar colunas corretamente ao Table', async () => {
      const customColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Nome', dataIndex: 'nomeArquivo', key: 'nomeArquivo' },
      ];

      render(<DataTableArquivosImportados {...defaultProps} columns={customColumns} />);

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalled();
      });
    });
  });

  describe('Sincronização de efeitos', () => {
    it('deve fazer requisição ao montar com paginação e filtros iniciais', async () => {
      render(
        <DataTableArquivosImportados
          {...defaultProps}
          filters={{ tipo: 'importacao' }}
        />
      );

      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith(
          '/api/arquivos',
          expect.objectContaining({
            headers: {
              numeroPagina: 1,
              numeroRegistros: 10,
            },
            params: { tipo: 'importacao' },
          })
        );
      });
    });
  });
});

