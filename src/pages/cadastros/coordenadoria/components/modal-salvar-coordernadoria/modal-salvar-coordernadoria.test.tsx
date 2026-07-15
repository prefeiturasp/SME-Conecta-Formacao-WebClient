/**
 * @jest-environment jsdom
 */

declare const require: any;

const globalAny = globalThis as any;
const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

globalAny.window = globalAny.window ?? globalAny;
globalAny.window.matchMedia = matchMediaMock;

require('@testing-library/jest-dom');

const { fireEvent, render, screen, waitFor } = require('@testing-library/react');

jest.mock('antd', () => {
  const React = require('react');

  const formApi: any = {
    setFieldsValue: () => undefined,
    resetFields: () => undefined,
    submit: () => undefined,
    getFieldValue: () => undefined,
  };

  const FormContext = React.createContext<any>(null);

  const Form = ({ children, onFinish, initialValues = {} }: any) => {
    const [values, setValues] = React.useState(initialValues);
    const [submitted, setSubmitted] = React.useState(false);
    const requiredFields = React.useRef<Record<string, boolean>>({});

    formApi.setFieldsValue = (nextValues: any) => setValues((current: any) => ({ ...current, ...nextValues }));
    formApi.resetFields = () => {
      setSubmitted(false);
      setValues(initialValues);
    };
    formApi.getFieldValue = (fieldName: string) => values[fieldName];
    formApi.submit = () => {
      setSubmitted(true);
      const hasError = Object.entries(requiredFields.current).some(([fieldName, isRequired]) => {
        return isRequired && !values[fieldName];
      });

      if (!hasError) {
        onFinish?.(values);
      }
    };

    return React.createElement(
      FormContext.Provider,
      { value: { values, setValues, submitted, requiredFields } },
      React.createElement('form', null, children),
    );
  };

  Form.useForm = () => [formApi];
  Form.Item = ({ children, name, label, rules }: any) =>
    React.createElement(FormContext.Consumer, null, ({ values, setValues, submitted, requiredFields }: any) => {
      if (name) {
        requiredFields.current[name] = Boolean(rules?.some((rule: any) => rule.required));
      }

      const childProps = React.isValidElement(children) ? children.props : {};
      const fieldValue = values?.[name] ?? '';
      const childElement = React.createElement('input', {
        ...childProps,
        name,
        value: fieldValue,
        onChange: (event: any) => {
          const nextValue = event?.target?.value ?? event;
          setValues((current: any) => ({ ...current, [name]: nextValue }));
          childProps?.onChange?.(event);
        },
        onKeyDown: (event: any) => {
          if (event.key === 'Enter') {
            childProps?.onPressEnter?.(event);
          }
        },
      });

      const showRequiredError = submitted && requiredFields.current[name] && !values?.[name];

      return React.createElement(
        'div',
        null,
        label,
        childElement,
        showRequiredError ? React.createElement('span', null, 'Campo obrigatório') : null,
      );
    });

  const Button = ({ children, onClick }: any) => React.createElement('button', { type: 'button', onClick }, children);
  const Input = (props: any) => React.createElement('input', props);
  const Typography = { Paragraph: ({ children }: any) => React.createElement('p', null, children) };

  return {
    __esModule: true,
    Button,
    Form,
    Input,
    Typography,
  };
});
jest.mock('~/components/lib/modal', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: ({ title, children, footer, open }: any) => {
      if (!open) {
        return null;
      }

      return React.createElement(
        'div',
        { 'data-testid': 'modal' },
        React.createElement('div', null, title),
        children,
        React.createElement('div', null, footer),
      );
    },
  };
});

const ModalSalvarCoordenadoria = require('./modal-salvar-coordernadoria').default;

describe('ModalSalvarCoordenadoria', () => {
  const criarProps = (props: any = {}) => ({
    visible: true,
    modoEdicao: false,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    onDelete: jest.fn(),
    ...props,
  });

  it('deve renderizar modal de criação', () => {
    render(<ModalSalvarCoordenadoria {...criarProps()} />);

    expect(screen.getByText(/Adicionar\s+coordenadoria/i)).toBeInTheDocument();
    expect(screen.getByText(/Adicione\s+uma\s+nova\s+coordenadoria/i)).toBeInTheDocument();
  });

  it('deve renderizar modal de edição', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          modoEdicao: true,
          coordenadoriaInicial: {
            id: 10,
            nome: 'Financeiro',
            sigla: 'FIN',
          },
        })}
      />,
    );

    expect(screen.getByText(/Editar\s+Coordenadoria/i)).toBeInTheDocument();
    expect(screen.getByText(/Você pode editar o nome/i)).toBeInTheDocument();
  });

  it('deve manter a descrição do modo edição', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          modoEdicao: true,
          coordenadoriaInicial: {
            id: 5,
            nome: 'Teste',
            sigla: 'TS',
          },
        })}
      />,
    );

    expect(screen.getByText(/Você pode editar o nome/i)).toBeInTheDocument();
  });

  it('deve resetar formulário no modo criação', () => {
    render(<ModalSalvarCoordenadoria {...criarProps()} />);

    expect(screen.getByPlaceholderText('Digite o nome da coordenadoria')).toHaveValue('');
  });

  it('deve exibir o botão salvar', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          onConfirm: jest.fn(),
        })}
      />,
    );

    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve exibir o botão excluir no modo edição', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          modoEdicao: true,
          coordenadoriaInicial: {
            id: 99,
            nome: 'Inicial',
            sigla: 'INI',
          },
          onConfirm: jest.fn(),
        })}
      />,
    );

    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('não deve salvar sem nome obrigatório', async () => {
    const onConfirm = jest.fn();

    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          onConfirm,
        })}
      />,
    );

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('deve chamar cancelar', () => {
    const onCancel = jest.fn();

    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          onCancel,
        })}
      />,
    );

    fireEvent.click(screen.getByText('Cancelar'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar botão excluir somente no modo edição', () => {
    const { rerender } = render(<ModalSalvarCoordenadoria {...criarProps()} />);

    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();

    rerender(
      <ModalSalvarCoordenadoria
        {...criarProps({
          modoEdicao: true,
        })}
      />,
    );

    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('deve chamar onDelete ao excluir', () => {
    const onDelete = jest.fn();

    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          modoEdicao: true,
          onDelete,
        })}
      />,
    );

    fireEvent.click(screen.getByText('Excluir'));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar loading no salvar', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          loading: true,
        })}
      />,
    );

    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve manter o campo de nome renderizado', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          onConfirm: jest.fn(),
        })}
      />,
    );

    expect(screen.getByPlaceholderText('Digite o nome da coordenadoria')).toBeInTheDocument();
  });

  it('não deve renderizar quando visible false', () => {
    render(
      <ModalSalvarCoordenadoria
        {...criarProps({
          visible: false,
        })}
      />,
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});