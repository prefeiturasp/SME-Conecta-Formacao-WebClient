/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Empty from './index';

describe('Empty', () => {
  it('renders without crashing', () => {
    render(<Empty />);
  });

  it('displays "Sem dados" description', () => {
    render(<Empty />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
