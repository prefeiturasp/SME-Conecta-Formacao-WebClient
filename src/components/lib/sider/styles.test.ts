/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import {
  SiderContainer,
  SiderMenuButtonToggleStyle,
  SiderMenuContainer,
  SiderMenuGroup,
  SiderMenuTitle,
  SiderSubMenuContainer,
} from './styles';

jest.mock('antd', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const Sider = ReactModule.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ children, collapsedSider, ...props }: any, ref) =>
    // avoid JSX in .ts file by using createElement
    ReactModule.createElement('div', { ref, ...props }, children),
  );

  Sider.displayName = 'Sider';

  return {
    Layout: {
      Sider,
    },
  };
});

jest.mock('antd/es/menu/SubMenu', () => {
  const ReactModule =
    jest.requireActual<typeof import('react')>('react');

  const SubMenu = ReactModule.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ children, isSubMenu, collapsed, ...props }: any, ref) =>
    // avoid JSX in .ts file by using createElement
    ReactModule.createElement('div', { ref, ...props }, children),
  );

  SubMenu.displayName = 'SubMenu';

  return {
    __esModule: true,
    default: SubMenu,
  };
});

const theme = {
  colors: {
    colorPrimaryDark: '#112233',
  },
  token: {
    colorPrimary: '#445566',
    colorText: '#778899',
  },
};

const renderComTema = (
  component: React.ReactElement,
) =>
  render(
    React.createElement(
      ThemeProvider,
      { theme },
      component,
    ),
  );

const normalizeCss = (value: string) =>
  value.replace(/\s+/g, '');

const expectCssToContain = (...fragments: string[]) => {
  const css = normalizeCss(
    Array.from(document.querySelectorAll('style'))
      .map((styleElement) => styleElement.textContent ?? '')
      .join(' '),
  );

  fragments.forEach((fragment) => {
    expect(css).toContain(normalizeCss(fragment.replace(/&/g, '')));
  });
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyleRule(
        property: string,
        value: string,
        options?: { modifier?: string; media?: string },
      ): R;
    }
  }
}

expect.extend({
  toHaveStyleRule(
    received: Element | ChildNode | null,
    property: string,
    value: string,
    options?: { modifier?: string; media?: string },
  ) {
    const css = normalizeCss(
      Array.from(document.querySelectorAll('style'))
        .map((styleElement) => styleElement.textContent ?? '')
        .join(' '),
    );

    const fragments = [
      options?.media,
      options?.modifier?.replace(/&/g, ''),
      `${property}: ${value}`,
    ].filter(Boolean) as string[];

    const pass = fragments.every((fragment) =>
      css.includes(normalizeCss(fragment)),
    );

    return {
      pass,
      message: () =>
        `Expected generated CSS to ${pass ? 'not ' : ''}contain ${property}: ${value}`,
    };
  },
});

describe('SiderContainer', () => {
  it('aplica os estilos estruturais padrão', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderContainer,
        { collapsedSider: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'box-shadow',
      '0 0.125rem 0.25rem rgba(0,0,0,1)',
      {
        modifier: '',
      },
    );

    expect(elemento).toHaveStyleRule(
      'text-align',
      'center',
    );

    expect(elemento).toHaveStyleRule(
      'color',
      '#fff',
    );

    expect(elemento).toHaveStyleRule(
      'background-color',
      '#112233',
    );

    expect(elemento).toHaveStyleRule(
      'position',
      'fixed',
    );

    expect(elemento).toHaveStyleRule('left', '0');
    expect(elemento).toHaveStyleRule('top', '0');
    expect(elemento).toHaveStyleRule('bottom', '0');
  });

  it('exibe submenu e mantém altura total quando não está recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderContainer,
        { collapsedSider: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'display',
      'block',
      {
        media: 'screen and (max-width:768px)',
        modifier: '.secound-child-menu-and-sub-menus',
      },
    );

    expect(elemento).toHaveStyleRule(
      'height',
      '100%',
      {
        media: 'screen and (max-width:768px)',
        modifier: '&.ant-layout-sider',
      },
    );
  });

  it('oculta submenu e zera altura quando está recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderContainer,
        { collapsedSider: true },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'display',
      'none',
      {
        media: 'screen and (max-width:768px)',
        modifier: '.secound-child-menu-and-sub-menus',
      },
    );

    expect(elemento).toHaveStyleRule(
      'height',
      '0px',
      {
        media: 'screen and (max-width:768px)',
        modifier: '&.ant-layout-sider',
      },
    );
  });
});

