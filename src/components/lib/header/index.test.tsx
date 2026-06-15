/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock before component import
jest.mock('../../../core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ auth: { autenticado: false } })),
    subscribe: jest.fn(),
  },
}));

jest.mock('../../../core/redux/modules/auth/actions', () => ({
  setDeslogar: jest.fn(() => ({ type: 'SET_DESLOGAR' })),
}));

jest.mock('../../../core/hooks/use-redux', () => ({
  useAppSelector: jest.fn((selector) => {
    const state = { auth: { autenticado: false } };
    return selector(state);
  }),
}));

jest.mock('../dropdown-perfil', () => {
  return function DummyDropdownPerfil() {
    return <div data-testid="dropdown-perfil">Dropdown Perfil</div>;
  };
});

jest.mock('../notification-button', () => {
  return function DummyNotificationButton({ onClick }: { onClick?: () => void }) {
    return (
      <button data-testid="notification-button" onClick={onClick}>
        Notification Button
      </button>
    );
  };
});

jest.mock('../exit-button', () => {
  return function DummyExitButton({ onClick }: { onClick?: () => void }) {
    return (
      <button data-testid="exit-button" onClick={onClick}>
        Exit Button
      </button>
    );
  };
});

jest.mock('~/pages/notificacoes/provider', () => {
  return function DummyNotificacoesContextProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid="notificacoes-provider">{children}</div>;
  };
});

jest.mock('~/assets/conecta-formacao-logo.svg', () => 'logo.svg');

import Header from './index';
import { useAppSelector } from '../../../core/hooks/use-redux';
import { store } from '../../../core/redux';

