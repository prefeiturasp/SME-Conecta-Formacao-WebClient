/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import DeclaracoesPesquisa from './index';
import { obterDeclaracoesCodaf } from '../../../core/services/codaf-declaracao-service';
import { TipoEmissorEnum } from '../../../core/enum/tipo-emissor';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
});

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  return {
    ...antd,
    Select: ({ options = [], ...props }: any) => (
      <select {...props}>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ),
    DatePicker: (props: any) => <input {...props} />,
    Table: ({ columns, dataSource }: any) => (
      <table>
        <tbody>
          {dataSource.map((record: any) => (
            <tr key={record.id}>
              {columns.map((column: any) => {
                const value = record[column.dataIndex];
                const content = column.render ? column.render(value, record) : value;

                return <td key={column.key}>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    ),
  };
});

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('antd/es/form/Form', () => {
  const { Form: AntdForm } = jest.requireActual('antd');

  return { useForm: AntdForm.useForm };
});

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('~/components/lib/header-page', () => ({ children }: { children: React.ReactNode }) => (
  <header>{children}</header>
));

jest.mock('~/components/lib/card-content', () => ({ children }: { children: React.ReactNode }) => (
  <section>{children}</section>
));

jest.mock('~/components/main/button/voltar', () => () => <button type='button'>Voltar</button>);

jest.mock('~/components/main/input/dre', () => ({
  SelectDRE: () => <Form.Item name='emissorId'><input aria-label='Diretoria Regional de Educação' /></Form.Item>,
}));

jest.mock('~/components/main/numero', () => ({
  __esModule: true,
  default: ({ formItemProps, inputProps }: any) => (
    <Form.Item {...formItemProps}><input {...inputProps} /></Form.Item>
  ),
}));

jest.mock('~/components/main/text/input-text', () => ({
  __esModule: true,
  default: ({ formItemProps, inputProps }: any) => (
    <Form.Item {...formItemProps}><input {...inputProps} /></Form.Item>
  ),
}));

jest.mock('~/core/services/codaf-declaracao-service', () => ({
  obterDeclaracoesCodaf: jest.fn(),
  downloadDeclaracoesLote: jest.fn(),
}));

jest.mock('~/core/services/codaf-lista-presenca-service', () => ({
  downloadDeclaracao: jest.fn(),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  obterTurmasInscricao: jest.fn(),
}));

jest.mock('~/core/services/proposta-service', () => ({
  autocompletarFormacao: jest.fn(),
  obterDetalhesPropostaComTurmasPorId: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { error: jest.fn(), success: jest.fn() },
}));

const obterDeclaracoesCodafMock = obterDeclaracoesCodaf as jest.Mock;

const declaracao = {
  id: 2141,
  numeroHomologacao: 123,
  nomeFormacao: 'Formação de professores fund II',
  documentoCursista: undefined as unknown as string,
  documentoRegente: '801.267.9',
  codigoDeclaracao: 2141,
  tipoDeclaracao: 1,
  dataEmissao: '2026-08-25',
  nomeCursista: undefined as unknown as string,
  nomeRegente: 'Priscilla Boschini Molina',
};

describe('DeclaracoesPesquisa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia os filtros e a paginação ao pesquisar declarações', async () => {
    obterDeclaracoesCodafMock.mockResolvedValue({
      sucesso: true,
      dados: { items: [], totalRegistros: 0, totalPaginas: 0 },
    });

    render(<DeclaracoesPesquisa />);

    fireEvent.change(screen.getByPlaceholderText('Nome da formação...'), {
      target: { value: 'Formação de professores' },
    });
    fireEvent.change(screen.getByPlaceholderText('Código da formação...'), {
      target: { value: '42' },
    });
    fireEvent.change(screen.getByPlaceholderText('Código da declaração...'), {
      target: { value: '2141' },
    });
    fireEvent.change(document.querySelector('#CF_INPUT_RF') as HTMLInputElement, {
      target: { value: '801.267.9' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    await waitFor(() => {
      expect(obterDeclaracoesCodafMock).toHaveBeenCalledWith(expect.objectContaining({
        NomeFormacao: 'Formação de professores',
        CodigoFormacao: 42,
        CodigoDeclaracao: 2141,
        DocumentoCursista: '801.267.9',
        TipoEmissor: TipoEmissorEnum.DRE,
        Pagina: 1,
        TamanhoPagina: 10,
      }));
    });
  });

  it('exibe os dados retornados e seleciona automaticamente o único resultado', async () => {
    obterDeclaracoesCodafMock.mockResolvedValue({
      sucesso: true,
      dados: { items: [declaracao], totalRegistros: 1, totalPaginas: 1 },
    });

    render(<DeclaracoesPesquisa />);

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(await screen.findByText(declaracao.nomeFormacao)).toBeInTheDocument();
    expect(screen.getByText(declaracao.nomeRegente)).toBeInTheDocument();
    expect(screen.getByText('25/08/2026')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Baixar declaração' })).toBeEnabled();
  });

  it('mostra estado vazio quando a busca não retorna declarações', async () => {
    obterDeclaracoesCodafMock.mockResolvedValue({
      sucesso: true,
      dados: { items: [], totalRegistros: 0, totalPaginas: 0 },
    });

    render(<DeclaracoesPesquisa />);

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(await screen.findByText('Sem dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Baixar declaração' })).toBeDisabled();
  });
});