describe('SiderSubMenuContainer', () => {
    it('aplica os estilos quando está recolhido e não é submenu', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderSubMenuContainer,
        { collapsed: true, isSubMenu: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'width',
      '80px',
      {
        modifier: '&.ant-menu-submenu',
      },
    );

    expect(elemento).toHaveStyleRule(
      'height',
      '60px',
      {
        modifier:
          '&.ant-menu-submenu .ant-menu-submenu-title',
      },
    );
  });

  it('aplica os estilos de submenu expandido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderSubMenuContainer,
        { collapsed: false, isSubMenu: true },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'background',
      'white',
      {
        modifier:
          '&.ant-menu-submenu :not(.ant-menu-submenu-open)',
      },
    );

    expect(elemento).toHaveStyleRule(
      'padding-left',
      '22px',
      {
        modifier:
          '&.ant-menu-submenu .ant-menu-submenu-title',
      },
    );

    expect(elemento).toHaveStyleRule(
      'padding-left',
      '52px',
      {
        modifier:
          '&.ant-menu-submenu .ant-menu-item',
      },
    );

    expect(elemento).toHaveStyleRule(
      'width',
      '221px',
      {
        modifier: '&.ant-menu-submenu',
      },
    );
  });

  it('aplica largura reduzida ao submenu recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderSubMenuContainer,
        { collapsed: true, isSubMenu: true },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'width',
      '80px',
      {
        modifier: '&.ant-menu-submenu',
      },
    );

    expect(elemento).toHaveStyleRule(
      'padding-left',
      '52px',
      {
        modifier:
          '&.ant-menu-submenu .ant-menu-item',
      },
    );
  });

  it('aplica estilos para submenu aberto e selecionado', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderSubMenuContainer,
        { collapsed: false, isSubMenu: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'color',
      '#445566',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-open > .ant-menu-submenu-title',
      },
    );

    expect(elemento).toHaveStyleRule(
      'background',
      'white',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-open ul li',
      },
    );

    expect(elemento).toHaveStyleRule(
      'color',
      '#778899',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-open ul li',
      },
    );

    expect(elemento).toHaveStyleRule(
      'background',
      'white',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-selected',
      },
    );

    expect(elemento).toHaveStyleRule(
      'color',
      '#445566',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-selected',
      },
    );

    expect(elemento).toHaveStyleRule(
      'text-decoration',
      'underline',
      {
        modifier:
          '&.ant-menu-submenu.ant-menu-submenu-selected .ant-menu-item-selected',
      },
    );

    expect(elemento).toHaveStyleRule(
      'color',
      'white',
      {
        modifier:
          '&.ant-menu-submenu:not(.ant-menu-submenu-selected) .ant-menu-submenu-title',
      },
    );
  });
});

describe('SiderMenuContainer', () => {
  it('aplica estilos quando não está recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuContainer,
        { collapsed: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'overflow',
      'auto',
    );

    expect(elemento).toHaveStyleRule(
      'height',
      'calc(100vh - 70px)',
    );

    expect(elemento).toHaveStyleRule(
      'width',
      '4px',
      {
        modifier: '::-webkit-scrollbar',
      },
    );

    expect(elemento).toHaveStyleRule(
      'background',
      '#445566',
      {
        modifier: '::-webkit-scrollbar',
      },
    );

    expect(elemento).toHaveStyleRule(
      'gap',
      '20px',
      {
        modifier:
          '.ant-menu-light.ant-menu-root.ant-menu-inline',
      },
    );

    expect(elemento).toHaveStyleRule(
      'display',
      'grid',
      {
        modifier:
          '.ant-menu-light.ant-menu-root.ant-menu-inline',
      },
    );
  });

  it('aplica estilos quando está recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuContainer,
        { collapsed: true },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'gap',
      '4px',
      {
        modifier:
          '.ant-menu-light.ant-menu-root.ant-menu-inline',
      },
    );

    expect(elemento).toHaveStyleRule(
      'padding',
      '16px 0px 0px',
      {
        modifier:
          '.ant-menu-light.ant-menu-root.ant-menu-inline',
      },
    );

    expect(elemento).toHaveStyleRule(
      'display',
      'none',
      {
        modifier:
          '.ant-menu .ant-menu-submenu-arrow',
      },
    );
  });

  it('aplica estilos internos do menu e scrollbar', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuContainer,
        { collapsed: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'background',
      'rgba(255,255,255,0.5)',
      {
        modifier: '::-webkit-scrollbar-thumb',
      },
    );

    expect(elemento).toHaveStyleRule(
      'background',
      'transparent',
      {
        modifier: '.ant-menu',
      },
    );

    expect(elemento).toHaveStyleRule(
      'border-radius',
      '5px',
      {
        modifier: '.ant-menu .ant-menu-inline',
      },
    );

    expect(elemento).toHaveStyleRule(
      'text-align',
      'left',
      {
        modifier: '.ant-menu .ant-menu-item',
      },
    );

    expect(elemento).toHaveStyleRule(
      'white-space',
      'normal',
      {
        modifier:
          '.ant-menu .ant-menu-item .ant-menu-title-content',
      },
    );
  });
});

