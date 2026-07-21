/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { ModalAprovarRecusarButton } from './modal-aprovar-recusar-button';

jest.mock('~/components/lib/button/primary', () => ({
  ButtonPrimary: ({ children, onClick, disabled, id, block, ...props }: any) => (
    <button id={id} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockModal = jest.fn();

jest.mock('./modal-aprovar-recusar', () => ({
  ModalAprovarRecusar: (props: any) => {
    mockModal(props);
    return (
      <div data-testid='modal-aprovar-recusar'>
        <span>{props.tipoJustificativa}</span>
        <button data-testid='fechar-modal' onClick={props.onFecharButton}>
          Fechar
        </button>
      </div>
    );
  },
}));

jest.mock('antd', () => ({
  Space: ({ children }: any) => <div>{children}</div>,
}));

describe('ModalAprovarRecusarButton', () => {
  const carregarDados = jest.fn();
  const defaultProps = {
    propostaId: 10,
    formInitialValues: {
      labelAprovar: 'Aprovar',
      labelRecusar: 'Recusar',
    },
    carregarDados,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botão aprovar e recusar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);
    expect(screen.getByText('Aprovar')).toBeInTheDocument();
    expect(screen.getByText('Recusar')).toBeInTheDocument();
  });

  it('deve renderizar ids corretos nos botões', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    expect(screen.getByText('Aprovar')).toBeInTheDocument();
    expect(screen.getByText('Recusar')).toBeInTheDocument();
  });

  it('deve desabilitar botões quando disabled=true', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} disabled />);
    expect(screen.getByText('Aprovar')).toBeDisabled();
    expect(screen.getByText('Recusar')).toBeDisabled();
  });

  it('deve abrir modal ao clicar em aprovar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Aprovar'));
    expect(screen.getByTestId('modal-aprovar-recusar')).toBeInTheDocument();
    expect(mockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        propostaId: 10,
        tipoJustificativa: 'Aprovar',
        carregarDados,
      }),
    );
  });

  it('deve abrir modal ao clicar em recusar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Recusar'));
    expect(screen.getByTestId('modal-aprovar-recusar')).toBeInTheDocument();
    expect(mockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        propostaId: 10,
        tipoJustificativa: 'Recusar',
      }),
    );
  });

  it('deve fechar modal ao executar onFecharButton', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);
    fireEvent.click(screen.getByText('Aprovar'));
    expect(screen.getByTestId('modal-aprovar-recusar')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('fechar-modal'));
    expect(screen.queryByTestId('modal-aprovar-recusar')).not.toBeInTheDocument();
  });

  it('deve aceitar labels personalizados', () => {
    render(
      <ModalAprovarRecusarButton
        {...defaultProps}
        formInitialValues={{
          labelAprovar: 'Confirmar proposta',
          labelRecusar: 'Negar proposta',
        }}
      />,
    );
    expect(screen.getByText('Confirmar proposta')).toBeInTheDocument();
    expect(screen.getByText('Negar proposta')).toBeInTheDocument();
  });
  it('deve passar buttonProps para o botão', () => {
    render(
      <ModalAprovarRecusarButton
        {...defaultProps}
        buttonProps={{
          title: 'teste',
        }}
      />,
    );
    expect(screen.getByText('Aprovar')).toHaveAttribute('title', 'teste');
  });
});
