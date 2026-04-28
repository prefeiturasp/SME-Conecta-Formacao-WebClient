/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonSecundary } from './index';

jest.mock('styled-components', () => {
  const actual = jest.requireActual('styled-components');
  return actual;
});

describe('ButtonSecundary', () => {
  it('renders children', () => {
    render(<ButtonSecundary>Secundary</ButtonSecundary>);
    expect(screen.getByText('Secundary')).toBeInTheDocument();
  });

  it('renders a button element', () => {
    render(<ButtonSecundary>Click</ButtonSecundary>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ButtonSecundary onClick={onClick}>Click</ButtonSecundary>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<ButtonSecundary disabled>Click</ButtonSecundary>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<ButtonSecundary disabled onClick={onClick}>Click</ButtonSecundary>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is a function component', () => {
    expect(typeof ButtonSecundary).toBe('function');
  });
});
