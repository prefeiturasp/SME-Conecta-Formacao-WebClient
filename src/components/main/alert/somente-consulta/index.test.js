import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertaSomenteConsulta from './index';
import Alert from '~/components/lib/alert';
import { TipoAlerta } from '~/core/enum/tipo-alerta';

// Mock do componente Alert para verificar suas props
jest.mock('~/components/lib/alert', () => jest.fn(() => null));

describe('AlertaSomenteConsulta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não deve renderizar o Alert quando somenteConsulta for false', () => {
    render(<AlertaSomenteConsulta somenteConsulta={false} />);
    
    expect(Alert).not.toHaveBeenCalled();
  });

  it('deve renderizar o Alert com as props corretas quando somenteConsulta for true', () => {
    render(<AlertaSomenteConsulta somenteConsulta={true} />);
    
    expect(Alert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TipoAlerta.Warning,
        message: 'Atenção',
        description: 'Você tem apenas permissão de consulta nesta tela.'
      }),
      expect.anything()
    );
  });

  it('não deve renderizar o Alert quando somenteConsulta não for passado (default)', () => {
    render(<AlertaSomenteConsulta />);
    
    expect(Alert).not.toHaveBeenCalled();
  });
});