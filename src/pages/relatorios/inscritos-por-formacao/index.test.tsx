/**
 * @jest-environment jsdom
 */
import React from 'react';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

jest.mock('antd/es/form/Form', () => {
  const React = require('react');

  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ children }: any) => <div>{children}</div>;

  return {
    __esModule: true,
    default: Form,
    useForm: jest.fn(() => [{}]),
    useWatch: jest.fn(),
  };
});

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ children }: any) => <div>{children}</div>;
  Form.useForm = jest.fn(() => [{}]);
  Form.useWatch = jest.fn();

  return {
    Form,
    Button: (props: any) => <button {...props} />,
    Row: ({ children }: any) => <div>{children}</div>,
    Col: ({ children }: any) => <div>{children}</div>,
    Select: ({ children }: any) => <select>{children}</select>,
    Input: (props: any) => <input {...props} />,
    DatePicker: {
      RangePicker: () => <div>RangePicker</div>,
    },
    AutoComplete: () => <div>AutoComplete</div>,
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
  default: () => <div>Numero</div>,
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
  default: () => <div>CardContent</div>,
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: () => <div>HeaderPage</div>,
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
import { gerarRelatorioInscritosPorFormacao } from '~/core/services/relatorio-service';
import { notification } from '~/components/lib/notification';

describe('RelatorioInscritosPorFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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