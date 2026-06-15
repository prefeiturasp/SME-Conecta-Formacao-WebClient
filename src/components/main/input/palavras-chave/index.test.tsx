/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import SelectPalavrasChaves from './index';
import { obterPalavrasChave } from '../../../../core/services/palavra-chave-service';
import { obterPalavraChavePublico } from '../../../../core/services/area-publica-service';
import { CF_SELECT_PALAVRA_CHAVE } from '../../../../core/constants/ids/select';

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
  return <div data-testid="select-palavras" />;
});

describe('SelectPalavrasChaves', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar palavras-chave', async () => {
    (obterPalavrasChave as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, descricao: 'A' },
        { id: 2, descricao: 'B' },
      ],
    });

    render(<SelectPalavrasChaves />);

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

    render(<SelectPalavrasChaves areaPublica />);

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

    render(<SelectPalavrasChaves />);

    await waitFor(() =>
      expect(selectMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: [],
        })
      )
    );
  });

  it('deve configurar placeholder padrão', () => {
    render(<SelectPalavrasChaves />);

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder:
          'Escolha no mínimo 3 palavras-chave e no máximo 5 palavras-chave',
      })
    );
  });

  it('deve configurar placeholder da área pública', () => {
    render(<SelectPalavrasChaves areaPublica />);

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: 'Palavras-chave',
      })
    );
  });

  it('deve repassar selectProps', () => {
    render(
      <SelectPalavrasChaves
        selectProps={{
          disabled: true,
          mode: 'tags',
        }}
      />
    );

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        mode: 'tags',
      })
    );
  });

  it('deve configurar required=false', () => {
    render(<SelectPalavrasChaves required={false} />);

    const rules = formItemMock.mock.calls[0][0].rules;

    expect(rules[0].required).toBe(false);
  });

  it('deve configurar required=true por padrão', () => {
    render(<SelectPalavrasChaves />);

    const rules = formItemMock.mock.calls[0][0].rules;

    expect(rules[0].required).toBe(true);
  });

  it('deve limpar erros quando lista estiver vazia', async () => {
    render(<SelectPalavrasChaves />);

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
    render(<SelectPalavrasChaves />);

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2])
    ).rejects.toContain('no mínimo 3');
  });

  it('deve rejeitar quando possuir mais de 5 palavras', async () => {
    render(<SelectPalavrasChaves />);

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2, 3, 4, 5, 6])
    ).rejects.toContain('no máximo 5');
  });

  it('deve aceitar entre 3 e 5 palavras', async () => {
    render(<SelectPalavrasChaves />);

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1, 2, 3])
    ).resolves.toBeUndefined();

    await expect(
      validator({}, [1, 2, 3, 4, 5])
    ).resolves.toBeUndefined();
  });

  it('não deve validar quantidade quando for área pública', async () => {
    render(<SelectPalavrasChaves areaPublica />);

    const validator = formItemMock.mock.calls[0][0].rules[1].validator;

    await expect(
      validator({}, [1])
    ).resolves.toBeUndefined();

    expect(formMock.setFields).not.toHaveBeenCalled();
  });

  it('deve configurar tooltip', () => {
    render(<SelectPalavrasChaves />);

    expect(formItemMock.mock.calls[0][0].tooltip).toEqual(
      expect.objectContaining({
        title: expect.stringContaining('Escolher entre 3 e 5'),
      })
    );
  });

 it('deve possuir id correto', () => {
  render(<SelectPalavrasChaves />);

  expect(selectMock).toHaveBeenCalledWith(
    expect.objectContaining({
      id: CF_SELECT_PALAVRA_CHAVE,
    })
  );
});
});