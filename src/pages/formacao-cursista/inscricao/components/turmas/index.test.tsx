/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Form } from 'antd';
import SelectTurma from './index';
import { obterTurmasEmInscricao } from '~/core/services/inscricao-service';

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

jest.mock('~/core/services/inscricao-service', () => ({
  obterTurmasEmInscricao: jest.fn(),
}));

const mockObterTurmasEmInscricao = obterTurmasEmInscricao as jest.MockedFunction<typeof obterTurmasEmInscricao>;

describe('SelectTurma Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const WrapperComponent = ({
    propostaId,
    initialValues,
    formRef,
  }: {
    propostaId?: number;
    initialValues?: any;
    formRef?: React.MutableRefObject<any>;
  }) => {
    const [form] = Form.useForm();
    if (formRef) {
      formRef.current = form;
    }
    return (
      <Form form={form} initialValues={initialValues}>
        <Form.Item name='usuarioFuncaoSelecionado' noStyle />
        <SelectTurma propostaId={propostaId} />
      </Form>
    );
  };

  test('deve renderizar o campo Turma com placeholder correto', async () => {
    mockObterTurmasEmInscricao.mockResolvedValueOnce({
      sucesso: true,
      dados: [],
      status: 200,
      mensagens: [],
    } as any);

    await act(async () => {
      render(<WrapperComponent propostaId={1} />);
    });

    expect(screen.getByText('Turma')).toBeInTheDocument();
  });

  test('deve buscar turmas quando propostaId for fornecido', async () => {
    const mockTurmas = [
      { id: 10, descricao: 'Turma 01 - Noite' },
      { id: 20, descricao: 'Turma 02 - Tarde' },
    ];

    mockObterTurmasEmInscricao.mockResolvedValueOnce({
      sucesso: true,
      dados: mockTurmas,
      status: 200,
      mensagens: [],
    } as any);

    await act(async () => {
      render(<WrapperComponent propostaId={123} />);
    });

    await waitFor(() => {
      expect(mockObterTurmasEmInscricao).toHaveBeenCalledWith(123, undefined);
    });
  });

  test('não deve buscar turmas quando propostaId for undefined', async () => {
    await act(async () => {
      render(<WrapperComponent propostaId={undefined} />);
    });

    expect(mockObterTurmasEmInscricao).not.toHaveBeenCalled();
  });

  test('deve limpar opções quando a resposta da api não for bem-sucedida', async () => {
    mockObterTurmasEmInscricao.mockResolvedValueOnce({
      sucesso: false,
      dados: [],
      status: 400,
      mensagens: ['Erro'],
    } as any);

    await act(async () => {
      render(<WrapperComponent propostaId={123} />);
    });

    await waitFor(() => {
      expect(mockObterTurmasEmInscricao).toHaveBeenCalledWith(123, undefined);
    });
  });

  test('deve chamar com dreCodigo quando usuarioFuncaoSelecionado estiver preenchido', async () => {
    mockObterTurmasEmInscricao.mockResolvedValue({
      sucesso: true,
      dados: [],
      status: 200,
      mensagens: [],
    } as any);

    await act(async () => {
      render(
        <WrapperComponent
          propostaId={123}
          initialValues={{
            usuarioFuncaoSelecionado: { dreCodigo: 'DRE-01' },
          }}
        />,
      );
    });

    await waitFor(() => {
      expect(mockObterTurmasEmInscricao).toHaveBeenCalledWith(123, 'DRE-01');
    });
  });

  test('deve validar obrigatoriedade da seleção de turma', async () => {
    mockObterTurmasEmInscricao.mockResolvedValueOnce({
      sucesso: true,
      dados: [],
      status: 200,
      mensagens: [],
    } as any);

    const formRef = { current: null as any };

    await act(async () => {
      render(<WrapperComponent propostaId={123} formRef={formRef} />);
    });

    await expect(formRef.current.validateFields()).rejects.toBeDefined();

    act(() => {
      formRef.current.setFieldsValue({ propostaTurmaId: 10 });
    });

    await expect(formRef.current.validateFields()).resolves.toBeDefined();
  });
});
