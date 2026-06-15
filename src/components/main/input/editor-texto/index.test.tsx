/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import EditorTexto from './index';

const editorMock = jest.fn();
const tooltipMock = jest.fn();

const form = {
  getFieldError: jest.fn(),
};

jest.mock('~/components/lib/inputs/editor/index.tsx', () => (props: any) => {
  editorMock(props);

  return <div data-testid="editor" />;
});

jest.mock('antd', () => {

  const FormItem = jest.fn(({ children, ...props }: any) => {
    if (props.shouldUpdate) {
      return typeof children === 'function'
        ? children(form)
        : children;
    }

    return (
      <div data-testid="form-item">
        {props.label}
        {props.tooltip?.icon}
        {typeof children === 'function'
          ? children(form)
          : children}
      </div>
    );
  });

  return {
    Tooltip: (props: any) => {
      tooltipMock(props);

      return (
        <div data-testid="tooltip">{props.children}</div>
      );
    },

    Form: {
      Item: FormItem,
    },
  };
});

jest.mock('@ant-design/icons', () => ({
  InfoCircleFilled: () => (
    <span data-testid="info-icon" />
  ),
}));

describe('EditorTexto', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    form.getFieldError.mockReturnValue([]);
  });

  it('deve renderizar o editor', () => {
    render(
      <EditorTexto
        nome="descricao"
      />
    );

    expect(screen.getByTestId('editor')).toBeInTheDocument();
  });

  it('deve configurar o placeholder', () => {
    render(
      <EditorTexto
        nome="descricao"
        label="Descrição"
      />
    );

    expect(editorMock.mock.calls[0][0].config.placeholder)
      .toBe('Descrição');
  });

  it('deve configurar o editor como desabilitado', () => {
    render(
      <EditorTexto
        nome="descricao"
        disabled
      />
    );

    expect(editorMock.mock.calls[0][0].config.disabled)
      .toBe(true);
  });

  it('deve configurar o editor como habilitado por padrão', () => {
    render(
      <EditorTexto
        nome="descricao"
      />
    );

    expect(editorMock.mock.calls[0][0].config.disabled)
      .toBe(false);
  });

  it('deve informar hasError=false quando não houver erro', () => {
    form.getFieldError.mockReturnValue([]);

    render(
      <EditorTexto
        nome="descricao"
      />
    );

    const editorProps = editorMock.mock.calls.at(-1)?.[0];

    expect(editorProps?.hasError)
      .toBe(false);
  });

  it('deve informar hasError=true quando houver erro', () => {
    form.getFieldError.mockReturnValue(['erro']);

    render(
      <EditorTexto
        nome="descricao"
      />
    );

    const editorProps = editorMock.mock.calls.at(-1)?.[0];

    expect(editorProps?.hasError)
      .toBe(true);
  });

  it('deve renderizar o ícone do tooltip', () => {
    render(
      <EditorTexto
        nome="descricao"
        label="Descrição"
        exibirTooltip
        mensagemTooltip="Ajuda"
      />
    );

    expect(screen.getByTestId('tooltip'))
      .toBeInTheDocument();

    expect(screen.getByTestId('info-icon'))
      .toBeInTheDocument();
  });

  it('deve utilizar a mensagem de erro personalizada', () => {
    render(
      <EditorTexto
        nome="descricao"
        mensagemErro="Mensagem personalizada"
      />
    );

    const antdMock = jest.requireMock('antd');
    const formItemProps = antdMock.Form.Item.mock.calls.at(-1)?.[0];

    expect(formItemProps.rules[0].message)
      .toBe('Mensagem personalizada');
  });

  it('deve utilizar a mensagem padrão', () => {
    render(
      <EditorTexto
        nome="descricao"
      />
    );

    const antdMock = jest.requireMock('antd');
    const formItemProps = antdMock.Form.Item.mock.calls.at(-1)?.[0];

    expect(formItemProps.rules[0].message)
      .toBe('Campo obrigatório');
  });

  it('deve configurar required=false', () => {
    render(
      <EditorTexto
        nome="descricao"
        required={false}
      />
    );

    const antdMock = jest.requireMock('antd');
    const formItemProps = antdMock.Form.Item.mock.calls.at(-1)?.[0];

    expect(formItemProps.rules[0].required)
      .toBe(false);
  });

  it('deve configurar required=true por padrão', () => {
    render(
      <EditorTexto
        nome="descricao"
      />
    );

    const antdMock = jest.requireMock('antd');
    const formItemProps = antdMock.Form.Item.mock.calls.at(-1)?.[0];

    expect(formItemProps.rules[0].required)
      .toBe(true);
  });
});