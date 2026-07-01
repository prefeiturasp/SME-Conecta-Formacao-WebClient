/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormularioDetalhamento from './formulario-detalhamento';
import { PermissaoContext } from '../../../../../../routes/config/guard/permissao/provider';

import {
  CampoConsideracaoEnum,
  CamposParecerNomeEnumDisplay,
} from '../../../../../../core/enum/campos-proposta-enum';

import {
  JUSTIFICATIVA_NAO_INFORMADA,
  OBJETIVO_NAO_INFORMADO,
  CONTEUDO_PROGRAMATICO_NAO_INFORMADO,
  PROCEDIMENTOS_METODOLOGICOS_NAO_INFORMADO,
  REFERENCIA_NAO_INFORMADA,
  JUSTIFICATIVA_REVALIDACAO_NAO_INFORMADA,
} from '../../../../../../core/constants/mensagens';

//
// MOCKS
//

jest.mock('~/components/lib/collapse', () => (props: any) => (
  <div data-testid="collapse">
    <span>{props.panelProps.header}</span>

    {props.titleToolTip && (
      <span data-testid="tooltip">{props.titleToolTip}</span>
    )}

    {props.children}
  </div>
));

const editorMock = jest.fn();

jest.mock('~/components/main/input/editor-texto', () => (props: any) => {
  editorMock(props);

  return (
    <div data-testid="editor">
      {props.nome}
    </div>
  );
});

jest.mock('~/components/main/input/palavras-chave', () => () => (
  <div data-testid="palavras-chave" />
));

jest.mock('~/components/main/input/anexo', () => (props: any) => (
  <div data-testid="anexo">
    {props.nome}
  </div>
));

const parecerMock = jest.fn();

jest.mock('../../components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: (props: any) => {
    parecerMock(props);

    return <div data-testid="parecer" />;
  },
}));

jest.mock(
  './components/campos-carga-horaria/cargas-horaria-provider',
  () => () => <div data-testid="carga-horaria" />,
);

//
// Helpers
//

const renderComponent = (
  revalidacao = false,
  desabilitarCampos = false,
) =>
  render(
    <PermissaoContext.Provider
      value={{
        desabilitarCampos,
      } as any}
    >
      <FormularioDetalhamento revalidacao={revalidacao} />
    </PermissaoContext.Provider>,
  );

describe('FormularioDetalhamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os painéis obrigatórios', () => {
    renderComponent();

    expect(screen.getByText('Carga horária')).toBeInTheDocument();

    expect(screen.getByText('Justificativa')).toBeInTheDocument();

    expect(screen.getByText('Objetivos')).toBeInTheDocument();

    expect(screen.getByText('Conteúdo Programático')).toBeInTheDocument();

    expect(screen.getByText('Procedimentos metodológicos')).toBeInTheDocument();

    expect(screen.getByText('Referências')).toBeInTheDocument();

    expect(screen.getByText('Palavras-chave')).toBeInTheDocument();

    expect(screen.getByText('Anexos')).toBeInTheDocument();
  });

  it('não deve renderizar justificativa de revalidação quando revalidacao=false', () => {
    renderComponent(false);

    expect(
      screen.queryByText('Justificativa da revalidação'),
    ).not.toBeInTheDocument();
  });

  it('deve renderizar justificativa de revalidação quando revalidacao=true', () => {
    renderComponent(true);

    expect(
      screen.getByText('Justificativa da revalidação'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'O que se pretende com a reapresentação da ação formativa?',
      ),
    ).toBeInTheDocument();
  });

  it('deve renderizar o provider de carga horária', () => {
    renderComponent();

    expect(screen.getByTestId('carga-horaria')).toBeInTheDocument();
  });

  it('deve renderizar o select de palavras-chave', () => {
    renderComponent();

    expect(screen.getByTestId('palavras-chave')).toBeInTheDocument();
  });

  it('deve renderizar InputAnexo', () => {
    renderComponent();

    expect(screen.getByTestId('anexo')).toBeInTheDocument();

    expect(screen.getByText('anexoUrl')).toBeInTheDocument();
  });

  it('deve criar todos os botões de parecer', () => {
    renderComponent();

    expect(parecerMock).toHaveBeenCalledTimes(7);

    expect(editorMock.mock.calls.map(call => call[0])).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.justificativa],
      mensagemErro: JUSTIFICATIVA_NAO_INFORMADA,
    }),
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.objetivos],
      mensagemErro: OBJETIVO_NAO_INFORMADO,
    }),
  ]),
);
  });

it('deve renderizar todos os editores corretamente', () => {
  renderComponent();

  expect(editorMock).toHaveBeenCalledTimes(5);

  expect(editorMock).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.justificativa],
      mensagemErro: JUSTIFICATIVA_NAO_INFORMADA,
      disabled: false,
    }),
  );

  expect(editorMock).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.objetivos],
      mensagemErro: OBJETIVO_NAO_INFORMADO,
      disabled: false,
    }),
  );

  expect(editorMock).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      nome:
        CamposParecerNomeEnumDisplay[
          CampoConsideracaoEnum.conteudoProgramatico
        ],
      mensagemErro: CONTEUDO_PROGRAMATICO_NAO_INFORMADO,
      disabled: false,
    }),
  );

  expect(editorMock).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      nome:
        CamposParecerNomeEnumDisplay[
          CampoConsideracaoEnum.procedimentoMetadologico
        ],
      mensagemErro: PROCEDIMENTOS_METODOLOGICOS_NAO_INFORMADO,
      disabled: false,
    }),
  );

  expect(editorMock).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.referencia],
      mensagemErro: REFERENCIA_NAO_INFORMADA,
      disabled: false,
    }),
  );
});

  it('deve renderizar editor de revalidação', () => {
    renderComponent(true);

    expect(editorMock).toHaveBeenCalledTimes(6);

    expect(editorMock.mock.calls.map(call => call[0])).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.justificativa],
      mensagemErro: JUSTIFICATIVA_NAO_INFORMADA,
    }),
    expect.objectContaining({
      nome: CamposParecerNomeEnumDisplay[CampoConsideracaoEnum.objetivos],
      mensagemErro: OBJETIVO_NAO_INFORMADO,
    }),
  ]),
);
  });

  it('deve repassar disabled=true para todos os editores', () => {
    renderComponent(false, true);

    editorMock.mock.calls.forEach(([props]) => {
      expect(props.disabled).toBe(true);
    });
  });

  it('deve repassar disabled=false para todos os editores', () => {
    renderComponent(false, false);

    editorMock.mock.calls.forEach(([props]) => {
      expect(props.disabled).toBe(false);
    });
  });

  it('deve possuir todos os collapses', () => {
    renderComponent(true);

    expect(screen.getAllByTestId('collapse')).toHaveLength(9);
  });
});