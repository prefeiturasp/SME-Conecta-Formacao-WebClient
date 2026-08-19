/** @jest-environment jsdom */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ModalFinalizarCodaf from './modal-finalizar-codaf';

describe('ModalFinalizarCodaf', () => {
  const defaultProps = {
    modalFinalizarVisible: true,
    onCancelarFinalizarCodaf: jest.fn(),
    finalizandoCodaf: false,
    onConfirmarFinalizarCodaf: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o título e a mensagem de confirmação', () => {
    render(<ModalFinalizarCodaf {...defaultProps} />);

    expect(screen.getByText('Finalização de CODAF')).toBeInTheDocument();
    expect(
      screen.getByText(/Este registro não possui aprovações\. Após a finalização ele não poderá ser editado nem/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Verifique o CODAF antes de finalizar\./i)).toBeInTheDocument();
  });

  it('deve chamar onCancelarFinalizarCodaf ao clicar em cancelar', () => {
    render(<ModalFinalizarCodaf {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(defaultProps.onCancelarFinalizarCodaf).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onConfirmarFinalizarCodaf ao clicar em finalizar', () => {
    render(<ModalFinalizarCodaf {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /finalizar registro codaf/i }));

    expect(defaultProps.onConfirmarFinalizarCodaf).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar ações e indicar loading quando finalizando', () => {
    render(
      <ModalFinalizarCodaf
        {...defaultProps}
        finalizandoCodaf={true}
      />,
    );

    const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
    const finalizarButton = screen.getByRole('button', { name: /finalizar registro codaf/i });

    expect(cancelarButton).toBeDisabled();
    expect(finalizarButton).toHaveClass('ant-btn-loading');
  });
});
