/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ModalAprovarRecusarConteudoInicial } from './modal-aprovar-recusar-conteudo-inicial';

import { useAppSelector } from '../../../../../../core/hooks/use-redux';
import { obterSugestoes } from '../../../../../../core/services/proposta-service';
import { SituacaoProposta } from '../../../../../../core/enum/situacao-proposta';

const mockSetFieldValue = jest.fn();

const mockStoreState = {
  perfil: {
    perfilSelecionado: {
      perfilNome: 'Outro',
    },
  },
};

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock('antd', () => {
  const Col = ({ children, style }: any) => <div style={style}>{children}</div>;
  const Flex = ({ children }: any) => <div>{children}</div>;
  const Row = ({ children }: any) => <div>{children}</div>;

  const TextArea = ({ id, disabled, maxLength, rows, style }: any) => (
    <textarea id={id} disabled={disabled} maxLength={maxLength} rows={rows} style={style} />
  );

  const Input = { TextArea };

  const FormItem = ({ children, label, style }: any) => (
    <div style={style}>
      <label>{label}</label>
      {children}
    </div>
  );

  const Title = ({ children }: any) => <h5>{children}</h5>;

  return {
    __esModule: true,
    Col,
    Flex,
    Form: {
      Item: FormItem,
    },
    Input,
    Row,
    Typography: {
      Title,
    },
  };
});

jest.mock('antd/es/form/hooks/useFormInstance', () => ({
  __esModule: true,
  default: () => ({
    setFieldValue: mockSetFieldValue,
  }),
}));

jest.mock('~/components/lib/button/secundary', () => ({
  ButtonSecundary: ({ children, onClick, disabled }: any) => (
    <button disabled={disabled} onClick={onClick} type='button'>
      {children}
    </button>
  ),
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterSugestoes: jest.fn(),
}));

jest.mock('~/core/enum/tipo-perfil', () => ({
  TipoPerfilEnum: {
    AdminDF: 1,
    Cursista: 2,
    DF: 3,
    Parecerista: 4,
  },
  TipoPerfilTagDisplay: {
    1: 'Admin DF',
    2: 'Cursista',
    3: 'DF',
    4: 'Parecerista',
  },
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

describe('ModalAprovarRecusarConteudoInicial', () => {
  const renderComponent = (props: Partial<React.ComponentProps<typeof ModalAprovarRecusarConteudoInicial>> = {}) =>
    render(
      <ModalAprovarRecusarConteudoInicial
        propostaId={1}
        onClickSalvar={jest.fn()}
        aprovarSelecionado
        situacao={SituacaoProposta.AguardandoAnalisePeloParecerista}
        {...props}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation(() => mockStoreState.perfil.perfilSelecionado);
  });

  it('deve renderizar botão de aprovação', () => {
    renderComponent();

    expect(screen.getByText('Enviar Aprovação')).toBeInTheDocument();
  });

  it('deve renderizar botão de recusa', () => {
    renderComponent({ aprovarSelecionado: false });

    expect(screen.getByText('Enviar Recusa')).toBeInTheDocument();
  });

  it('deve chamar salvar ao clicar botão', () => {
    const onClickSalvar = jest.fn();

    renderComponent({ onClickSalvar });

    fireEvent.click(screen.getByText('Enviar Aprovação'));

    expect(onClickSalvar).toHaveBeenCalledTimes(1);
  });

  it('não deve buscar sugestões para perfil comum', () => {
    renderComponent();

    expect(obterSugestoes).not.toHaveBeenCalled();
  });

  it('não deve aplicar maxLength para outro perfil', () => {
    mockStoreState.perfil.perfilSelecionado.perfilNome = 'Outro';

    renderComponent();

    expect(screen.getByRole('textbox')).not.toHaveAttribute('maxlength');
  });
});
