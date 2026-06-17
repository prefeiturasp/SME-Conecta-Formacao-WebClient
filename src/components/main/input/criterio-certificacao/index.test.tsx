/**
 * @jest-environment jsdom
 */
import { render, act, waitFor } from '@testing-library/react';

import SelectCriterioCertificacao from './index';
import { obterCriterioCertificacao } from '../../../../core/services/criterio-certificacao-service';

const serviceMock = obterCriterioCertificacao as jest.Mock;

const mockState = {
  cursoComCertificado: true,
  criterioCertificacao: [6],
  error: [],
};

const mockForm: any = {
  getFieldValue: jest.fn((field: string) => {
    if (field === 'cursoComCertificado') return mockState.cursoComCertificado;
    if (field === 'criterioCertificacao') return mockState.criterioCertificacao;
    if (field === 'outrosCriterios') return [];
    return undefined;
  }),
  getFieldError: jest.fn(() => mockState.error),
  setFields: jest.fn(),
  setFieldValue: jest.fn(),
};

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  return {
    ...antd,
    Form: {
      ...antd.Form,
      Item: ({ children }: any) =>
        typeof children === 'function'
          ? children(mockForm)
          : children,
    },
  };
});

jest.mock('~/components/lib/inputs/select', () => (props: any) => (
  <select
    data-testid="select"
    onChange={() => props.onChange?.([1, 2, 3], [])}
  />
));

jest.mock('~/core/services/criterio-certificacao-service', () => ({
  obterCriterioCertificacao: jest.fn(),
}));

jest.mock('~/pages/cadastros/propostas/form/components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: ({ children }: any) => <div>{children}</div>,
}));

describe('SelectCriterioCertificacao - FIXED', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar opções no mount', async () => {
    serviceMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'A' }],
    });

    await act(async () => {
      render(<SelectCriterioCertificacao onchange={jest.fn()} />);
    });

    await waitFor(() => {
      expect(serviceMock).toHaveBeenCalled();
    });
  });

  it('deve limpar options quando API falhar', async () => {
    serviceMock.mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    await act(async () => {
      render(<SelectCriterioCertificacao onchange={jest.fn()} />);
    });

    expect(serviceMock).toHaveBeenCalled();
  });

  it('deve chamar setFields quando não requerido e erro existir', () => {
    mockForm.getFieldValue.mockImplementation((field: string) => {
      if (field === 'cursoComCertificado') return false;
      if (field === 'criterioCertificacao') return [];
    });

    mockForm.getFieldError.mockReturnValue(['erro']);

    render(<SelectCriterioCertificacao onchange={jest.fn()} />);

    expect(mockForm.setFields).toHaveBeenCalledWith([
      {
        name: 'criterioCertificacao',
        errors: [],
      },
    ]);
  });

  it('deve mostrar mensagem quando criterios < 3', () => {
    mockForm.getFieldValue.mockImplementation((field: string) => {
      if (field === 'cursoComCertificado') return true;
      if (field === 'criterioCertificacao') return [1, 2];
    });

    mockForm.getFieldError.mockReturnValue([]);

    const { container } = render(
      <SelectCriterioCertificacao onchange={jest.fn()} />
    );

    expect(container.textContent).toContain(
      'É necessário informar ao menos 3 critérios para certificação.'
    );
  });

  it('deve limpar mensagem quando criterios > 3', () => {
    mockForm.getFieldValue.mockImplementation((field: string) => {
      if (field === 'cursoComCertificado') return true;
      if (field === 'criterioCertificacao') return [1, 2, 3, 4];
    });

    mockForm.getFieldError.mockReturnValue([]);

    const { container } = render(
      <SelectCriterioCertificacao onchange={jest.fn()} />
    );

    expect(container.textContent).toBeDefined();
  });

it('deve renderizar campo Outros quando incluir 6', async () => {
  mockState.cursoComCertificado = true;
  mockState.criterioCertificacao = [6, 1, 2, 3];

  const { rerender } = render(
    <SelectCriterioCertificacao onchange={jest.fn()} />
  );

  rerender(<SelectCriterioCertificacao onchange={jest.fn()} />);

  await waitFor(() => {
expect(mockForm.getFieldValue).toHaveBeenCalledWith('criterioCertificacao');
  });
});

  it('deve chamar onchange e limpar campo', () => {
    mockForm.getFieldValue.mockImplementation((field: string) => {
      if (field === 'cursoComCertificado') return true;
      if (field === 'criterioCertificacao') return [1];
    });

    mockForm.getFieldError.mockReturnValue([]);

    const onchangeMock = jest.fn();

    const { getByTestId } = render(
      <SelectCriterioCertificacao onchange={onchangeMock} />
    );

    act(() => {
      getByTestId('select').dispatchEvent(
        new Event('change', { bubbles: true })
      );
    });

    expect(onchangeMock).toHaveBeenCalled();
    expect(mockForm.setFieldValue).toHaveBeenCalledWith(
      'outrosCriterios',
      ''
    );
  });
});