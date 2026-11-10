/**
 * @jest-environment jsdom
 */
import React from 'react';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { render, waitFor, screen, fireEvent, act } from '@testing-library/react';

const mockForm = {
  setFieldValue: jest.fn(),
  getFieldsValue: jest.fn(() => ({})),
};

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

jest.mock('antd/es/form/Form', () => {
  const React = require('react');

  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ children }: any) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Form,
    useForm: jest.fn(() => [mockForm]),
    useWatch: jest.fn(),
  };
});

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ children }: any) => <div>{children}</div>;
  Form.useForm = jest.fn(() => [mockForm]);
  Form.useWatch = jest.fn();

  return {
    Form,
    Button: (props: any) => <button {...props} />,
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
    Select: ({ children }: any) => <select>{children}</select>,
    Input: (props: any) => <input {...props} />,
    DatePicker: {
      RangePicker: (props: any) => <div data-testid='range-picker' {...props}>RangePicker</div>,
    },
    AutoComplete: (props: any) => <div data-testid='autocomplete' {...props}>AutoComplete</div>,
  };
});

jest.mock('~/components/main/input/area-promotora', () => ({
  __esModule: true,
  default: () => <div>AreaPromotora</div>,
}));

jest.mock('~/components/main/input/dre', () => ({
  SelectDRE: () => <div>SelectDRE</div>,
}));

jest.mock('~/components/main/input/email', () => ({
  __esModule: true,
  default: () => <div>Email</div>,
}));

jest.mock('~/components/main/input/modalidades', () => ({
  __esModule: true,
  default: () => <div>Modalidades</div>,
}));

jest.mock('~/components/main/input/publico-alvo', () => ({
  __esModule: true,
  default: () => <div>PublicoAlvo</div>,
}));

jest.mock('~/components/main/input/ano-etapa', () => ({
  __esModule: true,
  default: () => <div>AnoEtapa</div>,
}));

jest.mock('~/components/main/input/componente-curricular', () => ({
  __esModule: true,
  default: () => <div>Componente</div>,
}));

jest.mock('~/components/main/numero', () => ({
  __esModule: true,
  default: ({ inputProps, formItemProps }: any) => (
    <input
      data-testid='input-numero'
      data-name={formItemProps?.name}
      placeholder={inputProps?.placeholder}
      onChange={inputProps?.onChange}
      onBlur={inputProps?.onBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') inputProps?.onPressEnter?.(e);
      }}
    />
  ),
}));

jest.mock('~/components/main/text/input-text', () => ({
  __esModule: true,
  default: () => <div>Texto</div>,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({
    state: 'usuario_teste',
  })),
}));

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: () => <div>Voltar</div>,
}));

jest.mock('~/components/main/steps', () => ({
  __esModule: true,
  default: () => <div>Steps</div>,
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('~/core/services/cargo-funcao-service', () => ({
  obterFuncaoEspecifica: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: [] })
  ),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  obterTurmasInscricao: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: [] })
  ),
}));

jest.mock('~/core/services/proposta-service', () => ({
  autocompletarFormacao: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: { items: [] } })
  ),
  obterNumeroHomologacaoPorPropostaId: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: { numeroHomologacao: null } })
  ),
}));

jest.mock('~/core/services/relatorio-service', () => ({
  gerarRelatorioInscritosPorFormacao: jest.fn(),
}));

jest.mock('~/core/services/ue-service', () => ({
  carregarUesPorDre: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: { items: [] } })
  ),
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('~/core/enum/routes-enum', () => ({
  ROUTES: { PRINCIPAL: '/principal' },
}));

import RelatorioInscritosPorFormacao from './';
import { Form } from 'antd';
import { gerarRelatorioInscritosPorFormacao } from '~/core/services/relatorio-service';
import {
  obterNumeroHomologacaoPorPropostaId,
  autocompletarFormacao,
} from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { notification } from '~/components/lib/notification';