describe('SiderMenuButtonToggleStyle', () => {
  it('centraliza o conteúdo quando está recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuButtonToggleStyle,
        { collapsed: true },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'background-color',
      '#445566',
    );

    expect(elemento).toHaveStyleRule(
      'display',
      'flex',
    );

    expect(elemento).toHaveStyleRule(
      'align-items',
      'center',
    );

    expect(elemento).toHaveStyleRule(
      'justify-content',
      'center',
    );

    expect(elemento).toHaveStyleRule(
      'height',
      '70px',
    );
  });

  it('distribui o conteúdo e estiliza o botão quando expandido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuButtonToggleStyle,
        { collapsed: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'justify-content',
      'space-between',
    );

    expect(elemento).toHaveStyleRule(
      'border-radius',
      '24px',
      {
        modifier: 'button',
      },
    );

    expect(elemento).toHaveStyleRule(
      'margin-right',
      '6px',
      {
        modifier: 'button',
      },
    );
  });

  it('aplica os estilos da imagem e do botão', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuButtonToggleStyle,
        { collapsed: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'font-family',
      "'Roboto',sans-serif",
      {
        modifier: 'img',
      },
    );

    expect(elemento).toHaveStyleRule(
      'font-size',
      '1.5rem',
      {
        modifier: 'img',
      },
    );

    expect(elemento).toHaveStyleRule(
      'color',
      'white',
      {
        modifier: 'button',
      },
    );

    expect(elemento).toHaveStyleRule(
      'color',
      'white',
      {
        modifier: 'button :hover',
      },
    );
  });
});

describe('SiderMenuGroup', () => {
  it('usa direção em linha quando expandido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuGroup,
        { collapsed: false },
        'Conteúdo',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'display',
      'flex',
    );

    expect(elemento).toHaveStyleRule(
      'align-items',
      'center',
    );

    expect(elemento).toHaveStyleRule(
      'flex-direction',
      'row',
    );
  });

  it('usa direção em coluna quando recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuGroup,
        { collapsed: true },
        'Conteúdo',
      ),
    );

    expect(container.firstChild).toHaveStyleRule(
      'flex-direction',
      'column',
    );
  });
});

describe('SiderIconContainer', () => { 
});

describe('SiderMenuTitle', () => {
  it('aplica tamanho expandido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuTitle,
        { collapsed: false },
        'Título',
      ),
    );

    const elemento = container.firstChild;

    expect(elemento).toHaveStyleRule(
      'font-size',
      '14px',
    );

    expect(elemento).toHaveStyleRule(
      'font-weight',
      '700',
    );

    expect(elemento).toHaveStyleRule(
      'white-space',
      'normal',
    );

    expect(elemento).toHaveStyleRule(
      'line-height',
      '12px',
    );
  });

  it('aplica tamanho recolhido', () => {
    const { container } = renderComTema(
      React.createElement(
        SiderMenuTitle,
        { collapsed: true },
        'Título',
      ),
    );

    expect(container.firstChild).toHaveStyleRule(
      'font-size',
      '10px',
    );
  });
});
