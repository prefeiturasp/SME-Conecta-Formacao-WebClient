
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MeusCertificados from './certificados-usuario';
import {
  obterCertificadosUsuario,
  downloadCertificado,
} from '../../../../core/services/codaf-lista-presenca-service';
import { notification } from '../../../../components/lib/notification';

jest.mock('~/core/services/codaf-lista-presenca-service');
jest.mock('~/components/lib/notification', () => ({
  notification: {
    error: jest.fn(),
  },
}));

const tableProps: any = {};

jest.mock('antd', () => {

  const form = {
    getFieldValue: jest.fn(),
    resetFields: jest.fn(),
  };

  return {
    Col: ({ children }: any) => <div>{children}</div>,
    Row: ({ children }: any) => <div>{children}</div>,
    Select: () => <select />,
    DatePicker: {
      RangePicker: () => <input />,
    },
    Button: ({ children, onClick }: any) => (
      <button onClick={onClick}>{children}</button>
    ),
    Form: Object.assign(
      ({ children }: any) => <div>{children}</div>,
      {
        Item: ({ children }: any) => <div>{children}</div>,
        useForm: () => [form],
      },
    ),
    Table: (props: any) => {
      Object.assign(tableProps, props);
      return <div data-testid="table" />;
    },
  };
});

jest.mock('~/components/lib/header-page', () => () => <div>Header</div>);
jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('~/components/main/text/input-text', () => () => <input />);
jest.mock('~/components/main/numero', () => () => <input />);

describe('MeusCertificados', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (obterCertificadosUsuario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        totalRegistros: 1,
        items: [
          {
            id: 1,
            codigoCertificado: 15,
            nomeFormacao: 'React',
            numeroHomologacao: '123',
            dataEmissao: '2025-01-10',
            tipoParticipacao: 1,
          },
        ],
      },
    });
  });

  it('deve buscar certificados', async () => {
    render(<MeusCertificados />);

    fireEvent.click(screen.getByText('Filtrar'));

    await waitFor(() =>
      expect(obterCertificadosUsuario).toHaveBeenCalled(),
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('deve limpar filtros', () => {
    render(<MeusCertificados />);

    fireEvent.click(screen.getByText('Limpar'));

    expect(
      screen.queryByTestId('table'),
    ).not.toBeInTheDocument();
  });

  it('deve tratar erro na busca', async () => {
    (obterCertificadosUsuario as jest.Mock).mockRejectedValue(
      new Error(),
    );

    render(<MeusCertificados />);

    fireEvent.click(screen.getByText('Filtrar'));

    await waitFor(() =>
      expect(notification.error).toHaveBeenCalled(),
    );
  });

  it('deve renderizar corretamente as colunas', () => {
    render(<MeusCertificados />);

    const codigo = tableProps.columns[0].render(15);
    expect(codigo).toBe('00015');

    const tipo1 = tableProps.columns[4].render(1);
    const tipo2 = tableProps.columns[4].render(2);
    const tipo3 = tableProps.columns[4].render(999);

    expect(tipo1).toBe('Cursista');
    expect(tipo2).toBe('Regente');
    expect(tipo3).toBe('—');
  });

  it('deve fazer download com sucesso', async () => {
    (downloadCertificado as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        urlDownload: 'http://teste',
      },
    });

    const open = jest
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    render(<MeusCertificados />);

    const botao = tableProps.columns[5].render(null, { id: 10 });

    render(botao);

    fireEvent.click(screen.getByText('Baixar certificado'));

    await waitFor(() =>
      expect(downloadCertificado).toHaveBeenCalledWith(10),
    );

    expect(open).toHaveBeenCalled();

    open.mockRestore();
  });

  it('deve tratar erro no download', async () => {
    (downloadCertificado as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    render(<MeusCertificados />);

    const botao = tableProps.columns[5].render(null, { id: 99 });

    render(botao);

    fireEvent.click(screen.getByText('Baixar certificado'));

    await waitFor(() =>
      expect(notification.error).toHaveBeenCalled(),
    );
  });

  it('deve chamar paginação', () => {
    render(<MeusCertificados />);

    tableProps.pagination.onChange(2, 20);

    expect(tableProps.pagination.current).toBeDefined();
  });
});