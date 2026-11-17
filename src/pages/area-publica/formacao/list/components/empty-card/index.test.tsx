/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { EmptyCard } from './index';

describe('EmptyCard', () => {
  test('deve renderizar o card de estado vazio com título e subtítulo', () => {
    render(<EmptyCard />);

    expect(screen.getByTestId('empty-card')).toBeInTheDocument();
    expect(
      screen.getByText('Não encontramos dados para essa busca!'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Experimente buscar com um novo nome.'),
    ).toBeInTheDocument();
  });
});
