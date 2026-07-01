/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { ModalAprovarRecusarButton } from './modal-aprovar-recusar-button';

jest.mock('~/components/lib/button/primary', () => ({
  ButtonPrimary: ({ children, onClick, disabled, id }: any) => (
    <button data-testid={id} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('./modal-aprovar-recusar', () => ({
  ModalAprovarRecusar: ({ propostaId, tipoJustificativa, onFecharButton }: any) => (
    <div data-testid="modal">
      <span data-testid="modal-proposta">{propostaId}</span>
      <span data-testid="modal-tipo">{tipoJustificativa}</span>
      <button data-testid="close" onClick={onFecharButton}>
        close
      </button>
    </div>
  ),
}));

//
// TESTS
//

describe('ModalAprovarRecusarButton', () => {
  const carregarDadosMock = jest.fn();

  const defaultProps = {
    propostaId: 123,
    carregarDados: carregarDadosMock,
    formInitialValues: {
      labelAprovar: 'Aprovar proposta',
      labelRecusar: 'Recusar proposta',
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botões com labels corretos', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    expect(screen.getByTestId('CF_BUTTON_APROVAR')).toHaveTextContent(
      'Aprovar proposta',
    );

    expect(screen.getByTestId('CF_BUTTON_RECUSAR')).toHaveTextContent(
      'Recusar proposta',
    );
  });

  it('não deve exibir modal inicialmente', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve abrir modal ao clicar no botão aprovar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    fireEvent.click(screen.getByTestId('CF_BUTTON_APROVAR'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-tipo')).toHaveTextContent(
      'Aprovar proposta',
    );
    expect(screen.getByTestId('modal-proposta')).toHaveTextContent('123');
  });

  it('deve abrir modal ao clicar no botão recusar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    fireEvent.click(screen.getByTestId('CF_BUTTON_RECUSAR'));

    expect(screen.getByTestId('modal-tipo')).toHaveTextContent(
      'Recusar proposta',
    );
  });

  it('deve fechar modal ao clicar no botão de fechar', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} />);

    fireEvent.click(screen.getByTestId('CF_BUTTON_APROVAR'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('deve respeitar disabled nos botões', () => {
    render(<ModalAprovarRecusarButton {...defaultProps} disabled />);

    expect(screen.getByTestId('CF_BUTTON_APROVAR')).toBeDisabled();
    expect(screen.getByTestId('CF_BUTTON_RECUSAR')).toBeDisabled();
  });
});