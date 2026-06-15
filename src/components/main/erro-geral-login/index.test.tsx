/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import ErroGeralLogin from './index';

describe('ErroGeralLogin', () => {
  it('deve renderizar um erro', () => {
    render(<ErroGeralLogin erros={['Usuário inválido']} />);

    expect(screen.getByText('Usuário inválido')).toBeInTheDocument();
  });

  it('deve renderizar vários erros', () => {
    const erros = [
      'Usuário inválido',
      'Senha inválida',
      'Conta bloqueada',
    ];

    render(<ErroGeralLogin erros={erros} />);

    erros.forEach((erro) => {
      expect(screen.getByText(erro)).toBeInTheDocument();
    });
  });

  it('deve renderizar a quantidade correta de mensagens', () => {
    const erros = ['Erro 1', 'Erro 2', 'Erro 3'];

    const { container } = render(<ErroGeralLogin erros={erros} />);

    expect(container.querySelectorAll('p')).toHaveLength(3);
  });

  it('não deve renderizar mensagens quando a lista estiver vazia', () => {
    const { container } = render(<ErroGeralLogin erros={[]} />);

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });

  it('deve renderizar o container mesmo sem erros', () => {
    const { container } = render(<ErroGeralLogin erros={[]} />);

    expect(container.firstChild).toBeInTheDocument();
  });
});