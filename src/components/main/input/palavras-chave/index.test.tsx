/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import SelectPalavrasChaves from './index';
import { CF_SELECT_PALAVRA_CHAVE } from '../../../../core/constants/ids/select';
import { obterPalavraChavePublico } from '../../../../core/services/area-publica-service';
import { obterPalavrasChave } from '../../../../core/services/palavra-chave-service';

jest.mock('../../../../core/services/palavra-chave-service', () => ({
  obterPalavrasChave: jest.fn(),
}));

jest.mock('../../../../core/services/area-publica-service', () => ({
  obterPalavraChavePublico: jest.fn(),
}));

const formMock = {
  setFields: jest.fn(),
};

const formItemMock = jest.fn();
const selectMock = jest.fn();

jest.mock('antd', () => ({
  Tooltip: ({ children }: any) => children,

  Form: {
    useFormInstance: () => formMock,

    Item: ({ children, ...props }: any) => {
      formItemMock(props);
      return <>{children}</>;
    },
  },
}));

jest.mock('~/components/lib/inputs/select', () => (props: any) => {
  selectMock(props);
  return <div data-testid='select-palavras' />;
});

describe('SelectPalavrasChaves', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const renderComponent = async (props: React.ComponentProps<typeof SelectPalavrasChaves> = {}) => {
    render(<SelectPalavrasChaves {...props} />);

    await waitFor(() => {
      if (props.areaPublica) {
        expect(obterPalavraChavePublico).toHaveBeenCalledTimes(1);
      } else {
        expect(obterPalavrasChave).toHaveBeenCalledTimes(1);
      }
    });
  };

  it('deve carregar palavras-chave', async () => {
    (obterPalavrasChave as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, descricao: 'A' },
        { id: 2, descricao: 'B' },
      ],
    });

    await renderComponent();

    await waitFor(() =>
      expect(obterPalavrasChave).toHaveBeenCalled()
    );

    expect(selectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        options: [
          { label: 'A', value: 1 },
          { label: 'B', value: 2 },
        ],
      })
    );
  });

  it('deve carregar palavras da área pública', async () => {
    (obterPalavraChavePublico as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [{ id: 10, descricao: 'Pública' }],
    });

    await renderComponent({ areaPublica: true });

    await waitFor(() =>
      expect(obterPalavraChavePublico).toHaveBeenCalled()
    );

    expect(selectMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        options: [{ label: 'Pública', value: 10 }],
      })
    );
  });

  it('deve deixar opções vazias quando serviço falhar', async () => {
    (obterPalavrasChave as jest.Mock).mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    await renderComponent();

    await waitFor(() =>
      expect(selectMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: [],
        })
      )
    );
  });

  it('deve configurar placeholder padrão', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder:
          'Escolha no mínimo 3 palavras-chave e no máximo 5 palavras-chave',
      })
    );
  });

  it('deve configurar placeholder da área pública', async () => {
    await renderComponent({ areaPublica: true });

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: 'Palavras-chave',
      })
    );
  });

  it('deve repassar selectProps', async () => {
    await renderComponent({
      selectProps: {
        disabled: true,
        mode: 'tags',
      },
    });

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        mode: 'tags',
      })
    );
  });

  it('deve configurar required=false', async () => {
    await renderComponent({ required: false });

    const rules = formItemMock.mock.calls[0][0].rules;

    expect(rules[0].required).toBe(false);
  });

  it('deve configurar required=true por padrão', async () => {
    await renderComponent();

    const rules = formItemMock.mock.calls[0][0].rules;

    expect(rules[0].required).toBe(true);
  });

  it('deve limpar erros quando lista estiver vazia', async () => {
    await renderComponent();

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await validator({}, []);

    expect(formMock.setFields).toHaveBeenCalledWith([
      {
        name: 'palavrasChaves',
        errors: [],
      },
    ]);
  });

  it('deve rejeitar quando possuir menos de 3 palavras', async () => {
    await renderComponent();

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2])
    ).rejects.toContain('no mínimo 3');
  });

  it('deve rejeitar quando possuir mais de 5 palavras', async () => {
    await renderComponent();

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2, 3, 4, 5, 6])
    ).rejects.toContain('no máximo 5');
  });

  it('deve aceitar entre 3 e 5 palavras', async () => {
    await renderComponent();

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2, 3])
    ).resolves.toBeUndefined();

    await expect(
      validator({}, [1, 2, 3, 4, 5])
    ).resolves.toBeUndefined();
  });

  it('não deve validar quantidade quando for área pública', async () => {
    await renderComponent({ areaPublica: true });

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1])
    ).resolves.toBeUndefined();

    expect(formMock.setFields).not.toHaveBeenCalled();
  });

  it('deve configurar tooltip', async () => {
    await renderComponent();

    expect(formItemMock.mock.calls[0][0].tooltip).toEqual(
      expect.objectContaining({
        title: expect.stringContaining('Escolher entre 3 e 5'),
      })
    );
  });

  it('deve possuir id correto', async () => {
    await renderComponent();

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: CF_SELECT_PALAVRA_CHAVE,
      })
    );
  });
});