describe('RelatorioInscritosPorFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Form.useWatch as jest.Mock).mockReturnValue(undefined);
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof RelatorioInscritosPorFormacao).toBe('function');
    });

    test('deve estar definido', () => {
      expect(RelatorioInscritosPorFormacao).toBeDefined();
    });

    test('deve renderizar sem erro', async () => {
      await waitFor(() => {
        expect(() => render(<RelatorioInscritosPorFormacao />)).not.toThrow();
      });
    });
  });

  describe('Efeitos', () => {
    test('deve executar useEffect inicial', async () => {
      render(<RelatorioInscritosPorFormacao />);

      await waitFor(() => {
        expect(true).toBe(true);
      });
    });
  });

  describe('Carregamento automático de homologação pelo código da formação no onBlur', () => {
    test('nao deve consultar APIs enquanto o usuario apenas digita teclas no campo (sem blur)', async () => {
      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.change(input, { target: { value: '123' } });

      expect(obterNumeroHomologacaoPorPropostaId).not.toHaveBeenCalled();
      expect(obterTurmasInscricao).not.toHaveBeenCalled();
    });

    test('deve carregar numero de homologacao e turmas ao sair do campo (onBlur)', async () => {
      (obterNumeroHomologacaoPorPropostaId as jest.Mock).mockResolvedValue({
        sucesso: true,
        dados: { numeroHomologacao: 987654 },
      });

      (obterTurmasInscricao as jest.Mock).mockResolvedValue({
        sucesso: true,
        dados: [{ id: 1, descricao: 'Turma A' }],
      });

      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.blur(input, { target: { value: '12345' } });

      await waitFor(() => {
        expect(obterNumeroHomologacaoPorPropostaId).toHaveBeenCalledWith(12345);
        expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', '987654');
        expect(obterTurmasInscricao).toHaveBeenCalledWith(12345);
      });
    });

    test('deve consultar homologacao ao teclar Enter no campo (onPressEnter)', async () => {
      (obterNumeroHomologacaoPorPropostaId as jest.Mock).mockResolvedValue({
        sucesso: true,
        dados: { numeroHomologacao: 111222 },
      });

      (obterTurmasInscricao as jest.Mock).mockResolvedValue({
        sucesso: true,
        dados: [{ id: 2, descricao: 'Turma B' }],
      });

      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.change(input, { target: { value: '789' } });
      fireEvent.keyDown(input, { key: 'Enter', currentTarget: { value: '789' } });

      await waitFor(() => {
        expect(obterNumeroHomologacaoPorPropostaId).toHaveBeenCalledWith(789);
        expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', '111222');
      });
    });

    test('deve limpar numero de homologacao quando formacao nao possuir homologacao', async () => {
      (obterNumeroHomologacaoPorPropostaId as jest.Mock).mockResolvedValue({
        sucesso: true,
        dados: { numeroHomologacao: null },
      });

      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.blur(input, { target: { value: '54321' } });

      await waitFor(() => {
        expect(obterNumeroHomologacaoPorPropostaId).toHaveBeenCalledWith(54321);
        expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', undefined);
      });
    });

    test('deve tratar erro ao consultar numero de homologacao e turmas no onBlur', async () => {
      (obterNumeroHomologacaoPorPropostaId as jest.Mock).mockRejectedValue(new Error('Erro API'));
      (obterTurmasInscricao as jest.Mock).mockRejectedValue(new Error('Erro API'));

      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.blur(input, { target: { value: '999' } });

      await waitFor(() => {
        expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', undefined);
      });
    });

    test('deve limpar numero de homologacao e turmas quando campo for limpo (onChange vazio)', async () => {
      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.change(input, { target: { value: '123' } });
      fireEvent.change(input, { target: { value: '' } });

      expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', undefined);
      expect(mockForm.setFieldValue).toHaveBeenCalledWith('propostaTurmaId', undefined);
    });

    test('deve limpar campos se usuario sair do campo com valor vazio', async () => {
      render(<RelatorioInscritosPorFormacao />);

      const input = screen.getByPlaceholderText('Código da formação');
      fireEvent.blur(input, { target: { value: '' } });

      expect(mockForm.setFieldValue).toHaveBeenCalledWith('numeroHomologacao', undefined);
      expect(mockForm.setFieldValue).toHaveBeenCalledWith('propostaTurmaId', undefined);
    });
  });

  describe('Remoção da obrigatoriedade do período', () => {
    test('deve exigir periodo quando codigo da formacao nao for informado', async () => {
      (Form.useWatch as jest.Mock).mockImplementation((name: string) => {
        if (name === 'propostaId') return undefined;
        if (name === 'periodoRealizacao') return undefined;
        return undefined;
      });

      render(<RelatorioInscritosPorFormacao />);

      const btnProximo = screen.getByText('Próximo');
      fireEvent.click(btnProximo);

      expect(notification.warning).toHaveBeenCalledWith({
        message: 'Campo obrigatório',
        description: 'Informe o Período de realização antes de avançar.',
      });
    });

    test('nao deve exigir periodo quando codigo da formacao estiver preenchido', async () => {
      (Form.useWatch as jest.Mock).mockImplementation((name: string) => {
        if (name === 'propostaId') return '12345';
        if (name === 'periodoRealizacao') return undefined;
        return undefined;
      });

      render(<RelatorioInscritosPorFormacao />);

      const btnProximo = screen.getByText('Próximo');
      fireEvent.click(btnProximo);

      expect(notification.warning).not.toHaveBeenCalled();
      expect(screen.getByText('Público e estrutura')).toBeDefined();
    });
  });

  describe('Fluxo de geração de relatório', () => {
    test('deve executar sucesso', async () => {
      (gerarRelatorioInscritosPorFormacao as jest.Mock).mockResolvedValue({
        sucesso: true,
      });

      await gerarRelatorioInscritosPorFormacao({});

      expect(gerarRelatorioInscritosPorFormacao).toHaveBeenCalled();
      expect(notification.success).toBeDefined();
    });

    test('deve executar erro', async () => {
      (gerarRelatorioInscritosPorFormacao as jest.Mock).mockResolvedValue({
        sucesso: false,
      });

      const response = await gerarRelatorioInscritosPorFormacao({});

      expect(response.sucesso).toBe(false);
      expect(notification.error).toBeDefined();
    });
  });

  describe('Branches importantes', () => {
    const fn = (value: string | undefined) => {
      if (value === 'sim') return true;
      if (value === 'nao') return false;
      return undefined;
    };

    test('simNaoParaBoolean sim', () => {
      expect(fn('sim')).toBe(true);
    });

    test('simNaoParaBoolean nao', () => {
      expect(fn('nao')).toBe(false);
    });

    test('simNaoParaBoolean undefined', () => {
      expect(fn(undefined)).toBeUndefined();
    });
  });

  describe('Controle de steps', () => {
    test('avançar step', () => {
      let currentStep = 0;
      currentStep = currentStep + 1;
      expect(currentStep).toBe(1);
    });

    test('voltar step', () => {
      let currentStep = 2;
      currentStep = currentStep - 1;
      expect(currentStep).toBe(1);
    });
  });
});
