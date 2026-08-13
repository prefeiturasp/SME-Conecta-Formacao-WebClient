/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Sider, { getItemMenu } from './index';

const menuMock = jest.fn();
const buttonMock = jest.fn();

jest.mock('antd', () => ({
  Button: (props: any) => {
    buttonMock(props);

    return (
      <button
        data-testid="toggle-button"
        onClick={props.onClick}
      >
        button
      </button>
    );
  },

  Menu: (props: any) => {
    menuMock(props);

    return (
      <div data-testid="menu">
        {props.children}
      </div>
    );
  },
}));

jest.mock('antd/es/menu/MenuItem', () => {
  return (props: any) => (
    <div
      data-testid={`menu-item-${props.id}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
});

jest.mock('./styles', () => ({
  SiderContainer: (props: any) => (
    <div
      data-testid="sider-container"
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </div>
  ),

  SiderIconContainer: ({ children }: any) => <div>{children}</div>,
  SiderMenuButtonToggleStyle: ({ children }: any) => <div>{children}</div>,
  SiderMenuContainer: ({ children }: any) => <div>{children}</div>,
  SiderMenuGroup: ({ children }: any) => <div>{children}</div>,
  SiderMenuTitle: ({ children }: any) => <div>{children}</div>,

  SiderSubMenuContainer: ({ children, title }: any) => (
    <div data-testid="submenu">
      {title}
      {children}
    </div>
  ),
}));

jest.mock('react-icons/fa', () => ({
  FaAlignJustify: () => <span>FaAlignJustify</span>,
  FaStream: () => <span>FaStream</span>,
}));

jest.mock('react-icons/io5', () => ({
  IoClose: () => <span>IoClose</span>,
}));

describe('getItemMenu', () => {
  it('deve criar item corretamente', () => {
    const item = getItemMenu(
      '/rota',
      'Título',
      '1',
      'icone',
      []
    );

    expect(item).toEqual({
      url: '/rota',
      title: 'Título',
      key: '1',
      icon: 'icone',
      children: [],
    });
  });
});

describe('Sider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const itens = [
    {
      key: 'menu-1',
      title: 'Menu 1',
      children: [
        {
          key: 'item-1',
          title: 'Item 1',
        },
      ],
    },
  ];

  it('deve renderizar menu', () => {
    render(
      <MemoryRouter>
        <Sider
          items={itens}
          onClick={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('não deve renderizar menu quando items for vazio', () => {
    render(
      <MemoryRouter>
        <Sider
          items={[]}
          onClick={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('deve executar onClick ao clicar em item', () => {
    const onClick = jest.fn();

    render(
      <MemoryRouter>
        <Sider
          items={itens}
          onClick={onClick}
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByTestId('menu-item-item-1')
    );

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'item-1',
      })
    );
  });

  it('deve abrir e fechar pelo botão toggle', () => {
    const onClickMenuButtonToggle = jest.fn();

    render(
      <MemoryRouter>
        <Sider
          items={itens}
          onClick={jest.fn()}
          onClickMenuButtonToggle={
            onClickMenuButtonToggle
          }
        />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByTestId('toggle-button')
    );

    expect(
      onClickMenuButtonToggle
    ).toHaveBeenCalled();
  });

  it('deve renderizar logoMenu', () => {
    render(
      <MemoryRouter>
        <Sider
          items={itens}
          onClick={jest.fn()}
          logoMenu={
            <div data-testid="logo">
              LOGO
            </div>
          }
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
  });

  it('deve chamar onOpenChange do menuProps', () => {
    const onOpenChange = jest.fn();

    render(
      <MemoryRouter>
        <Sider
          items={itens}
          onClick={jest.fn()}
          menuProps={{
            onOpenChange,
          }}
        />
      </MemoryRouter>
    );

    const props = menuMock.mock.calls[0][0];

    act(() => {
      props.onOpenChange(['menu-1']);
    });

    expect(onOpenChange).toHaveBeenCalledWith([
      'menu-1',
    ]);
  });
});