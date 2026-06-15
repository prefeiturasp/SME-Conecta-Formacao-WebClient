/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AlertaSomenteConsulta from './index';
import { TipoAlerta } from '../../../../core/enum/tipo-alerta';

jest.mock('~/components/lib/alert', () => ({
  __esModule: true,
  default: ({ type, message, description }: any) => (
    <div data-testid="alert">
      <span data-testid="type">{type}</span>
      <span data-testid="message">{message}</span>
      <span data-testid="description">{description}</span>
    </div>
  ),
}));

describe('AlertaSomenteConsulta', () => {
  it('deve renderizar o Alert quando somenteConsulta for true', () => {
    render(<AlertaSomenteConsulta somenteConsulta={true} />);

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();

    expect(screen.getByTestId('type').textContent).toBe(TipoAlerta.Warning);
    expect(screen.getByTestId('message').textContent).toBe('Atenção');
    expect(screen.getByTestId('description').textContent).toBe(
      'Você tem apenas permissão de consulta nesta tela.'
    );
  });

  it('não deve renderizar Alert quando somenteConsulta for false', () => {
    render(<AlertaSomenteConsulta somenteConsulta={false} />);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
  });

  it('não deve renderizar Alert quando somenteConsulta não for informado (default false)', () => {
    render(<AlertaSomenteConsulta />);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
  });
});