/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardContent from './index';

jest.mock('~/core/styles/colors', () => ({
  BoxShadow: { CARD_CONTENT: '0 1px 4px rgba(0,0,0,0.1)' },
  Colors: {
    Neutral: { DARK: '#42474A', LIGHTEST: '#F5F6F8' },
    SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } },
    Suporte: { Primary: { ERROR: '#CC2B2B', INFO: '#003D92' } },
  },
}));

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent><span>Conteúdo</span></CardContent>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <CardContent>
        <div>Item 1</div>
        <div>Item 2</div>
      </CardContent>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<CardContent />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
