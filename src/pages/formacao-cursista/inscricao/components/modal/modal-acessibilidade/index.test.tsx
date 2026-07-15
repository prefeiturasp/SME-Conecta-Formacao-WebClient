/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button, Modal } from 'antd';
import { ModalAcessibilidade } from './index';

jest.mock('antd', () => ({
  Modal: jest.fn(
    ({
      open,
      title,
      children,
      footer,
      onCancel,
    }: {
      open: boolean;
      title: React.ReactNode;
      children: React.ReactNode;
      footer: React.ReactNode[];
      onCancel: () => void;
    }) =>
      open ? (
        <div data-testid="modal">
          <button data-testid="modal-close" onClick={onCancel}>
            Fechar
          </button>

          <div data-testid="modal-title">{title}</div>
          <div data-testid="modal-content">{children}</div>
          <div data-testid="modal-footer">{footer}</div>
        </div>
      ) : null,
  ),
  Button: jest.fn(
    ({
      children,
      onClick,
      type,
      style,
    }: {
      children: React.ReactNode;
      onClick: () => void;
      type?: string;
      style?: React.CSSProperties;
    }) => (
      <button
        type="button"
        data-button-type={type}
        data-testid={`button-${String(children)}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </button>
    ),
  ),
}));

const mockModal = jest.mocked(Modal);
const mockButton = jest.mocked(Button);

describe('ModalAcessibilidade', () => {
  const onCancel = jest.fn();
  const onNaoSalvar = jest.fn();
  const onSalvar = jest.fn();

  const defaultProps = {
    open: true,
    onCancel,
    onNaoSalvar,
    onSalvar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o modal quando open for true', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(mockModal).toHaveBeenCalledTimes(1);
  });

  it('não deve exibir o conteúdo do modal quando open for false', () => {
    render(<ModalAcessibilidade {...defaultProps} open={false} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve enviar corretamente as propriedades estruturais para o Modal', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const modalProps = mockModal.mock.calls[0][0];

    expect(modalProps.open).toBe(true);
    expect(modalProps.centered).toBe(true);
    expect(modalProps.width).toBe(670);
    expect(modalProps.onCancel).toBe(onCancel);
  });

  it('deve configurar corretamente os estilos do rodapé', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const modalProps = mockModal.mock.calls[0][0];

    expect(modalProps.styles).toEqual({
      footer: {
        display: 'flex',
        gap: '8px',
        paddingTop: '8px',
        paddingBottom: '8px',
      },
    });
  });

  it('deve renderizar o título corretamente', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    expect(
      screen.getByText(
        'Salvar informações de acessibilidade no seu cadastro?',
      ),
    ).toBeInTheDocument();
  });

  it('deve configurar corretamente os estilos do título', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const title = screen.getByText(
      'Salvar informações de acessibilidade no seu cadastro?',
    );

    expect(title).toHaveStyle({
      fontWeight: '800',
      fontSize: '20px',
      lineHeight: '100%',
      letterSpacing: '0%',
    });
  });

  it('deve renderizar os textos informativos do modal', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    expect(
      screen.getByText(
        /Você informou necessidades de acessibilidade para esta formação/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Deseja salvar essas informações no seu cadastro para usar automaticamente em próximas inscrições/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Você poderá atualizar ou remover essas informações a qualquer momento/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('"meus dados"')).toBeInTheDocument();
  });

  it('deve renderizar dois botões no rodapé', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Não salvar' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Salvar informações' }),
    ).toBeInTheDocument();

    expect(mockButton).toHaveBeenCalledTimes(2);
  });

  it('deve configurar corretamente o botão "Não salvar"', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const naoSalvarProps = mockButton.mock.calls.find(
      ([props]) => props.children === 'Não salvar',
    )?.[0];

    expect(naoSalvarProps).toBeDefined();
    expect(naoSalvarProps?.onClick).toBe(onNaoSalvar);
    expect(naoSalvarProps?.type).toBeUndefined();
    expect(naoSalvarProps?.style).toEqual({
      flex: 1,
      margin: 0,
      borderColor: '#ff6b35',
      color: '#ff6b35',
      fontWeight: 500,
    });
  });

  it('deve configurar corretamente o botão "Salvar informações"', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const salvarProps = mockButton.mock.calls.find(
      ([props]) => props.children === 'Salvar informações',
    )?.[0];

    expect(salvarProps).toBeDefined();
    expect(salvarProps?.onClick).toBe(onSalvar);
    expect(salvarProps?.type).toBe('primary');
    expect(salvarProps?.style).toEqual({
      flex: 1,
      margin: 0,
    });
  });

  it('deve chamar onCancel ao fechar o modal', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    fireEvent.click(screen.getByTestId('modal-close'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onNaoSalvar).not.toHaveBeenCalled();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  it('deve chamar onNaoSalvar ao clicar em "Não salvar"', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Não salvar' }));

    expect(onNaoSalvar).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  it('deve chamar onSalvar ao clicar em "Salvar informações"', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar informações' }),
    );

    expect(onSalvar).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onNaoSalvar).not.toHaveBeenCalled();
  });

  it('deve manter callbacks independentes em múltiplos cliques', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Não salvar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Não salvar' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar informações' }),
    );
    fireEvent.click(screen.getByTestId('modal-close'));

    expect(onNaoSalvar).toHaveBeenCalledTimes(2);
    expect(onSalvar).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('deve fornecer os elementos corretos no footer do Modal', () => {
    render(<ModalAcessibilidade {...defaultProps} />);

    const modalProps = mockModal.mock.calls[0][0];

    expect(Array.isArray(modalProps.footer)).toBe(true);
    expect(modalProps.footer).toHaveLength(2);

    const footer = modalProps.footer as React.ReactElement[];

    expect(footer[0].key).toBe('nao-salvar');
    expect(footer[1].key).toBe('salvar');
  });
});
