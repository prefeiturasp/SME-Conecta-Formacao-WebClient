/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalEditarNumeroHomologacao } from './modal-editar-numero-homologacao';
import { salvarNumeroHomologacao } from '~/core/services/proposta-service';
import { notification, openNotificationErrors } from '~/components/lib/notification';

jest.mock('~/core/services/proposta-service', () => ({
  salvarNumeroHomologacao: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
  openNotificationErrors: jest.fn(),
}));

jest.mock('~/components/lib/modal', () => {
  return ({ children, title, footer, open }: any) => {
    if (!open) return null;
    return (
      <div data-testid='modal-wrapper'>
        <div data-testid='modal-title'>{title}</div>
        <div data-testid='modal-content'>{children}</div>
        <div data-testid='modal-footer'>{footer}</div>
      </div>
    );
  };
});

describe('ModalEditarNumeroHomologacao', () => {
  const mockOnClose = jest.fn();
  const mockOnSucesso = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Quando a proposta possui vínculo com CODAF (possuiCodaf = true)', () => {
    it('deve exibir mensagem de bloqueio, input desabilitado e apenas o botão Fechar', () => {
      render(
        <ModalEditarNumeroHomologacao
          open={true}
          onClose={mockOnClose}
          propostaId={123}
          numeroHomologacaoAtual={25086}
          possuiCodaf={true}
          onSucesso={mockOnSucesso}
        />,
      );

      expect(screen.getByText('Editar número de homologação')).toBeInTheDocument();
      expect(
        screen.getByText(
          'O número de homologação não pode ser alterado porque a proposta possui vínculo com um registro CODAF.',
        ),
      ).toBeInTheDocument();

      const input = screen.getByLabelText('Número de homologação') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input.value).toBe('25086');

      const btnFechar = screen.getByRole('button', { name: /fechar/i });
      expect(btnFechar).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /salvar/i })).not.toBeInTheDocument();

      fireEvent.click(btnFechar);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Quando a proposta não possui vínculo com CODAF (possuiCodaf = false)', () => {
    it('deve renderizar campo editável com botão Salvar inicialmente desabilitado', () => {
      render(
        <ModalEditarNumeroHomologacao
          open={true}
          onClose={mockOnClose}
          propostaId={123}
          numeroHomologacaoAtual={25086}
          possuiCodaf={false}
          onSucesso={mockOnSucesso}
        />,
      );

      const input = screen.getByLabelText('Número de homologação') as HTMLInputElement;
      expect(input).not.toBeDisabled();
      expect(input.value).toBe('25086');

      const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
      const btnSalvar = screen.getByRole('button', { name: /salvar/i });

      expect(btnCancelar).toBeInTheDocument();
      expect(btnSalvar).toBeInTheDocument();
      expect(btnSalvar).toBeDisabled();

      fireEvent.click(btnCancelar);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('deve habilitar o botão Salvar quando o valor é alterado e permitir salvar com sucesso', async () => {
      (salvarNumeroHomologacao as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: true,
      });

      render(
        <ModalEditarNumeroHomologacao
          open={true}
          onClose={mockOnClose}
          propostaId={123}
          numeroHomologacaoAtual={25086}
          possuiCodaf={false}
          onSucesso={mockOnSucesso}
        />,
      );

      const input = screen.getByLabelText('Número de homologação') as HTMLInputElement;
      const btnSalvar = screen.getByRole('button', { name: /salvar/i });

      // Altera o valor
      fireEvent.change(input, { target: { value: '21587' } });
      expect(input.value).toBe('21587');
      expect(btnSalvar).not.toBeDisabled();

      // Clica em salvar
      fireEvent.click(btnSalvar);

      await waitFor(() => {
        expect(salvarNumeroHomologacao).toHaveBeenCalledWith(123, 21587);
        expect(notification.success).toHaveBeenCalledWith({
          message: 'Sucesso!',
          description: 'O número de homologação foi alterado.',
        });
        expect(mockOnSucesso).toHaveBeenCalledWith(21587);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('deve remover caracteres não numéricos ao digitar', () => {
      render(
        <ModalEditarNumeroHomologacao
          open={true}
          onClose={mockOnClose}
          propostaId={123}
          numeroHomologacaoAtual={null}
          possuiCodaf={false}
          onSucesso={mockOnSucesso}
        />,
      );

      const input = screen.getByLabelText('Número de homologação') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'abc123xyz45' } });
      expect(input.value).toBe('12345');
    });

    it('deve exibir notificação de erro caso a chamada da API lance exceção com mensagens', async () => {
      (salvarNumeroHomologacao as jest.Mock).mockRejectedValueOnce({
        response: {
          data: {
            mensagens: ['Erro ao salvar número de homologação'],
          },
        },
      });

      render(
        <ModalEditarNumeroHomologacao
          open={true}
          onClose={mockOnClose}
          propostaId={123}
          numeroHomologacaoAtual={25086}
          possuiCodaf={false}
          onSucesso={mockOnSucesso}
        />,
      );

      const input = screen.getByLabelText('Número de homologação') as HTMLInputElement;
      const btnSalvar = screen.getByRole('button', { name: /salvar/i });

      fireEvent.change(input, { target: { value: '99999' } });
      fireEvent.click(btnSalvar);

      await waitFor(() => {
        expect(openNotificationErrors).toHaveBeenCalledWith([
          'Erro ao salvar número de homologação',
        ]);
        expect(mockOnSucesso).not.toHaveBeenCalled();
      });
    });
  });
});
