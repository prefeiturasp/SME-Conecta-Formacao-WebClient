/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { StatusCodafConferencia } from '~/core/enum/status-codaf-conferencia';
import {
  calcularSituacaoCodafConferencia,
  SecaoFormularioConferencia,
  SecaoFormularioConferenciaProps,
} from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
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

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ label, children }: any) => (
    <div>
      {label && <span>{label}</span>}
      {children}
    </div>
  );
  const Select = ({ options, onChange, disabled, placeholder }: any) => (
    <select
      data-testid='select-turma'
      disabled={disabled}
      aria-label={placeholder}
      onChange={(e) => onChange?.(Number(e.target.value))}
    >
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
  const DatePicker = ({ placeholder, disabled }: any) => (
    <input data-testid={placeholder} placeholder={placeholder} disabled={disabled} />
  );
  return {
    ...actual,
    Form,
    Select,
    DatePicker,
  };
});

describe('SecaoFormularioConferencia e calcularSituacaoCodafConferencia', () => {
  describe('calcularSituacaoCodafConferencia', () => {
    it('deve manter FINALIZADO quando statusAtual for FINALIZADO', () => {
      const resultado = calcularSituacaoCodafConferencia(
        10,
        20,
        123,
        [{ participou: true }],
        StatusCodafConferencia.FINALIZADO,
      );

      expect(resultado).toBe(StatusCodafConferencia.FINALIZADO);
    });

    it('deve retornar AGUARDANDO_FINALIZACAO quando todos os campos obrigatorios e participacoes estiverem preenchidos', () => {
      const resultado = calcularSituacaoCodafConferencia(10, 20, 555, [
        { participou: true },
        { participou: false },
      ]);

      expect(resultado).toBe(StatusCodafConferencia.AGUARDANDO_FINALIZACAO);
    });

    it('deve retornar INICIADO quando codigoCursoEol nao estiver preenchido', () => {
      expect(calcularSituacaoCodafConferencia(10, 20, null, [{ participou: true }])).toBe(
        StatusCodafConferencia.INICIADO,
      );
      expect(calcularSituacaoCodafConferencia(10, 20, '', [{ participou: true }])).toBe(
        StatusCodafConferencia.INICIADO,
      );
    });

    it('deve retornar INICIADO quando lista de cursistas estiver vazia ou com participacao nula', () => {
      expect(calcularSituacaoCodafConferencia(10, 20, 555, [])).toBe(
        StatusCodafConferencia.INICIADO,
      );
      expect(calcularSituacaoCodafConferencia(10, 20, 555)).toBe(
        StatusCodafConferencia.INICIADO,
      );
      expect(
        calcularSituacaoCodafConferencia(10, 20, 555, [
          { participou: true },
          { participou: null },
        ]),
      ).toBe(StatusCodafConferencia.INICIADO);
    });

    it('deve retornar INICIADO quando codigoFormacao ou turmaId nao forem informados', () => {
      expect(calcularSituacaoCodafConferencia(0, 20, 555, [{ participou: true }])).toBe(
        StatusCodafConferencia.INICIADO,
      );
      expect(calcularSituacaoCodafConferencia(10, 0, 555, [{ participou: true }])).toBe(
        StatusCodafConferencia.INICIADO,
      );
    });
  });

  describe('SecaoFormularioConferencia', () => {
    const renderizar = (props?: Partial<SecaoFormularioConferenciaProps>) => {
      const defaultProps: SecaoFormularioConferenciaProps = {
        onChangeCodigoFormacao: jest.fn(),
        onBlurCodigoFormacao: jest.fn(),
        onSelectTurma: jest.fn(),
        turmasFiltradas: [
          { id: 1, descricao: 'Turma 1', possuiCodafConferencia: false },
          { id: 2, descricao: 'Turma 2', possuiCodafConferencia: true },
        ],
        turmaDisabled: false,
        camposBloqueados: {
          codigoFormacao: false,
          turma: false,
        },
        ...props,
      };

      const utils = render(<SecaoFormularioConferencia {...defaultProps} />);

      return { ...utils, defaultProps };
    };

    it('deve renderizar todos os campos de cabecalho do formulario', () => {
      renderizar();

      expect(screen.getByText('Nome da formação')).toBeInTheDocument();
      expect(screen.getByText('Código da formação')).toBeInTheDocument();
      expect(screen.getByText('Código de homologação')).toBeInTheDocument();
      expect(screen.getByText('Turma')).toBeInTheDocument();
      expect(screen.getByText('Número do comunicado')).toBeInTheDocument();
      expect(screen.getByText('Data do comunicado')).toBeInTheDocument();
      expect(screen.getByText('Página do comunicado do diário oficial')).toBeInTheDocument();
      expect(screen.getByText('Data de publicação do diário oficial')).toBeInTheDocument();
      expect(screen.getByText('Código Curso EOL')).toBeInTheDocument();
      expect(screen.getByText('Código do nível')).toBeInTheDocument();
    });

    it('deve acionar onChangeCodigoFormacao e onBlurCodigoFormacao ao interagir com codigo da formacao', () => {
      const { defaultProps } = renderizar();

      const inputCodigo = screen.getByPlaceholderText('Código da formação');
      fireEvent.change(inputCodigo, { target: { value: '123' } });
      fireEvent.blur(inputCodigo, { target: { value: '123' } });

      expect(defaultProps.onChangeCodigoFormacao).toHaveBeenCalledWith('123');
      expect(defaultProps.onBlurCodigoFormacao).toHaveBeenCalledWith('123');
    });

    it('deve acionar onSelectTurma ao selecionar uma turma', () => {
      const { defaultProps } = renderizar({
        camposBloqueados: {
          codigoFormacao: true,
          turma: false,
          camposPublicacao: true,
        },
      });

      const selectTurma = screen.getByTestId('select-turma');
      fireEvent.change(selectTurma, { target: { value: '1' } });

      expect(defaultProps.onSelectTurma).toHaveBeenCalledWith(1);
    });
  });
});
