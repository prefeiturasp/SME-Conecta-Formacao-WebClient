/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonPrimary } from './index';

describe('ButtonPrimary', () => {
  it('renders children', () => {
    render(<ButtonPrimary>Salvar</ButtonPrimary>);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('renders a button element', () => {
    render(<ButtonPrimary>Click</ButtonPrimary>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has primary type class', () => {
    render(<ButtonPrimary>Click</ButtonPrimary>);
    expect(screen.getByRole('button')).toHaveClass('ant-btn-primary');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ButtonPrimary onClick={onClick}>Click</ButtonPrimary>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ButtonPrimary disabled>Click</ButtonPrimary>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<ButtonPrimary disabled onClick={onClick}>Click</ButtonPrimary>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes id prop', () => {
    render(<ButtonPrimary id='CF_BUTTON_SALVAR'>Click</ButtonPrimary>);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'CF_BUTTON_SALVAR');
  });
});
