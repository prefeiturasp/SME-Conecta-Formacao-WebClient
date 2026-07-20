/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DrawerAtualizacaoInscritos from './drawer-atualizacao-inscritos';
import { confirmacao } from '~/core/services/alerta-service';
import { calcularAprovacao } from '~/core/utils/codaf-utils';

// 1. MOCK DO CSS MODULE: Previne o erro "Unexpected token '.'" do Jest
jest.mock('./card-inscrito.module.css', () => ({}));

// 2. Mock do matchMedia (Obrigatório para testes com componentes do Ant Design)
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

// 3. Mock do serviço de alerta
jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

// 4. Mock do motor de regras (Isolamento de Domínio)
jest.mock('~/core/utils/codaf-utils', () => ({
  calcularAprovacao: jest.fn(),
}));

// 5. Mock do componente filho (CardInscrito) para isolar o teste do Drawer
jest.mock('./card-inscrito', () => {
  const ReactMock = require('react');
  const { Form, Input } = require('antd');
  
  return function MockCardInscrito({ name, onChangeForm }: any) {
    return (
      <div data-testid="mock-card-inscrito">
        {/* Usamos um Form.Item real para que o Antd FormContext reconheça o campo e suje o form */}
        <Form.Item name={[name, 'frequencia']}>
          <Input data-testid={`mock-input-${name}`} onChange={onChangeForm} />
        </Form.Item>
      </div>
    );
  };
});

describe('DrawerAtualizacaoInscritos - Regras e Logica de Formulario', () => {
  const mockOnCloseModal = jest.fn();
  const mockOnSave = jest.fn();
  const mockInscritos = [
    {
      id: 1,
      nome: 'João Cursista',
      documento: '123.456.789-00',
    } as any,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('DadoModalFechadaQuandoRenderizarEntaoNaoDeveExibirDrawer', () => {
    // Arrange
    const openModal = false;

    // Act
    render(
      <DrawerAtualizacaoInscritos
        openModal={openModal}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // Assert
    expect(screen.queryByText('Atualização de inscritos')).not.toBeInTheDocument();
  });

  test('DadoModalAbertaQuandoRenderizarEntaoDeveExibirDrawerECards', () => {
    // Arrange
    const openModal = true;

    // Act
    render(
      <DrawerAtualizacaoInscritos
        openModal={openModal}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // Assert
    expect(screen.getByText('Atualização de inscritos')).toBeInTheDocument();
    expect(screen.getByText(/Atualize as informações dos novos inscritos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atualizar inscritos/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-card-inscrito')).toHaveLength(1);
  });

  test('DadoFormularioLimpoQuandoClicarCancelarEntaoDeveFecharModalDiretamente', () => {
    // Arrange
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );
    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });

    // Act
    fireEvent.click(btnCancelar);

    // Assert
    expect(confirmacao).not.toHaveBeenCalled();
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  test('DadoFormularioSujoQuandoClicarCancelarEntaoDeveExibirConfirmacaoAntesDeFechar', () => {
    // Arrange
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );
    const inputMock = screen.getByTestId('mock-input-0');
    
    // Act
    fireEvent.change(inputMock, { target: { value: '85' } });
    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    // Assert
    expect(confirmacao).toHaveBeenCalledTimes(1);
    expect(mockOnCloseModal).not.toHaveBeenCalled();

    // Act - Confirmar fechamento pela Modal
    const argsConfirmacao = (confirmacao as jest.Mock).mock.calls[0][0];
    argsConfirmacao.onOk();

    // Assert
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  test('DadoFormularioPreenchidoQuandoClicarAtualizarEntaoDeveValidarEChamarOnSave', async () => {
    // Arrange
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );
    const inputMock = screen.getByTestId('mock-input-0');
    
    // Act
    fireEvent.change(inputMock, { target: { value: '100' } });
    const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
    fireEvent.click(btnAtualizar);

    // Assert
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    const argumentoChamadaOnSave = (mockOnSave as jest.Mock).mock.calls[0][0];
    expect(argumentoChamadaOnSave[0]).toMatchObject({
      id: 1,
      nome: 'João Cursista',
      frequencia: '100',
    });
  });

  describe('Integracao com Motor de Regras (calcularAprovacao)', () => {
    const regrasBaseMock = {
      frequenciaMinima: 75,
      conceitosAceitos: ['S', 'P'],
      exigeAtividadeObrigatoria: true,
      possuiRegraAvaliacao: true,
    };

    test('DadoAusenciaDeRegrasDeAvaliacaoQuandoAlterarFormularioEntaoNaoDeveChamarMotorDeRegras', () => {
      // Arrange
      render(
        <DrawerAtualizacaoInscritos
          openModal={true}
          onCloseModal={mockOnCloseModal}
          onSave={mockOnSave}
          inscritos={mockInscritos}
          regrasAprovacao={undefined} // Sem regras vinculadas
        />
      );
      const inputMock = screen.getByTestId('mock-input-0');

      // Act
      fireEvent.change(inputMock, { target: { value: '85' } });

      // Assert
      expect(calcularAprovacao).not.toHaveBeenCalled();
    });

    test('DadoRegrasValidasQuandoMotorRetornarVerdadeiroEntaoDeveAtribuirAprovadoComoSim', async () => {
      // Arrange
      (calcularAprovacao as jest.Mock).mockReturnValue(true);
      render(
        <DrawerAtualizacaoInscritos
          openModal={true}
          onCloseModal={mockOnCloseModal}
          onSave={mockOnSave}
          inscritos={mockInscritos}
          regrasAprovacao={regrasBaseMock}
        />
      );
      const inputMock = screen.getByTestId('mock-input-0');

      // Act
      fireEvent.change(inputMock, { target: { value: '100' } });
      const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
      fireEvent.click(btnAtualizar);

      // Assert
      expect(calcularAprovacao).toHaveBeenCalled();
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
      const argumentoChamadaOnSave = (mockOnSave as jest.Mock).mock.calls[0][0];
      
      expect(argumentoChamadaOnSave[0]).toMatchObject({
        aprovado: 'Sim'
      });
    });

    test('DadoRegrasValidasQuandoMotorRetornarFalsoEntaoDeveAtribuirAprovadoComoNao', async () => {
      // Arrange
      (calcularAprovacao as jest.Mock).mockReturnValue(false);
      render(
        <DrawerAtualizacaoInscritos
          openModal={true}
          onCloseModal={mockOnCloseModal}
          onSave={mockOnSave}
          inscritos={mockInscritos}
          regrasAprovacao={regrasBaseMock}
        />
      );
      const inputMock = screen.getByTestId('mock-input-0');

      // Act
      fireEvent.change(inputMock, { target: { value: '50' } });
      const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
      fireEvent.click(btnAtualizar);

      // Assert
      expect(calcularAprovacao).toHaveBeenCalled();
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
      });
      const argumentoChamadaOnSave = (mockOnSave as jest.Mock).mock.calls[0][0];
      
      expect(argumentoChamadaOnSave[0]).toMatchObject({
        aprovado: 'Não'
      });
    });
  });
});