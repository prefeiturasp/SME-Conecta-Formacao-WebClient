/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ButtonOrdenacao from './index';
import { TipoOrdenacaoEnum } from '../../../../core/enum/tipo-ordenacao';

const dropdownMock = jest.fn();

jest.mock('antd', () => {
  const original = jest.requireActual('antd');

  return {
    ...original,
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    Dropdown: ({ children, menu }: any) => {
      dropdownMock(menu);

      return (
        <div>
          {children}

          <button
            data-testid="click-data"
            onClick={() =>
              menu.onClick({
                key: String(TipoOrdenacaoEnum.DATA),
              })
            }
          />

          <button
            data-testid="click-az"
            onClick={() =>
              menu.onClick({
                key: String(TipoOrdenacaoEnum.AZ),
              })
            }
          />

          <button
            data-testid="click-za"
            onClick={() =>
              menu.onClick({
                key: String(TipoOrdenacaoEnum.ZA),
              })
            }
          />
        </div>
      );
    },
  };
});

jest.mock('react-icons/lu', () => ({
  LuArrowDownUp: ({ size }: any) => (
    <svg data-testid="icon" data-size={size} />
  ),
}));

describe('ButtonOrdenacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão', () => {
    render(<ButtonOrdenacao onClick={jest.fn()} />);

    expect(
      screen.getByRole('button', { name: /ordenar/i })
    ).toBeInTheDocument();
  });

  it('deve renderizar o ícone', () => {
    render(<ButtonOrdenacao onClick={jest.fn()} />);

    expect(screen.getByTestId('icon')).toHaveAttribute(
      'data-size',
      '17'
    );
  });

  it('deve chamar onClick com DATA', () => {
    const onClick = jest.fn();

    render(<ButtonOrdenacao onClick={onClick} />);

    fireEvent.click(screen.getByTestId('click-data'));

    expect(onClick).toHaveBeenCalledWith(
      TipoOrdenacaoEnum.DATA
    );
  });

  it('deve chamar onClick com AZ', () => {
    const onClick = jest.fn();

    render(<ButtonOrdenacao onClick={onClick} />);

    fireEvent.click(screen.getByTestId('click-az'));

    expect(onClick).toHaveBeenCalledWith(
      TipoOrdenacaoEnum.AZ
    );
  });

  it('deve chamar onClick com ZA', () => {
    const onClick = jest.fn();

    render(<ButtonOrdenacao onClick={onClick} />);

    fireEvent.click(screen.getByTestId('click-za'));

    expect(onClick).toHaveBeenCalledWith(
      TipoOrdenacaoEnum.ZA
    );
  });

  it('deve configurar corretamente os itens do menu', () => {
    render(<ButtonOrdenacao onClick={jest.fn()} />);

    expect(dropdownMock).toHaveBeenCalledTimes(1);

    const menu = dropdownMock.mock.calls[0][0];

    expect(menu.items).toHaveLength(3);

    expect(menu.items[0]).toEqual({
      label: 'Decrescente por data de registro',
      key: TipoOrdenacaoEnum.DATA,
    });

    expect(menu.items[1]).toEqual({
      label: 'Por ordem alfabética (A–Z)',
      key: TipoOrdenacaoEnum.AZ,
    });

    expect(menu.items[2]).toEqual({
      label: 'Por ordem alfabética (Z–A)',
      key: TipoOrdenacaoEnum.ZA,
    });
  });
});