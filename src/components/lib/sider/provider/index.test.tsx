/**
 * @jest-environment jsdom
 */

import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuContextProvider, { MenuContext } from './index';

const ConsumerComponent = () => {
  const {
    collapsed,
    setCollapsed,
    openKeys,
    setOpenKeys,
    selectedKeys,
    setSelectedKeys,
  } = useContext(MenuContext);

  return (
    <>
      <div data-testid="collapsed">{String(collapsed)}</div>
      <div data-testid="openKeys">{openKeys.join(',')}</div>
      <div data-testid="selectedKeys">{selectedKeys.join(',')}</div>

      <button
        data-testid="setCollapsed"
        onClick={() => setCollapsed(false)}
      >
        collapsed
      </button>

      <button
        data-testid="setOpenKeys"
        onClick={() => setOpenKeys(['menu1', 'menu2'])}
      >
        openKeys
      </button>

      <button
        data-testid="setSelectedKeys"
        onClick={() => setSelectedKeys(['item1'])}
      >
        selectedKeys
      </button>
    </>
  );
};

describe('MenuContextProvider', () => {
  it('deve renderizar os valores iniciais', () => {
    render(
      <MenuContextProvider>
        <ConsumerComponent />
      </MenuContextProvider>,
    );

    expect(screen.getByTestId('collapsed').textContent).toBe('true');
    expect(screen.getByTestId('openKeys').textContent).toBe('');
    expect(screen.getByTestId('selectedKeys').textContent).toBe('');
  });

  it('deve atualizar collapsed', () => {
    render(
      <MenuContextProvider>
        <ConsumerComponent />
      </MenuContextProvider>,
    );

    fireEvent.click(screen.getByTestId('setCollapsed'));

    expect(screen.getByTestId('collapsed').textContent).toBe('false');
  });

  it('deve atualizar openKeys', () => {
    render(
      <MenuContextProvider>
        <ConsumerComponent />
      </MenuContextProvider>,
    );

    fireEvent.click(screen.getByTestId('setOpenKeys'));

    expect(screen.getByTestId('openKeys').textContent).toBe('menu1,menu2');
  });

  it('deve atualizar selectedKeys', () => {
    render(
      <MenuContextProvider>
        <ConsumerComponent />
      </MenuContextProvider>,
    );

    fireEvent.click(screen.getByTestId('setSelectedKeys'));

    expect(screen.getByTestId('selectedKeys').textContent).toBe('item1');
  });

  it('deve renderizar os children', () => {
    render(
      <MenuContextProvider>
        <div data-testid="child">Filho</div>
      </MenuContextProvider>,
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });
});