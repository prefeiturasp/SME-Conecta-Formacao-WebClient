/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ColumnsType } from 'antd/es/table';
import React from 'react';

import TabelaPesquisaDocumentos from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
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

type Registro = {
  id: React.Key;
  nome: string;
};

const columns: ColumnsType<Registro> = [
  { title: 'Nome', dataIndex: 'nome', key: 'nome' },
];

const dadosMock: Registro[] = [
  { id: 1, nome: 'Documento A' },
  { id: 2, nome: 'Documento B' },
];

describe('TabelaPesquisaDocumentos', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = (props: Partial<React.ComponentProps<typeof TabelaPesquisaDocumentos<Registro>>> = {}) =>
    render(
      <TabelaPesquisaDocumentos
        columns={columns}
        dados={dadosMock}
        loading={false}
        paginaAtual={1}
        registrosPorPagina={10}
        rowSelection={undefined}
        totalRegistros={dadosMock.length}
        onChange={onChange}
        {...props}
      />,
    );

  it('exibe as linhas quando há dados', () => {
    renderizar();

    expect(screen.getByText('Documento A')).toBeInTheDocument();
    expect(screen.getByText('Documento B')).toBeInTheDocument();
  });

  it('exibe mensagem de vazio quando não há dados e não está carregando', () => {
    renderizar({ dados: [], loading: false });

    expect(screen.getByText('Sem dados')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('exibe a tabela em estado de carregamento mesmo sem dados', () => {
    renderizar({ dados: [], loading: true });

    expect(screen.queryByText('Sem dados')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renderiza os cabeçalhos das colunas informadas', () => {
    renderizar();

    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('chama onChange ao mudar de página', () => {
    renderizar({ totalRegistros: 25 });

    fireEvent.click(screen.getByTitle('2'));

    expect(onChange).toHaveBeenCalled();
  });
});
