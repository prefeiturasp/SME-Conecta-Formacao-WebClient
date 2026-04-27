/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
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

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
});

jest.mock('@ant-design/icons', () => ({
  InfoCircleFilled: () => React.createElement('span', { 'data-testid': 'info-icon' }),
}));

import CardTurmasPublico from './index';
import { RetornoTurmaDetalheDto } from '~/core/dto/dados-formacao-area-publica-dto';

const turmaBase: RetornoTurmaDetalheDto = {
  nome: 'Turma Teste',
  local: 'Escola Municipal X',
  dataInicio: '2026-03-01',
  dataFim: '2026-03-31',
  dataEncontrosNovo: [],
  modeloHorario: 'novo',
};

describe('CardTurmasPublico', () => {
  it('renderiza o nome da turma', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText('Turma Teste')).toBeInTheDocument();
  });

  it('renderiza o local', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText('Escola Municipal X')).toBeInTheDocument();
  });

  it('renderiza label "Datas de realização:"', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText(/Datas de realização/i)).toBeInTheDocument();
  });

  it('renderiza label "Local:"', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText('Local:')).toBeInTheDocument();
  });

  it('renderiza label "Datas dos encontros*:"', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText('Datas dos encontros*:')).toBeInTheDocument();
  });

  it('exibe período de realização quando dataInicio e dataFim estão presentes', () => {
    render(<CardTurmasPublico turma={turmaBase} />);
    expect(screen.getByText(/De .+ à .+/)).toBeInTheDocument();
  });

  it('não exibe período quando dataInicio e dataFim estão ausentes', () => {
    render(
      <CardTurmasPublico turma={{ ...turmaBase, dataInicio: undefined, dataFim: undefined }} />,
    );
    expect(screen.queryByText(/De .+ à .+/)).not.toBeInTheDocument();
  });

  it('renderiza encontros no modelo "novo"', () => {
    const turma: RetornoTurmaDetalheDto = {
      ...turmaBase,
      modeloHorario: 'novo',
      dataEncontrosNovo: [
        { dataInicial: '10/03/2026', dataFinal: null, horaInicial: '08:00', horaFinal: '10:00' },
      ],
    };

    render(<CardTurmasPublico turma={turma} />);
    expect(screen.getByText(/08:00 - 10:00/)).toBeInTheDocument();
  });

  it('expande intervalo de datas no modelo "legado"', () => {
    const turma: RetornoTurmaDetalheDto = {
      ...turmaBase,
      modeloHorario: 'legado',
      dataEncontrosNovo: [
        { dataInicial: '01/03/2026', dataFinal: '03/03/2026', horaInicial: '14:30', horaFinal: '16:00' },
      ],
    };

    render(<CardTurmasPublico turma={turma} />);
    expect(screen.getAllByText(/14:30 - 16:00/)).toHaveLength(3);
  });
});
