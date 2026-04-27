/**
 * @jest-environment jsdom
 */

// ─── ALL jest.mock() calls MUST appear before any import ──────────────────────

// ─── API (prevents import.meta crash) ────────────────────────────────────────
jest.mock('~/core/services/api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

// ─── Step components (prevent deep import chains) ─────────────────────────────
jest.mock('./steps//formulario-informacoes-gerais/informacoes-gerais', () => () => null);
jest.mock('./steps/formulario-certificacao', () => () => null);
jest.mock('./steps/formulario-datas', () => () => null);
jest.mock('./steps/formulario-detalhamento/formulario-detalhamento', () => () => null);
jest.mock('./steps/formulario-profissionais', () => () => null);

// ─── Local sub-components with complex deps ────────────────────────────────────
jest.mock('~/components/lib/excluir-button', () => () => null);
jest.mock('~/components/lib/modal-erros-proposta', () => () => null);
jest.mock('~/components/lib/object-card/dados-cadastrante', () => () => null);
jest.mock('~/components/main/button/voltar', () => () => null);
jest.mock('~/components/main/input/parecerista', () => ({
  SelectPareceristas: () => null,
}));
jest.mock('~/components/main/input/responsavel-df', () => () => null);
jest.mock('~/components/main/text/text-area', () => () => null);
jest.mock('~/components/main/numero', () => () => null);
jest.mock('./components/modal-aprovar-recusar/modal-aprovar-recusar-button', () => ({
  ModalAprovarRecusarButton: () => null,
}));
jest.mock('./components/modal-devolver/modal-devolver-button', () => () => null);
jest.mock('./components/modal-imprimir/modal-imprimir-button', () => () => null);

// ─── ANT DESIGN ───────────────────────────────────────────────────────────────
jest.mock('antd', () => {
  const Mock = ({ children }: any) => <div>{children}</div>;

  const Input = (props: any) => <input {...props} />;
  Input.TextArea = (props: any) => <textarea {...props} />;

  const Modal = (props: any) => <div>{props.children}</div>;

  const Form: any = ({ children }: any) => <div>{children}</div>;
  const FormItem = ({ children }: any) => (
    <div>{typeof children === 'function' ? children() : children}</div>
  );
  FormItem.displayName = 'Form.Item';
  Form.Item = FormItem;
  Form.useWatch = jest.fn();

  return {
    __esModule: true,
    Badge: { Ribbon: Mock },
    Button: (props: any) => <button {...props}>{props.children}</button>,
    Col: Mock,
    Row: Mock,
    Divider: Mock,
    Space: Mock,
    Input,
    Modal,
    Form,
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [
    {
      getFieldValue: jest.fn(),
      getFieldsValue: jest.fn(() => ({})),
      isFieldsTouched: jest.fn(() => true),
      resetFields: jest.fn(),
      validateFields: jest.fn().mockResolvedValue({}),
    },
  ],
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => ({
    getFieldValue: jest.fn(),
  }),
}));

jest.mock('antd/es/select', () => ({}));

// ─── ICONS ────────────────────────────────────────────────────────────────────
jest.mock('@ant-design/icons', () => ({
  WarningFilled: () => <span>icon</span>,
}));

// ─── ROUTER ───────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(() => ({})),
}));

// ─── REDUX ────────────────────────────────────────────────────────────────────
jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn((selector) =>
    selector({
      auth: { token: 'fake-token', usuarioLogin: 'user' },
      perfil: { perfilSelecionado: { perfilNome: 'AdminDF', perfil: 1 } },
    }),
  ),
}));

jest.mock('jwt-decode', () => jest.fn(() => ({ dres: [] })));

// ─── SERVICES ─────────────────────────────────────────────────────────────────
jest.mock('~/core/services/dre-service', () => ({
  obterDREs: jest.fn().mockResolvedValue({ dados: [] }),
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterPropostaPorId: jest.fn().mockResolvedValue({ sucesso: true, dados: {} }),
  inserirProposta: jest.fn().mockResolvedValue({
    sucesso: true,
    dados: { entidadeId: 1 },
    mensagens: [],
  }),
  alterarProposta: jest.fn().mockResolvedValue({ sucesso: true, dados: {}, mensagens: [] }),
  deletarProposta: jest.fn().mockResolvedValue({ sucesso: true }),
  enviarPropostaAnalise: jest.fn().mockResolvedValue({ sucesso: true, mensagens: [] }),
  enviarParecer: jest.fn().mockResolvedValue({ sucesso: true }),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(({ onOk }) => onOk && onOk()),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn() },
}));

// ─── UI MOCKS ─────────────────────────────────────────────────────────────────
jest.mock('~/components/lib/header-page', () => (props: any) => (
  <div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
));

jest.mock('~/components/main/steps', () => () => <div>steps</div>);
jest.mock('~/components/main/spin', () => (props: any) => <div>{props.children}</div>);
jest.mock('~/components/lib/card-content', () => (props: any) => <div>{props.children}</div>);
jest.mock('~/components/main/text/auditoria', () => () => <div>auditoria</div>);

// ─── CONTEXTS ─────────────────────────────────────────────────────────────────
jest.mock('~/routes/config/guard/permissao/provider', () => {
  const React = require('react');
  return {
    PermissaoContext: React.createContext({
      desabilitarCampos: false,
      setDesabilitarCampos: jest.fn(),
    }),
  };
});

jest.mock('./provider', () => {
  const React = require('react');
  return {
    PropostaContext: React.createContext({
      formInitialValues: { podeEnviar: true },
      setFormInitialValues: jest.fn(),
    }),
  };
});

// ─── IMPORTS ──────────────────────────────────────────────────────────────────
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormCadastroDePropostas } from './index';

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('FormCadastroDePropostas (coverage)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', async () => {
    render(<FormCadastroDePropostas />);
    expect(await screen.findByText('Cadastro de Propostas')).toBeInTheDocument();
  });

  it('should click próximo passo', async () => {
    render(<FormCadastroDePropostas />);
    const btn = await screen.findByText('Próximo passo');
    fireEvent.click(btn);
    expect(btn).toBeInTheDocument();
  });

  it('should call salvar rascunho', async () => {
    const { inserirProposta } = require('~/core/services/proposta-service');

    render(<FormCadastroDePropostas />);
    const btn = await screen.findByText('Salvar rascunho');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(inserirProposta).toHaveBeenCalled();
    });
  });

  it('should load data when id exists', async () => {
    const router = require('react-router-dom');
    router.useParams.mockReturnValue({ id: '1' });

    const { obterPropostaPorId } = require('~/core/services/proposta-service');

    render(<FormCadastroDePropostas />);

    await waitFor(() => {
      expect(obterPropostaPorId).toHaveBeenCalledWith(1);
    });
  });

  it('should handle enviar proposta', async () => {
    const { enviarPropostaAnalise } = require('~/core/services/proposta-service');

    render(<FormCadastroDePropostas />);
    const btn = await screen.findByText('Enviar');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(enviarPropostaAnalise).toHaveBeenCalled();
    });
  });
});
