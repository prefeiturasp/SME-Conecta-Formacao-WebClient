/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalAvisoDeltaInscritos from './modal-aviso-delta-inscritos';
import { DeltaInscritosDTO } from '~/core/services/codaf-lista-presenca-service';

describe('ModalAvisoDeltaInscritos', () => {
  const mockOnCancel = jest.fn();
  const mockOnAtualizar = jest.fn();
  const nomeFormacaoMock = 'Formação de Teste React';

  /**
   * @function getMockDelta
   * @description Helper to generate a mock DeltaInscritosDTO based on counts.
   * @param {number} novos - Number of new subscribers.
   * @param {number} removidos - Number of removed subscribers.
   * @returns {DeltaInscritosDTO}
   */
  const getMockDelta = (novos: number, removidos: number): DeltaInscritosDTO => ({
    houveAlteracao: true,
    totalNovos: novos,
    totalRemovidos: removidos,
    inscritosNovos: novos > 0 ? [{
      id: 1,
      nome: 'João Novo',
      documento: '111.111.111-11',
      percentualFrequencia: 0,
      conceitoFinal: '',
      atividadeObrigatorio: false,
      aprovado: false
    }] : [],
    inscritosRemovidos: removidos > 0 ? [
      { id: 2, nome: 'Maria Cancelada', documento: '222.222.222-22' },
      { id: 3, nome: 'José Cancelado', documento: '333.333.333-33' }
    ] : [],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve retornar null e não renderizar a modal se deltaInscritos for nulo', () => {
    const { container } = render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={null}
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('Critério 09: Deve exibir mensagem para APENAS inscritos adicionados', () => {
    render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={getMockDelta(1, 0)} // 1 novo, 0 removidos
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );


    expect(screen.getByText(/A lista de inscritos na formação foi atualizada/i)).toBeInTheDocument();
    expect(screen.getByText(/é necessário inserir informações obrigatórias dos novos cursistas/i)).toBeInTheDocument();
    
    // Garante que a lista de cancelados NÃO está na tela
    expect(screen.queryByText(/Lista de inscrições canceladas/i)).not.toBeInTheDocument();
  });

  test('Critério 08: Deve exibir mensagem para APENAS inscritos cancelados, com o nome da formação', () => {
    render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={getMockDelta(0, 2)} // 0 novos, 2 removidos
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );

    // Verifica a mensagem principal
    expect(screen.getByText(/Algumas inscrições foram canceladas na formação/i)).toBeInTheDocument();
    
    // Verifica se o NOME da formação foi renderizado no DOM
    expect(screen.getByText(nomeFormacaoMock)).toBeInTheDocument();

    // Verifica a seção da lista de cancelados
    expect(screen.getByText(/Lista de inscrições canceladas na formação:/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Cancelada\s*-\s*222\.222\.222-22/i)).toBeInTheDocument();
    expect(screen.getByText(/José Cancelado\s*-\s*333\.333\.333-33/i)).toBeInTheDocument();
  });

  test('Critério 10: Deve exibir mensagem mista para inscritos adicionados E cancelados', () => {
    render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={getMockDelta(1, 2)} // 1 novo, 2 removidos
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );

    // Verifica a mensagem específica do critério 10
    expect(screen.getByText(/Novas inscrições foram adicionadas e algumas canceladas/i)).toBeInTheDocument();
    
    // Verifica se a lista de cancelados foi renderizada
    expect(screen.getByText(/Maria Cancelada\s*-\s*222\.222\.222-22/i)).toBeInTheDocument();
  });

  test('Interação: Deve chamar onCancel ao clicar no botão Cancelar', () => {
    render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={getMockDelta(1, 0)}
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnAtualizar).not.toHaveBeenCalled();
  });

  test('Interação: Deve chamar onAtualizar ao clicar no botão Atualizar inscritos', () => {
    render(
      <ModalAvisoDeltaInscritos
        visible={true}
        nomeFormacao={nomeFormacaoMock}
        deltaInscritos={getMockDelta(1, 0)}
        onCancel={mockOnCancel}
        onAtualizar={mockOnAtualizar}
      />
    );

    const btnAtualizar = screen.getByRole('button', { name: /atualizar inscritos/i });
    fireEvent.click(btnAtualizar);

    expect(mockOnAtualizar).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });
});