/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DrawerAtualizacaoInscritos from './drawer-atualizacao-inscritos';
import { confirmacao } from '~/core/services/alerta-service';

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

// 4. Mock do componente filho (CardInscrito) para isolar o teste do Drawer
jest.mock('./card-inscrito', () => {
  const ReactMock = require('react');
  const { Form, Input } = require('antd');
  
  /**
   * @function MockCardInscrito
   * @description A simplified mock of the CardInscrito component to test form interaction.
   */
  return function MockCardInscrito({ name, onChangeForm }: any) {
    return (
      <div data-testid="mock-card-inscrito">
        {/* Usamos um Form.Item real para que o Antd FormContext reconheça o campo e "suje" o form */}
        <Form.Item name={[name, 'frequencia']}>
          <Input data-testid={`mock-input-${name}`} onChange={onChangeForm} />
        </Form.Item>
      </div>
    );
  };
});

describe('DrawerAtualizacaoInscritos - Regras e Lógica de Formulário', () => {
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

  test('Cenário 1: Não deve renderizar o Drawer quando openModal for false', () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={false}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    expect(screen.queryByText('Atualização de inscritos')).not.toBeInTheDocument();
  });

  test('Cenário 2: Deve renderizar o Drawer e os Cards quando openModal for true', () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // Verifica Título e Descrição
    expect(screen.getByText('Atualização de inscritos')).toBeInTheDocument();
    expect(screen.getByText(/Atualize as informações dos novos inscritos/i)).toBeInTheDocument();
    
    // Verifica se os botões estão presentes
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atualizar inscritos/i })).toBeInTheDocument();

    // Verifica a renderização do Card mockado baseado no array passado
    expect(screen.getAllByTestId('mock-card-inscrito')).toHaveLength(1);
  });

  test('Cenário 3: Deve fechar a modal DIRETAMENTE se clicar em Cancelar com o formulário limpo', () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    // Não deve chamar a confirmação de descarte de dados
    expect(confirmacao).not.toHaveBeenCalled();
    // Deve fechar diretamente
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  test('Cenário 4: Deve exibir a modal de CONFIRMAÇÃO se clicar em Cancelar após alterar o formulário', () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // 1. Simulamos a alteração no campo (sujando o formulário)
    const inputMock = screen.getByTestId('mock-input-0');
    fireEvent.change(inputMock, { target: { value: '85' } });

    // 2. Clicamos em Cancelar
    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    // 3. A função de confirmação ("Deseja cancelar as alterações?") DEVE ser chamada
    expect(confirmacao).toHaveBeenCalledTimes(1);
    expect(mockOnCloseModal).not.toHaveBeenCalled(); // Não fecha ainda

    // 4. Simulamos o clique no botão "OK" da modal de confirmação
    const argsConfirmacao = (confirmacao as jest.Mock).mock.calls[0][0];
    argsConfirmacao.onOk();

    // 5. Agora sim, deve fechar a modal
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  test('Cenário 5: Deve validar o formulário e chamar onSave com os dados ao clicar em Atualizar Inscritos', async () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // Preenche um dado para testar o envio
    const inputMock = screen.getByTestId('mock-input-0');
    fireEvent.change(inputMock, { target: { value: '100' } });

    // Clica no botão primário
    const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
    fireEvent.click(btnAtualizar);

    // Aguarda a validação do Ant Design (que é assíncrona)
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    // O payload enviado no onSave deve conter os dados estruturados do Form.List
    const argumentoChamadaOnSave = (mockOnSave as jest.Mock).mock.calls[0][0];
    
    expect(argumentoChamadaOnSave[0]).toMatchObject({
      id: 1,
      nome: 'João Cursista',
      frequencia: '100', // Valor que alteramos no mock
    });
  });
});