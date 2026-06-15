/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconButtonDataTable } from './index';

const MockIcon = ({ size }: { size?: number }) => (
  <svg data-testid="mock-icon" data-size={size} />
);

describe('IconButtonDataTable', () => {
  it('deve renderizar corretamente', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('deve renderizar os children', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
      >
        Editar
      </IconButtonDataTable>
    );

    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const onClick = jest.fn();

    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={onClick}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onClick quando estiver desabilitado', () => {
    const onClick = jest.fn();

    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={onClick}
        disabled
      />
    );

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

 it('deve aplicar a cor quando habilitado', () => {
  render(
    <IconButtonDataTable
      Icon={MockIcon as any}
      onClick={jest.fn()}
      color="#ff0000"
    />
  );

  expect(screen.getByRole('button')).toHaveStyle({
    color: 'rgb(255, 0, 0)',
  });
});

  it('não deve aplicar a cor quando estiver desabilitado', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
        color="red"
        disabled
      />
    );

    expect(screen.getByRole('button')).not.toHaveStyle({
      color: 'red',
    });
  });

  it('deve renderizar o tooltip', async () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
        tooltipTitle="Excluir registro"
      />
    );

    fireEvent.mouseOver(screen.getByRole('button'));

    expect(
      await screen.findByText('Excluir registro')
    ).toBeInTheDocument();
  });

  it('deve renderizar o ícone com tamanho 20', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByTestId('mock-icon')).toHaveAttribute(
      'data-size',
      '20'
    );
  });

  it('deve aceitar type primary', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
        type="primary"
      />
    );

    expect(screen.getByRole('button')).toHaveClass('ant-btn-primary');
  });

  it('deve usar o type default quando não informado', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
      />
    );

    expect(screen.getByRole('button')).toHaveClass('ant-btn-default');
  });

  it('deve aceitar backgroundColor', () => {
    render(
      <IconButtonDataTable
        Icon={MockIcon as any}
        onClick={jest.fn()}
        backgroundColor="#123456"
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});