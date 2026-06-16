/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import InputTimer from './index';
import { Formato } from '~/core/enum/formato';

const mockFormItem = jest.fn();
const mockUseWatch = jest.fn();
const mockGetFieldValue = jest.fn();
const mockFormatarDuasCasasDecimais = jest.fn();

jest.mock('antd', () => ({
  Form: {
    Item: (props: any) => {
      mockFormItem(props);
      return <div data-testid='form-item'>{props.children}</div>;
    },
  },
  Input: (props: any) => <input data-testid='timer-input' {...props} />,
}));

jest.mock('antd/es/form/Form', () => ({
  useWatch: (...args: any[]) => mockUseWatch(...args),
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => ({
    getFieldValue: (...args: any[]) => mockGetFieldValue(...args),
  }),
}));

jest.mock('~/core/utils/functions', () => ({
  formatarDuasCasasDecimais: (...args: any[]) => mockFormatarDuasCasasDecimais(...args),
}));

describe('InputTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWatch.mockReturnValue('');
    mockGetFieldValue.mockImplementation((field: string) => {
      if (field === 'formato') return Formato.Presencial;
      return '';
    });
    mockFormatarDuasCasasDecimais.mockImplementation((value: string) => value);
  });

  const obterUltimoPropsFormItem = () => {
    const calls = mockFormItem.mock.calls;
    return calls[calls.length - 1][0];
  };

  test('deve marcar campo presencial como obrigatório no modo presencial', async () => {
    render(<InputTimer campo='cargaHorariaPresencial' />);

    await waitFor(() => {
      const props = obterUltimoPropsFormItem();
      expect(props.rules[0].required).toBe(true);
    });
  });

  test('deve marcar cargaHorariaSincrona como obrigatória quando cargaHorariaDistancia está vazia', async () => {
    mockGetFieldValue.mockImplementation((field: string) => {
      if (field === 'formato') return Formato.Distancia;
      if (field === 'cargaHorariaDistancia') return '';
      if (field === 'cargaHorariaSincrona') return '';
      return '';
    });
    mockUseWatch.mockImplementation((field: string) => {
      if (field === 'cargaHorariaDistancia') return '';
      return '';
    });

    render(<InputTimer campo='cargaHorariaSincrona' />);

    await waitFor(() => {
      const props = obterUltimoPropsFormItem();
      expect(props.rules[0].required).toBe(true);
    });
  });

  test('deve desmarcar cargaHorariaSincrona como obrigatória quando cargaHorariaDistancia tem valor', async () => {
    mockGetFieldValue.mockImplementation((field: string) => {
      if (field === 'formato') return Formato.Distancia;
      if (field === 'cargaHorariaDistancia') return '040:00';
      if (field === 'cargaHorariaSincrona') return '';
      return '';
    });
    mockUseWatch.mockImplementation((field: string) => {
      if (field === 'cargaHorariaDistancia') return '040:00';
      return '';
    });

    render(<InputTimer campo='cargaHorariaSincrona' />);

    await waitFor(() => {
      const props = obterUltimoPropsFormItem();
      expect(props.rules[0].required).toBe(false);
    });
  });

  test('deve incluir validator customizado nas regras', async () => {
    const validatorCustomizado = { validator: jest.fn() } as any;

    render(<InputTimer campo='cargaHorariaPresencial' validator={validatorCustomizado} />);

    await waitFor(() => {
      const props = obterUltimoPropsFormItem();
      expect(props.rules).toContain(validatorCustomizado);
      expect(props.rules[1]).toEqual({ len: 6, message: 'Informe uma hora no formato 999:99' });
    });
  });

  test('deve usar formatarDuasCasasDecimais no getValueFromEvent', async () => {
    mockFormatarDuasCasasDecimais.mockReturnValue('123:45');

    render(<InputTimer campo='cargaHorariaPresencial' />);

    await waitFor(() => {
      const props = obterUltimoPropsFormItem();
      const retorno = props.getValueFromEvent({ target: { value: '12345' } });
      expect(mockFormatarDuasCasasDecimais).toHaveBeenCalledWith('12345');
      expect(retorno).toBe('123:45');
    });
  });
});