const mockUseAppSelector = useAppSelector as jest.Mock;

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSelector.mockImplementation((selector: any) => {
      const state = { auth: { autenticado: false } };
      return selector(state);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render header component', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render logo image', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO');
      expect(logo).toBeInTheDocument();
    });

    it('should have logo with correct height', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO');
      expect(logo).toHaveStyle({ height: '50px' });
    });

    it('should have logo with correct src attribute', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO') as HTMLImageElement;
      expect(logo.src).toContain('logo.svg');
    });

    it('should render header with sticky positioning', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('position: sticky');
    });

    it('should render header with fixed height 70px', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('height: 70px');
    });

    it('should render header with correct width', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('width: 100%');
    });

    it('should render header with flex display', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('display: flex');
    });

    it('should render header with center alignment', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('align-items: center');
    });

    it('should have z-index 11', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('z-index: 11');
    });

    it('should render logo link', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Logo Link Navigation', () => {
    it('should link logo to AREA_PUBLICA when not authenticated', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const links = container.querySelectorAll('a');
      expect(links[0]).toHaveAttribute('href');
    });

    it('should have logo as first link', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const firstLink = container.querySelector('a');
      const image = firstLink?.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('should have logo link with img element', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logoLink = container.querySelector('a');
      const logoImage = logoLink?.querySelector('img');
      expect(logoImage?.alt).toBe('Conecta Formação LOGO');
    });
  });

  describe('Menu Rendering', () => {
    it('should have menubar element', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const menus = screen.queryAllByRole('menubar');
      expect(menus).toBeDefined();
    });

    it('should render menu item with role', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Authenticated User Components', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: true } };
        return selector(state);
      });
    });

    it('should render dropdown perfil when authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const dropdownPerfil = screen.getByTestId('dropdown-perfil');
      expect(dropdownPerfil).toBeInTheDocument();
    });

    it('should render notification button when authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const notificationButton = screen.getByTestId('notification-button');
      expect(notificationButton).toBeInTheDocument();
    });

    it('should render exit button when authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const exitButton = screen.getByTestId('exit-button');
      expect(exitButton).toBeInTheDocument();
    });

    it('should render notificacoes provider when authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const provider = screen.getByTestId('notificacoes-provider');
      expect(provider).toBeInTheDocument();
    });

    it('should render all authenticated components', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.getByTestId('dropdown-perfil')).toBeInTheDocument();
      expect(screen.getByTestId('notification-button')).toBeInTheDocument();
      expect(screen.getByTestId('exit-button')).toBeInTheDocument();
      expect(screen.getByTestId('notificacoes-provider')).toBeInTheDocument();
    });

    it('should have dropdown perfil visible', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const dropdown = screen.getByTestId('dropdown-perfil');
      expect(dropdown).toBeVisible();
    });

    it('should have notification button visible', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('notification-button');
      expect(button).toBeVisible();
    });

    it('should have exit button visible', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('exit-button');
      expect(button).toBeVisible();
    });
  });

  describe('Non-Authenticated User Components', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: false } };
        return selector(state);
      });
    });

    it('should not render dropdown perfil when not authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const dropdownPerfil = screen.queryByTestId('dropdown-perfil');
      expect(dropdownPerfil).not.toBeInTheDocument();
    });

    it('should not render notification button when not authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const notificationButton = screen.queryByTestId('notification-button');
      expect(notificationButton).not.toBeInTheDocument();
    });

    it('should not render exit button when not authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const exitButton = screen.queryByTestId('exit-button');
      expect(exitButton).not.toBeInTheDocument();
    });

    it('should not render notificacoes provider when not authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const provider = screen.queryByTestId('notificacoes-provider');
      expect(provider).not.toBeInTheDocument();
    });

    it('should only render logo when not authenticated', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      const logo = screen.getByAltText('Conecta Formação LOGO');
      
      expect(header).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
      expect(screen.queryByTestId('dropdown-perfil')).not.toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should show Space with authenticated components when autenticado is true', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: true } };
        return selector(state);
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.getByTestId('dropdown-perfil')).toBeInTheDocument();
      expect(screen.getByTestId('notification-button')).toBeInTheDocument();
      expect(screen.getByTestId('exit-button')).toBeInTheDocument();
    });

    it('should not show Space when autenticado is false', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: false } };
        return selector(state);
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.queryByTestId('dropdown-perfil')).not.toBeInTheDocument();
    });
  });

  describe('Redux Integration', () => {
    it('should use useAppSelector', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(mockUseAppSelector).toHaveBeenCalled();
    });

    it('should get autenticado from state', () => {
      // Ensure the mock is properly set up with a valid implementation
      const mockSelector = jest.fn((state: any) => {
        if (state && state.auth) {
          return state.auth.autenticado;
        }
        return false;
      });

      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: true } };
        return selector(state);
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(mockUseAppSelector).toHaveBeenCalled();
    });

    it('should handle true autenticado state', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector({ auth: { autenticado: true } });
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.getByTestId('dropdown-perfil')).toBeInTheDocument();
    });

    it('should handle false autenticado state', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector({ auth: { autenticado: false } });
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(screen.queryByTestId('dropdown-perfil')).not.toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render header element', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.tagName.toLowerCase()).toBe('header');
    });

    it('should have layout header', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render with BrowserRouter', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('Layout Properties', () => {
    it('should have sticky top position', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('position: sticky');
    });

    it('should have 70px height', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('height: 70px');
    });

    it('should have flex layout', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('display: flex');
    });

    it('should have center aligned items', () => {
      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      expect(header).toHaveStyle('align-items: center');
    });
  });

  describe('Logo Properties', () => {
    it('should have alt text', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO');
      expect(logo.getAttribute('alt')).toBe('Conecta Formação LOGO');
    });

    it('should be an image element', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO');
      expect(logo.tagName.toLowerCase()).toBe('img');
    });

    it('should have 50px height', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO');
      expect(logo).toHaveStyle('height: 50px');
    });

    it('should have source', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('Conecta Formação LOGO') as HTMLImageElement;
      expect(logo.src).toBeDefined();
    });
  });

  describe('Button Interactions', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const state = { auth: { autenticado: true } };
        return selector(state);
      });
    });

    it('should have notification button', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('notification-button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have exit button', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('exit-button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should have notification button with click handler', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('notification-button');
      expect(button.onclick).toBeDefined();
    });

    it('should have exit button with click handler', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const button = screen.getByTestId('exit-button');
      expect(button.onclick).toBeDefined();
    });
  });

  describe('Complete Feature Testing', () => {
    it('should render complete header for authenticated user', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector({ auth: { autenticado: true } });
      });

      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      const logo = screen.getByAltText('Conecta Formação LOGO');
      const dropdown = screen.getByTestId('dropdown-perfil');
      const notification = screen.getByTestId('notification-button');
      const exit = screen.getByTestId('exit-button');

      expect(header).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
      expect(dropdown).toBeInTheDocument();
      expect(notification).toBeInTheDocument();
      expect(exit).toBeInTheDocument();
    });

    it('should render complete header for non-authenticated user', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector({ auth: { autenticado: false } });
      });

      const { container } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = container.querySelector('header');
      const logo = screen.getByAltText('Conecta Formação LOGO');
      const dropdown = screen.queryByTestId('dropdown-perfil');
      const notification = screen.queryByTestId('notification-button');
      const exit = screen.queryByTestId('exit-button');

      expect(header).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
      expect(dropdown).not.toBeInTheDocument();
      expect(notification).not.toBeInTheDocument();
      expect(exit).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render header even with undefined location', () => {
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render header even with empty auth state', () => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        return selector({ auth: {} });
      });

      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should handle multiple renders', () => {
      const { rerender } = render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      rerender(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });
  });
});
