/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form, Modal } from 'antd';
import { notification } from '~/components/lib/notification';
import SecaoRetificacoes from './secao-retificacoes';

// --- Mocks ---
jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Modal: {
      ...antd.Modal,
      confirm: jest.fn(),
    },
  };
});

// Resolução de matchMedia exigida pelo Ant Design no ambiente Jest
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

// --- Componente Wrapper para gerenciar estados e Form ---
const SecaoRetificacoesWrapper = (props: any) => {
  const [form] = Form.useForm();
  const [retificacoes, setRetificacoes] = useState<number[]>(props.retificacoesIniciais || [1]);
  const [contadorRetificacoes, setContadorRetificacoes] = useState(1);
  const [retificacoesOriginais, setRetificacoesOriginais] = useState(
    props.retificacoesOriginaisIniciais || new Map()
  );

  // Pré-preenche o form se valores iniciais forem passados para testar o disabled do botão
  React.useEffect(() => {
    if (props.valoresFormulario) {
      form.setFieldsValue(props.valoresFormulario);
    }
  }, [form, props.valoresFormulario]);

  return (
    <Form form={form}>
      <SecaoRetificacoes
        retificacoes={retificacoes}
        setRetificacoes={setRetificacoes}
        contadorRetificacoes={contadorRetificacoes}
        setContadorRetificacoes={setContadorRetificacoes}
        retificacoesOriginais={retificacoesOriginais}
        setRetificacoesOriginais={setRetificacoesOriginais}
        form={form}
        camposBaseadosBloqueados={props.camposBaseadosBloqueados || false}
        aoDeletarRetificacao={props.aoDeletarRetificacao || jest.fn()}
        podeAdicionarNovaRetificacao={props.podeAdicionarNovaRetificacao ?? true}
      />
    </Form>
  );
};

describe('SecaoRetificacoes - Testes de Componente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizacao Inicial', () => {
    test('DadoUmaRetificacaoInicial_QuandoRenderizar_EntaoDeveExibirUmCardDeRetificacao', () => {
      // Arrange & Act
      render(<SecaoRetificacoesWrapper retificacoesIniciais={[1]} />);

      // Assert
      expect(screen.getByText('Retificações')).toBeInTheDocument();
      expect(screen.getByText('Retificação 01')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
    });

    test('DadoMultiplasRetificacoes_QuandoRenderizar_EntaoDeveExibirVariosCards', () => {
      // Arrange & Act
      render(<SecaoRetificacoesWrapper retificacoesIniciais={[1, 2, 3]} />);

      // Assert
      expect(screen.getByText('Retificação 01')).toBeInTheDocument();
      expect(screen.getByText('Retificação 02')).toBeInTheDocument();
      expect(screen.getByText('Retificação 03')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /excluir/i })).toHaveLength(3);
    });
  });

  describe('Regras do Botao Nova Retificacao', () => {
    test('DadoCamposBloqueados_QuandoRenderizar_EntaoBotaoNovaRetificacaoDeveEstarDesabilitado', () => {
      // Arrange
      render(
        <SecaoRetificacoesWrapper
          retificacoesIniciais={[1]}
          camposBaseadosBloqueados={true}
        />
      );

      // Act
      const botaoNova = screen.getByRole('button', { name: /nova retificação/i });

      // Assert
      expect(botaoNova).toBeDisabled();
    });

    test('DadoPermissaoAdicionarFalsa_QuandoRenderizar_EntaoBotaoNovaRetificacaoDeveEstarDesabilitado', () => {
      // Arrange
      render(
        <SecaoRetificacoesWrapper
          retificacoesIniciais={[1]}
          podeAdicionarNovaRetificacao={false}
        />
      );

      // Act
      const botaoNova = screen.getByRole('button', { name: /nova retificação/i });

      // Assert
      expect(botaoNova).toBeDisabled();
    });

    test('DadoCamposNaoPreenchidos_QuandoRenderizar_EntaoBotaoNovaRetificacaoDeveEstarDesabilitado', () => {
      // Arrange
      render(<SecaoRetificacoesWrapper retificacoesIniciais={[1]} />);

      // Act
      const botaoNova = screen.getByRole('button', { name: /nova retificação/i });

      // Assert
      expect(botaoNova).toBeDisabled(); // Desabilitado porque data e página não estão preenchidas
    });
  });

  describe('Regras de Exclusao', () => {
    test('DadoRetificacaoUnicaENaoPersistida_QuandoClicarEmExcluir_EntaoDeveApenasLimparOsCamposSemChamarModal', async () => {
      // Arrange
      render(<SecaoRetificacoesWrapper retificacoesIniciais={[1]} />);
      const botaoExcluir = screen.getByRole('button', { name: /excluir/i });

      // Act
      fireEvent.click(botaoExcluir);

      // Assert
      expect(Modal.confirm).not.toHaveBeenCalled();
      // Como não exclui a última, o card da Retificação 01 ainda deve estar lá
      expect(screen.getByText('Retificação 01')).toBeInTheDocument();
    });

    test('DadoVariasRetificacoesNaoPersistidas_QuandoClicarEmExcluirUma_EntaoDeveRemoverDaListaSemModal', async () => {
      // Arrange
      render(<SecaoRetificacoesWrapper retificacoesIniciais={[1, 2]} />);
      const botoesExcluir = screen.getAllByRole('button', { name: /excluir/i });

      // Act
      fireEvent.click(botoesExcluir[1]); // Clica na segunda retificação

      // Assert
      expect(Modal.confirm).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.queryByText('Retificação 02')).not.toBeInTheDocument();
      });
    });

    test('DadoRetificacaoPersistida_QuandoClicarEmExcluir_EntaoDeveAbrirModalDeConfirmacao', () => {
      // Arrange
      const retificacoesOriginaisMock = new Map();
      retificacoesOriginaisMock.set(1, { id: 99, dataRetificacao: '2026-07-13', paginaRetificacaoDom: 10 });

      render(
        <SecaoRetificacoesWrapper
          retificacoesIniciais={[1]}
          retificacoesOriginaisIniciais={retificacoesOriginaisMock}
        />
      );
      const botaoExcluir = screen.getByRole('button', { name: /excluir/i });

      // Act
      fireEvent.click(botaoExcluir);

      // Assert
      expect(Modal.confirm).toHaveBeenCalledTimes(1);
      expect(Modal.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Excluir retificação',
          okText: 'Excluir',
        })
      );
    });

    test('DadoModalConfirmadoComSucesso_QuandoAoDeletarRetificacaoRetornarSucesso_EntaoDeveExibirNotificacaoDeSucesso', async () => {
      // Arrange
      const aoDeletarMock = jest.fn().mockResolvedValue({ sucesso: true });
      const retificacoesOriginaisMock = new Map();
      retificacoesOriginaisMock.set(1, { id: 99, dataRetificacao: '2026-07-13', paginaRetificacaoDom: 10 });

      // Configura o mock do Modal.confirm para executar o callback onOk imediatamente
      (Modal.confirm as jest.Mock).mockImplementationOnce((config) => {
        config.onOk();
      });

      render(
        <SecaoRetificacoesWrapper
          retificacoesIniciais={[1]}
          retificacoesOriginaisIniciais={retificacoesOriginaisMock}
          aoDeletarRetificacao={aoDeletarMock}
        />
      );

      // Act
      fireEvent.click(screen.getByRole('button', { name: /excluir/i }));

      // Assert
      await waitFor(() => {
        expect(aoDeletarMock).toHaveBeenCalledWith(99);
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({ description: 'Retificação excluída com sucesso' })
        );
      });
    });
  });
});