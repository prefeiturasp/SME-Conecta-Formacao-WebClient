/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import ModalVinculoAreaPromotora from './modal-vinculo-area-promotora';

jest.mock('~/components/lib/modal', () => ({
  __esModule: true,
  default: ({ title, children, footer, open, onCancel, className }: any) => {
    if (!open) {
      return null;
    }

    return (
      <div data-testid='modal' className={className}>
        <div data-testid='titulo'>{title}</div>
        <div>{children}</div>
        <button data-testid='modal-cancel' onClick={onCancel}>
          cancelar modal
        </button>
        <div>{footer}</div>
      </div>
    );
  },
}));

describe('ModalVinculoAreaPromotora', () => {
  const renderComponent = (props: any = {}) => {
    const onClose = jest.fn();

    render(
      <ModalVinculoAreaPromotora
        visible
        onClose={onClose}
        {...props}
      />,
    );

    return { onClose };
  };

  it('deve renderizar modal de vínculo', () => {
    renderComponent();

    expect(screen.getByText('Não é possível excluir a coordenadoria')).toBeInTheDocument();
    expect(screen.getByText(/Esta coordenadoria está vinculada/)).toBeInTheDocument();
  });

  it('deve aplicar classe correta no modal', () => {
    renderComponent();

    expect(screen.getByTestId('modal')).toHaveClass('modal-vinculo-area');
  });

  it('deve renderizar áreas promotoras vinculadas', () => {
    renderComponent({
      areasPromotoras: [
        { id: 1, nome: 'Área Educação' },
        { id: 2, nome: 'Área Tecnologia' },
      ],
    });

    expect(screen.getByText('Área Educação')).toBeInTheDocument();
    expect(screen.getByText('Área Tecnologia')).toBeInTheDocument();
  });

  it('não deve quebrar quando não existem áreas promotoras', () => {
    renderComponent({
      areasPromotoras: [],
    });

    expect(screen.getByText('Áreas promotoras vinculadas:')).toBeInTheDocument();
  });

  it('deve utilizar array vazio como padrão', () => {
    renderComponent({
      areasPromotoras: undefined,
    });

    expect(screen.getByText('Áreas promotoras vinculadas:')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão Voltar', () => {
    const { onClose } = renderComponent();

    fireEvent.click(screen.getByText('Voltar'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose quando modal for cancelado', () => {
    const { onClose } = renderComponent();

    fireEvent.click(screen.getByTestId('modal-cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não deve renderizar quando visible=false', () => {
    render(
      <ModalVinculoAreaPromotora
        visible={false}
        onClose={jest.fn()}
      />,
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});