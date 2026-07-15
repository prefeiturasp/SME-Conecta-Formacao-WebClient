/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';

import React from 'react';
import { render } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../../components/lib/card-table';
import { UsuarioRedeParceriaPaginadoDTO } from '../../../../core/dto/usuario-rede-parceria-dto';
import { ROUTES } from '../../../../core/enum/routes-enum';
import usuarioRedeParceria from '../../../../core/services/usuario-rede-parceria';
import { formatterCPFMask } from '../../../../core/utils/functions';
import { FiltroUsuarioRedeParceriaProps } from '..';
import { UsuarioRedeParceriaListaPaginada } from './index';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="data-table" />),
}));

jest.mock('~/core/services/usuario-rede-parceria', () => ({
  __esModule: true,
  default: {
    obterUsuarioRedeParceria: jest.fn(),
  },
}));

jest.mock('~/core/utils/functions', () => ({
  formatterCPFMask: jest.fn(),
}));

const mockUseNavigate = jest.mocked(useNavigate);
const mockDataTable = jest.mocked(DataTable);
const mockObterUsuarioRedeParceria = jest.mocked(
  usuarioRedeParceria.obterUsuarioRedeParceria,
);
const mockFormatterCPFMask = jest.mocked(formatterCPFMask);

describe('UsuarioRedeParceriaListaPaginada', () => {
  const mockNavigate = jest.fn();

  const row: UsuarioRedeParceriaPaginadoDTO = {
    id: 123,
    areaPromotoraId: 1,
    areaPromotora: 'Área de Tecnologia',
    nome: 'João da Silva',
    cpf: '12345678901',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    situacao: 'Ativo',
  } as UsuarioRedeParceriaPaginadoDTO;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNavigate.mockReturnValue(mockNavigate);
    mockObterUsuarioRedeParceria.mockReturnValue(
      '/usuario-rede-parceria/paginado',
    );
    mockFormatterCPFMask.mockReturnValue('123.456.789-01');
  });

  it('deve renderizar o DataTable com URL, filtros e colunas corretamente', () => {
    const filters = {
      nome: 'João',
      cpf: '12345678901',
      areaPromotoraIds: [1, 2],
      situacao: 'Ativo',
    } as unknown as FiltroUsuarioRedeParceriaProps;

    render(<UsuarioRedeParceriaListaPaginada filters={filters} />);

    expect(mockObterUsuarioRedeParceria).toHaveBeenCalledTimes(1);
    expect(mockDataTable).toHaveBeenCalledTimes(1);

    const dataTableProps = mockDataTable.mock.calls[0][0];

    expect(dataTableProps.url).toBe('/usuario-rede-parceria/paginado');
    expect(dataTableProps.filters).toBe(filters);
    expect(dataTableProps.columns).toHaveLength(4);

    expect(dataTableProps.columns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Área promotora',
          dataIndex: 'areaPromotora',
        }),
        expect.objectContaining({
          title: 'Nome do usuário',
          dataIndex: 'nome',
        }),
        expect.objectContaining({
          title: 'CPF',
          dataIndex: 'cpf',
        }),
        expect.objectContaining({
          title: 'Situação',
          dataIndex: 'situacao',
        }),
      ]),
    );
  });

  it('deve enviar filters como undefined quando nenhum filtro for informado', () => {
    render(<UsuarioRedeParceriaListaPaginada />);

    const dataTableProps = mockDataTable.mock.calls[0][0];

    expect(dataTableProps.filters).toBeUndefined();
  });

  it('deve formatar o CPF utilizando formatterCPFMask', () => {
    render(<UsuarioRedeParceriaListaPaginada />);

    const dataTableProps = mockDataTable.mock.calls[0][0];
    const cpfColumn = dataTableProps.columns?.find(
      (column) =>
        'dataIndex' in column &&
        column.dataIndex === 'cpf',
    );

    expect(cpfColumn).toBeDefined();
    expect(cpfColumn).toHaveProperty('render');

    const renderCPF = cpfColumn?.render;

    if (!renderCPF) {
      throw new Error('A coluna CPF não possui a função render.');
    }

    const result = renderCPF(
      row.cpf,
      row,
      0,
    );

    expect(mockFormatterCPFMask).toHaveBeenCalledTimes(1);
    expect(mockFormatterCPFMask).toHaveBeenCalledWith(row.cpf);
    expect(result).toBe('123.456.789-01');
  });

  it('deve navegar para a tela de edição ao clicar em uma linha', () => {
    render(<UsuarioRedeParceriaListaPaginada />);

    const dataTableProps = mockDataTable.mock.calls[0][0];

    expect(dataTableProps.onRow).toBeDefined();

    const rowEvents = dataTableProps.onRow?.(row, 0);

    expect(rowEvents?.onClick).toBeDefined();

    rowEvents?.onClick?.(
      {} as React.MouseEvent<HTMLElement>,
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(
      `${ROUTES.USUARIO_REDE_PARCERIA}/editar/${row.id}`,
      {
        replace: true,
        state: row,
      },
    );
  });

  it('deve criar um callback de clique específico para cada linha', () => {
    const secondRow = {
      ...row,
      id: 456,
      nome: 'Maria Oliveira',
    } as UsuarioRedeParceriaPaginadoDTO;

    render(<UsuarioRedeParceriaListaPaginada />);

    const dataTableProps = mockDataTable.mock.calls[0][0];

    const firstRowEvents = dataTableProps.onRow?.(row, 0);
    const secondRowEvents = dataTableProps.onRow?.(secondRow, 1);

    firstRowEvents?.onClick?.(
      {} as React.MouseEvent<HTMLElement>,
    );

    secondRowEvents?.onClick?.(
      {} as React.MouseEvent<HTMLElement>,
    );

    expect(mockNavigate).toHaveBeenNthCalledWith(
      1,
      `${ROUTES.USUARIO_REDE_PARCERIA}/editar/${row.id}`,
      {
        replace: true,
        state: row,
      },
    );

    expect(mockNavigate).toHaveBeenNthCalledWith(
      2,
      `${ROUTES.USUARIO_REDE_PARCERIA}/editar/${secondRow.id}`,
      {
        replace: true,
        state: secondRow,
      },
    );
  });
});