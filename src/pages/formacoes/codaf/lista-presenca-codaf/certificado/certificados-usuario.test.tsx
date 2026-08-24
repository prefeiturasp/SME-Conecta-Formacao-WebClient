/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MeusCertificados from './certificados-usuario';
import {
  obterCertificadosUsuario,
  downloadCertificado,
  obterDeclaracoesUsuario,
  downloadDeclaracao,
} from '../../../../../core/services/codaf-lista-presenca-service';
import { notification } from '../../../../../components/lib/notification';

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
      tableProps[props.columns[0].dataIndex === 'codigoCertificado' ? 'certificados' : 'declaracoes'] = props;
      return <div data-testid={`table-${props.columns[0].dataIndex === 'codigoCertificado' ? 'certificados' : 'declaracoes'}`} />;
    },
    Tabs: ({ items, onChange }: any) => (
      <div>
        {items.map((item: any) => (
          <div key={item.key} data-testid={`tab-${item.key}`}>
            <button onClick={() => onChange(item.key)}>{item.label}</button>
            {item.children}
          </div>
        ))}
      </div>
    ),
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
        items: [{ id: 1, codigoCertificado: 15, nomeFormacao: 'React', numeroHomologacao: '123', dataEmissao: '2025-01-10', tipoParticipacao: 1 }],
      },
    });

    (obterDeclaracoesUsuario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        totalRegistros: 1,
        items: [{ id: 2, codigoDeclaracao: 25, nomeFormacao: 'Angular', codigoFormacao: '456', dataEmissao: '2025-02-10', tipoParticipacao: 2 }],
      },
    });
  });

  describe('Certificados Tab', () => {
    it('should search certificates', async () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Filtrar')); // first is from active tab

      await waitFor(() => expect(obterCertificadosUsuario).toHaveBeenCalled());
      expect(screen.getByTestId('table-certificados')).toBeInTheDocument();
    });

    it('should clear filters', async () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Limpar'));
      
      await waitFor(() => expect(obterCertificadosUsuario).toHaveBeenCalled());
    });

    it('should handle search error', async () => {
      (obterCertificadosUsuario as jest.Mock).mockRejectedValue(new Error());
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Filtrar'));
      await waitFor(() => expect(notification.error).toHaveBeenCalled());
    });

    it('should render columns correctly', () => {
      render(<MeusCertificados />);
      
      const codigo = tableProps['certificados'].columns[0].render(15);
      expect(codigo).toBe('00015');

      const tipo1 = tableProps['certificados'].columns[4].render(1);
      const tipo2 = tableProps['certificados'].columns[4].render(2);
      const tipo3 = tableProps['certificados'].columns[4].render(999);
      expect(tipo1).toBe('Cursista');
      expect(tipo2).toBe('Regente');
      expect(tipo3).toBe('-');
    });

    it('should download successfully', async () => {
      (downloadCertificado as jest.Mock).mockResolvedValue({ sucesso: true, dados: { urlDownload: 'http://teste' } });
      const open = jest.spyOn(window, 'open').mockImplementation(() => null);
      
      render(<MeusCertificados />);
      const botao = tableProps['certificados'].columns[5].render(null, { id: 10 });
      render(botao);
      
      fireEvent.click(screen.getByText('Baixar certificado'));
      await waitFor(() => expect(downloadCertificado).toHaveBeenCalledWith(10));
      expect(open).toHaveBeenCalled();
      open.mockRestore();
    });

    it('should handle download error', async () => {
      (downloadCertificado as jest.Mock).mockResolvedValue({ sucesso: false });
      render(<MeusCertificados />);
      const botao = tableProps['certificados'].columns[5].render(null, { id: 99 });
      render(botao);
      
      fireEvent.click(screen.getByText('Baixar certificado'));
      await waitFor(() => expect(notification.error).toHaveBeenCalled());
    });

    it('should call pagination', () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Filtrar')); // Sets filtroAplicado
      
      tableProps['certificados'].onChange({ current: 2, pageSize: 10 });
      expect(obterCertificadosUsuario).toHaveBeenCalled();
    });

    it('should call pagination with different page size', () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Filtrar')); // Sets filtroAplicado
      
      tableProps['certificados'].onChange({ current: 1, pageSize: 20 });
      expect(obterCertificadosUsuario).toHaveBeenCalled();
    });
  });

  describe('Declaracoes Tab', () => {
    it('should search declaracoes', async () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      fireEvent.click(screen.getByText('Filtrar'));
      
      await waitFor(() => expect(obterDeclaracoesUsuario).toHaveBeenCalled());
      expect(screen.getByTestId('table-declaracoes')).toBeInTheDocument();
    });

    it('should clear filters', async () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      fireEvent.click(screen.getByText('Limpar'));
      
      await waitFor(() => expect(obterDeclaracoesUsuario).toHaveBeenCalled());
    });

    it('should handle search error', async () => {
      (obterDeclaracoesUsuario as jest.Mock).mockRejectedValue(new Error());
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      fireEvent.click(screen.getByText('Filtrar'));
      
      await waitFor(() => expect(notification.error).toHaveBeenCalled());
    });

    it('should render columns correctly', () => {
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      
      const codigo = tableProps['declaracoes'].columns[0].render(25);
      expect(codigo).toBe('00025');

      const tipo1 = tableProps['declaracoes'].columns[4].render(1);
      expect(tipo1).toBe('Cursista');
    });

    it('should download successfully', async () => {
      (downloadDeclaracao as jest.Mock).mockResolvedValue({ sucesso: true, dados: { urlDownload: 'http://teste' } });
      const open = jest.spyOn(window, 'open').mockImplementation(() => null);
      
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      const botao = tableProps['declaracoes'].columns[5].render(null, { id: 20 });
      render(botao);
      
      fireEvent.click(screen.getByText('Baixar declaração'));
      await waitFor(() => expect(downloadDeclaracao).toHaveBeenCalledWith(20));
      expect(open).toHaveBeenCalled();
      open.mockRestore();
    });

    it('should handle download exception', async () => {
      (downloadDeclaracao as jest.Mock).mockRejectedValue(new Error());
      render(<MeusCertificados />);
      fireEvent.click(screen.getByText('Declarações'));
      
      const botao = tableProps['declaracoes'].columns[5].render(null, { id: 21 });
      render(botao);
      
      fireEvent.click(screen.getByText('Baixar declaração'));
      await waitFor(() => expect(notification.error).toHaveBeenCalled());
    });
  });
});