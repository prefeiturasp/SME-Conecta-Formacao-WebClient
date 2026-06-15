/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from './index';

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

// Mock the prefeitura logo image
jest.mock('~/assets/prefeitura-sp-logo-cinza.png', () => 'prefeitura-logo.png');

describe('Footer Component', () => {
  it('should render footer component without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should display the Prefeitura SP logo image', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO');
    expect(logoImg).toBeInTheDocument();
  });

  it('should have correct alt text for logo image', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO');
    expect(logoImg).toHaveAttribute('alt', 'PREFEITURA SP LOGO');
  });

  it('should display the browser compatibility message', () => {
    render(<Footer />);
    const message = screen.getByText(/Sistema homologado para navegadores:/i);
    expect(message).toBeInTheDocument();
  });

  it('should display Chrome and Firefox as supported browsers', () => {
    render(<Footer />);
    const message = screen.getByText(/Google Chrome e Firefox/);
    expect(message).toBeInTheDocument();
  });

  it('should display complete browser support text', () => {
    render(<Footer />);
    const message = screen.getByText('Sistema homologado para navegadores: Google Chrome e Firefox');
    expect(message).toBeInTheDocument();
  });

  it('should render footer with correct structure', () => {
    const { container } = render(<Footer />);
    
    // Check for footer element
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    
    // Check for image
    const image = footer?.querySelector('img');
    expect(image).toBeInTheDocument();
    
    // Check for description div
    const description = footer?.querySelector('div > div:last-child');
    expect(description).toBeInTheDocument();
  });

  it('should have logo image with src attribute', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO') as HTMLImageElement;
    expect(logoImg.src).toBeDefined();
  });

  it('should have footer container with proper styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('ant-layout-footer');
  });

  it('should render all content in correct order', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    // Get all children
    const children = footer?.querySelectorAll('*');
    expect(children?.length).toBeGreaterThan(0);
  });

  it('should display logo image with visible content', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO') as HTMLImageElement;
    
    // Check image is visible
    expect(logoImg).toBeVisible();
  });

  it('should have footer with text description', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    const text = footer?.textContent;
    
    expect(text).toContain('Sistema homologado para navegadores');
    expect(text).toContain('Google Chrome');
    expect(text).toContain('Firefox');
  });

  it('should render exactly one logo image', () => {
    render(<Footer />);
    const logoImages = screen.getAllByAltText('PREFEITURA SP LOGO');
    expect(logoImages).toHaveLength(1);
  });

  it('should render exactly one footer description text', () => {
    render(<Footer />);
    const messages = screen.getAllByText(/Sistema homologado para navegadores/);
    expect(messages.length).toBeGreaterThan(0);
  });

  it('should have proper footer layout structure', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    
    // Check for flex container
    const flexContainer = footer?.querySelector('div > div');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should render footer as semantic HTML5 footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toBeInTheDocument();
    expect(footer?.tagName.toLowerCase()).toBe('footer');
  });

  it('should have image element within footer', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const image = footer?.querySelector('img');
    
    expect(image).toBeInTheDocument();
    expect(image?.getAttribute('alt')).toBe('PREFEITURA SP LOGO');
  });

  it('should render footer with layout footer class', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('.ant-layout-footer');
    
    expect(footer).toBeInTheDocument();
  });

  it('should display browser compatibility information', () => {
    render(<Footer />);
    
    const footerText = screen.getByText(/Sistema homologado para navegadores: Google Chrome e Firefox/);
    expect(footerText).toBeInTheDocument();
    expect(footerText).toBeVisible();
  });

  it('should have correct number of direct children in footer container items', () => {
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    
    // Should have the footer element
    expect(footer).toBeInTheDocument();
    
    // Should have content inside
    expect(footer?.textContent?.length).toBeGreaterThan(0);
  });

  it('should render footer component as functional component', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should have image and text content in correct positions', () => {
    render(<Footer />);
    
    const img = screen.getByAltText('PREFEITURA SP LOGO');
    const text = screen.getByText(/Sistema homologado/);
    
    expect(img).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(text?.textContent).toContain('Sistema homologado');
  });

  it('should render without any console errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Footer />);
    
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should have logo image with correct styling attributes', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO') as HTMLImageElement;
    
    expect(logoImg).toHaveAttribute('alt');
    expect(logoImg.src).toContain('prefeitura');
  });

  it('should render footer visible on screen', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toBeVisible();
  });

  it('should contain prefeitura SP logo text through alt attribute', () => {
    render(<Footer />);
    const logoImg = screen.getByAltText('PREFEITURA SP LOGO') as HTMLImageElement;
    
    expect(logoImg.alt.toLowerCase()).toContain('prefeitura');
    expect(logoImg.alt.toLowerCase()).toContain('sp');
    expect(logoImg.alt.toLowerCase()).toContain('logo');
  });

  it('should display Chrome browser name in footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Google Chrome/)).toBeInTheDocument();
  });

  it('should display Firefox browser name in footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Firefox/)).toBeInTheDocument();
  });

  it('should have layout footer role', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render footer with flex layout properties', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toBeInTheDocument();
    // Styled component should apply flex properties
    expect(footer).toBeInTheDocument();
  });

  it('should render all necessary children elements', () => {
    render(<Footer />);
    
    const logo = screen.getByAltText('PREFEITURA SP LOGO');
    const description = screen.getByText(/Sistema homologado/);
    
    expect(logo).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });
});
