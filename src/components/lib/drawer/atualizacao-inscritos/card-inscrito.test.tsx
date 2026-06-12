/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DrawerAtualizacaoInscritos from './drawer-atualizacao-inscritos';
import { confirmacao } from '~/core/services/alerta-service';

// 1. MOCK DO CSS MODULE
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

// 4. Mock do componente filho (CardInscrito)
jest.mock('./card-inscrito', () => {
  const ReactMock = require('react');
  const { Form, Input } = require('antd');
  
  return function MockCardInscrito({ name, onChangeForm }: any) {
    return (
      <div data-testid="mock-card-inscrito">
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

    expect(screen.getByText('Atualização de inscritos')).toBeInTheDocument();
    expect(screen.getByText(/Atualize as informações dos novos inscritos/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atualizar inscritos/i })).toBeInTheDocument();

    expect(screen.getAllByTestId('mock-card-inscrito')).toHaveLength(1);
  });

  test('Cenário 3: Deve fechar a modal DIRETAMENTE se clicar em Cancelar com o formulário limpo', async () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    
    // O fechamento também aciona resetFields() nativo do form, por isso usamos act()
    await act(async () => {
      fireEvent.click(btnCancelar);
    });

    expect(confirmacao).not.toHaveBeenCalled();
    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  test('Cenário 4: Deve exibir a modal de CONFIRMAÇÃO se clicar em Cancelar após alterar o formulário', async () => {
    render(
      <DrawerAtualizacaoInscritos
        openModal={true}
        onCloseModal={mockOnCloseModal}
        onSave={mockOnSave}
        inscritos={mockInscritos}
      />
    );

    // 1. Simulamos a alteração no campo
    const inputMock = screen.getByTestId('mock-input-0');
    fireEvent.change(inputMock, { target: { value: '85' } });

    // 2. Clicamos em Cancelar
    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(confirmacao).toHaveBeenCalledTimes(1);
    expect(mockOnCloseModal).not.toHaveBeenCalled();

    // 3. Simulamos o clique no botão "OK" da modal (envolvido no act)
    const argsConfirmacao = (confirmacao as jest.Mock).mock.calls[0][0];
    
    await act(async () => {
      argsConfirmacao.onOk();
    });

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

    const inputMock = screen.getByTestId('mock-input-0');
    fireEvent.change(inputMock, { target: { value: '100' } });

    const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
    
    await act(async () => {
      fireEvent.click(btnAtualizar);
    });

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
});