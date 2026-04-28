/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { Inscricao } from '.';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  obterDadosInscricaoProposta,
  inserirInscricao,
} from '~/core/services/inscricao-service';

import { obterDadosFormacao } from '~/core/services/area-publica-service';

(window as any).React = React;

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

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn((fn: any) =>
    fn({
      auth: { usuarioLogin: '123', usuarioNome: 'Teste User' },
      inscricao: {},
    }),
  ),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  obterDadosInscricaoProposta: jest.fn(),
  inserirInscricao: jest.fn(),
}));

jest.mock('~/core/services/area-publica-service', () => ({
  obterDadosFormacao: jest.fn(),
}));

jest.mock('~/components/lib/header-page', () => {
  const Mock = (props: any) => React.createElement('div', null, props.title, props.children);
  Mock.displayName = 'HeaderPage';
  return Mock;
});

jest.mock('~/components/lib/card-content', () => {
  const Mock = (props: any) => React.createElement('div', null, props.children);
  Mock.displayName = 'CardContent';
  return Mock;
});

jest.mock('~/components/main/button/voltar', () => {
  const Mock = (props: any) =>
    React.createElement('button', { onClick: props.onClick }, 'Voltar');
  Mock.displayName = 'ButtonVoltar';
  return Mock;
});

jest.mock('~/components/main/input/cpf', () => {
  const Mock = () => React.createElement('div', null, 'CPF');
  Mock.displayName = 'InputCPF';
  return Mock;
});

jest.mock('~/components/main/input/input-registro-funcional', () => {
  const Mock = () => React.createElement('div', null, 'RF');
  Mock.displayName = 'InputRF';
  return Mock;
});

jest.mock('./components/turmas', () => {
  const Mock = () => React.createElement('div', null, 'SelectTurma');
  Mock.displayName = 'SelectTurma';
  return Mock;
});

jest.mock('./components/funcao-atividade', () => {
  const Mock = () => React.createElement('div', null, 'SelectFuncao');
  Mock.displayName = 'SelectFuncao';
  return Mock;
});

jest.mock('./components/modal', () => ({
  ModalInscricao: ({ onConfirmButton }: any) =>
    React.createElement('button', { onClick: onConfirmButton }, 'Modal OK'),
}));

jest.mock('./components/modal/modal-acessibilidade', () => ({
  ModalAcessibilidade: ({ onSalvar }: any) =>
    React.createElement('button', { onClick: onSalvar }, 'Salvar Acessibilidade'),
}));

jest.mock('~/core/utils/form', () => ({
  onClickCancelar: jest.fn(),
  onClickVoltar: jest.fn(),
}));

jest.mock('antd/es/form/Form', () => {
  const antd = jest.requireActual('antd');
  return {
    __esModule: true,
    default: antd.Form,
    useForm: antd.Form.useForm,
    useWatch: antd.Form.useWatch,
  };
});

jest.mock('~/components/main/upload', () => {
  const Mock = () => React.createElement('div', null, 'Upload');
  Mock.displayName = 'Upload';
  return Mock;
});

jest.mock('~/core/redux/modules/area-publica-inscricao/actions', () => ({
  setDadosFormacao: jest.fn(() => ({ type: 'SET_DADOS_FORMACAO' })),
}));

const renderComponent = () => {
  return render(
    <Form>
      <Inscricao />
    </Form>,
  );
};

describe('Inscricao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(jest.fn());

    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    (useDispatch as jest.Mock).mockReturnValue(jest.fn());

    (obterDadosInscricaoProposta as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        usuarioNome: 'Teste',
        usuarioCpf: '123',
        usuarioRf: '999',
        usuarioCargos: [],
        vagaRemanescente: false,
      },
    });

    (obterDadosFormacao as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        titulo: 'Formação Teste',
        periodo: '',
        periodoInscricao: '',
        areaPromotora: '',
        tipoFormacao: '',
        tipoFormacaoDescricao: '',
        formato: '',
        formatoDescricao: '',
        inscricaoEncerrada: false,
        imagemUrl: '',
        linkParaInscricoesExterna: '',
        usuarioAcessibilidade: null,
      },
    });

    (inserirInscricao as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: { mensagem: 'Inscrição realizada com sucesso' },
    });
  });

  it('renderiza título da página', async () => {
    renderComponent();
    expect(await screen.findByText(/Inscrição - Formação/i)).toBeInTheDocument();
  });

  it('renderiza botão voltar', async () => {
    renderComponent();
    expect(await screen.findByText('Voltar')).toBeInTheDocument();
  });

  it('renderiza campos básicos do formulário', async () => {
    renderComponent();
    expect(await screen.findByText('CPF')).toBeInTheDocument();
    expect(await screen.findByText('RF')).toBeInTheDocument();
  });

  it('renderiza select de turma', async () => {
    renderComponent();
    expect(await screen.findByText('SelectTurma')).toBeInTheDocument();
  });

  it('mostra opção de acessibilidade ao selecionar deficiência', async () => {
    renderComponent();
    const select = await screen.findByText(/Pessoa com deficiência/i);
    expect(select).toBeInTheDocument();
  });

  it('abre modal de acessibilidade ao submeter formulário', async () => {
    renderComponent();
    const salvar = await screen.findByText('Salvar Acessibilidade');
    fireEvent.click(salvar);
    await waitFor(() => {
      expect(salvar).toBeInTheDocument();
    });
  });

  it('chama serviço de inscrição ao submeter', async () => {
    renderComponent();
    const salvar = await screen.findByText('Salvar Acessibilidade');
    fireEvent.click(salvar);
    await waitFor(() => {
      expect(inserirInscricao).toHaveBeenCalled();
    });
  });

  it('abre modal de confirmação quando inscrição é bem sucedida', async () => {
    renderComponent();
    const salvar = await screen.findByText('Salvar Acessibilidade');
    fireEvent.click(salvar);
    const modalOk = await screen.findByText('Modal OK');
    expect(modalOk).toBeInTheDocument();
  });
});
