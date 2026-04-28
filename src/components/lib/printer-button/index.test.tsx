/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonImprimir } from './index';

describe('ButtonImprimir', () => {
  it('renders a button element', () => {
    render(<ButtonImprimir />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ButtonImprimir onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ButtonImprimir disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<ButtonImprimir disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes id prop', () => {
    render(<ButtonImprimir id='CF_BUTTON_IMPRIMIR' />);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'CF_BUTTON_IMPRIMIR');
  });
});
