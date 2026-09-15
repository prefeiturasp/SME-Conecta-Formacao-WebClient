/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'antd';

import FiltrosPesquisaDocumentos, { FiltrosPesquisaDocumentosProps } from './filtros-pesquisa-documentos';

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

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

jest.mock('~/core/services/dre-service', () => ({
  obterDREs: jest.fn().mockResolvedValue({ sucesso: true, dados: [] }),
  obterDREsUsuarioLogado: jest.fn().mockResolvedValue({ sucesso: true, dados: [] }),
}));

describe('FiltrosPesquisaDocumentos', () => {
  const onClickFiltrar = jest.fn();
  const onClickLimpar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = async (props: Partial<FiltrosPesquisaDocumentosProps> = {}) => {
    const Wrapper = () => {
      const [form] = Form.useForm();

      return (
        <Form form={form}>
          <FiltrosPesquisaDocumentos
            tipo='certificados'
            rfCursistaDisabled={false}
            rfRegenteDisabled={false}
            turmaDisabled={false}
            turmas={[]}
            loading={false}
            onClickFiltrar={onClickFiltrar}
            onClickLimpar={onClickLimpar}
            {...props}
          />
        </Form>
      );
    };

    const utils = render(<Wrapper />);
    // aguarda a resolução do fetch mockado de DREs para não vazar setState para o próximo teste
    await act(async () => {
      await Promise.resolve();
    });
    return utils;
  };

  it('exibe os rótulos específicos para certificados', async () => {
    await renderizar({ tipo: 'certificados' });

    expect(screen.getByText('Tipo de certificado')).toBeInTheDocument();
    expect(screen.getByText('Código do certificado')).toBeInTheDocument();
    expect(screen.getByText('RF do regente')).toBeInTheDocument();
  });

  it('exibe os rótulos específicos para declarações', async () => {
    await renderizar({ tipo: 'declaracoes' });

    expect(screen.getByText('Tipo de declaração')).toBeInTheDocument();
    expect(screen.getByText('Código da declaração')).toBeInTheDocument();
    expect(screen.getByText('RF ou CPF do regente')).toBeInTheDocument();
  });

  it('chama onClickFiltrar ao clicar em Filtrar', async () => {
    await renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(onClickFiltrar).toHaveBeenCalledTimes(1);
  });

  it('chama onClickLimpar ao clicar em Limpar filtros', async () => {
    await renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(onClickLimpar).toHaveBeenCalledTimes(1);
  });

  it('não exibe o botão Limpar filtros quando onClickLimpar não é informado', async () => {
    await renderizar({ onClickLimpar: undefined });

    expect(screen.queryByRole('button', { name: 'Limpar filtros' })).not.toBeInTheDocument();
  });

  it('desabilita o campo RF ou CPF do cursista quando rfCursistaDisabled é true', async () => {
    await renderizar({ rfCursistaDisabled: true });

    expect(screen.getByPlaceholderText('RF ou CPF do cursista')).toBeDisabled();
  });

  it('desabilita o campo do regente quando rfRegenteDisabled é true', async () => {
    await renderizar({ rfRegenteDisabled: true });

    expect(screen.getByPlaceholderText('RF do regente')).toBeDisabled();
  });

  it('desabilita o select de turma quando turmaDisabled é true', async () => {
    await renderizar({ turmaDisabled: true });

    expect(screen.getAllByRole('combobox').find((el) => el.getAttribute('disabled') !== null)).toBeTruthy();
  });

  it('exibe o botão Filtrar em estado de loading', async () => {
    await renderizar({ loading: true });

    expect(screen.getByRole('button', { name: /Filtrar/i })).toHaveClass('ant-btn-loading');
  });

  it('lista as opções de turma informadas', async () => {
    await renderizar({
      turmas: [{ id: 1, descricao: 'Turma A' } as any],
    });

    expect(screen.getAllByRole('combobox')[1]).toHaveTextContent('');
  });
});
