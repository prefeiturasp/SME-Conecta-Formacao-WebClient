/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';

import { Form } from 'antd';

import FormularioCertificacao from './formulario-certificacao';

import { PermissaoContext } from '../../../../../routes/config/guard/permissao/provider';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

// Use fake timers for controlled advancing in tests
jest.useFakeTimers();

const mockSetFieldValue = jest.fn();
const mockGetFieldValue = jest.fn();
const mockGetFieldError = jest.fn();
const mockSetFields = jest.fn();

let watchValue: any = undefined;

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  return {
    ...antd,

    Form: {
      ...antd.Form,

      useFormInstance: () => ({
        setFieldValue: mockSetFieldValue,
        getFieldValue: mockGetFieldValue,
        getFieldError: mockGetFieldError,
        setFields: mockSetFields,
      }),

      useWatch: () => watchValue,
    },
  };
});

////////////////////////////////////////////////////////////////////////////////

jest.mock(
  '~/components/main/input/dre',
  () => ({
    SelectDRE: () => <div data-testid="select-dre" />,
  }),
);

jest.mock(
  '~/pages/cadastros/coordenadoria/components/select-coordenadoria/select-coordenadoria',
  () => ({
    SelectCoordenadoria: () => (
      <div data-testid="select-coordenadoria" />
    ),
  }),
);

jest.mock(
  '../components/select-tipo-emissor',
  () => () => (
    <div data-testid="tipo-emissor" />
  ),
);

jest.mock(
  '~/components/main/input/editor-texto',
  () =>
    (props: any) =>
      (
        <div
          data-testid="editor"
          data-required={props.required}
          data-disabled={props.disabled}
        />
      ),
);

jest.mock(
  '~/components/lib/checkbox',
  () => () => (
    <div data-testid="checkbox" />
  ),
);

jest.mock(
  '~/components/lib/inputs/select',
  () => (props: any) =>
    (
      <select
        data-testid="select-vazio"
        disabled={props.disabled}
      />
    ),
);

jest.mock(
  '~/components/main/input/criterio-certificacao',
  () => (props: any) => (
    <button
      data-testid="criterio"
      onClick={props.onchange ?? props.onChange}
    >
      criterio
    </button>
  ),
);

jest.mock(
  '../components/modal-parecer/modal-parecer-button',
  () => ({
    ButtonParecer: ({ children }: any) => children,
  }),
);

////////////////////////////////////////////////////////////////////////////////

const renderComponent = () =>
  render(
    <PermissaoContext.Provider
      value={{
        desabilitarCampos: false,
      } as any}
    >
      <Form>
        <FormularioCertificacao />
      </Form>
    </PermissaoContext.Provider>,
  );

////////////////////////////////////////////////////////////////////////////////

describe('FormularioCertificacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    watchValue = undefined;

    mockGetFieldValue.mockImplementation((campo) => {
      switch (campo) {
        case 'cursoComCertificado':
          return false;

        case 'criterioCertificacao':
          return [];

        default:
          return undefined;
      }
    });

    mockGetFieldError.mockReturnValue([]);
  });

  it('deve renderizar normalmente', () => {
    renderComponent();

    expect(
      screen.getByText('Curso com certificação'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('editor'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('checkbox'),
    ).toBeInTheDocument();
  });

  it('deve executar obterDados', async () => {
    renderComponent();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        mockGetFieldValue,
      ).toHaveBeenCalledWith(
        'cursoComCertificado',
      );
    });
  });

  it('deve tornar editor obrigatório quando critério 4 existir', async () => {
    mockGetFieldValue.mockImplementation((campo) => {
      switch (campo) {
        case 'cursoComCertificado':
          return false;

        case 'criterioCertificacao':
          return [4];

        default:
          return undefined;
      }
    });

    renderComponent();

    fireEvent.click(
      screen.getByTestId('criterio'),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('editor'),
      ).toHaveAttribute(
        'data-required',
        'true',
      );
    });
  });

  it('deve limpar erro quando não existir critério obrigatório', async () => {
    mockGetFieldError.mockReturnValue([
      'erro',
    ]);

    renderComponent();

    fireEvent.click(
      screen.getByTestId('criterio'),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        mockSetFields,
      ).toHaveBeenCalled();
    });
  });

  it('deve alterar curso para Sim', async () => {
    renderComponent();

      // aguarda efeitos que renderizam os radios
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    mockSetFieldValue.mockClear();

    const radioSim = await screen.findByText('Sim');

    act(() => fireEvent.click(radioSim));

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        'cursoComCertificado',
        true,
      );
    });
  }); 

  it('deve renderizar Select vazio quando tipo emissor não existir', async () => {
    mockGetFieldValue.mockImplementation((campo) => {
      if (campo === 'cursoComCertificado')
        return true;

      if (campo === 'criterioCertificacao')
        return [];

      return undefined;
    });

    renderComponent();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('select-vazio'),
      ).toBeDisabled();
    });
  });

  it('deve renderizar SelectDRE', async () => {
    watchValue = 1;

    mockGetFieldValue.mockImplementation((campo) => {
      if (campo === 'cursoComCertificado')
        return true;

      if (campo === 'criterioCertificacao')
        return [];

      return undefined;
    });

    renderComponent();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('select-dre'),
      ).toBeInTheDocument();
    });
  });

  it('deve renderizar SelectCoordenadoria', async () => {
    watchValue = 2;

    mockGetFieldValue.mockImplementation((campo) => {
      if (campo === 'cursoComCertificado')
        return true;

      if (campo === 'criterioCertificacao')
        return [];

      return undefined;
    });

    renderComponent();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'select-coordenadoria',
        ),
      ).toBeInTheDocument();
    });
  });

  it('deve desabilitar editor conforme contexto', () => {
    render(
      <PermissaoContext.Provider
        value={{
          desabilitarCampos: true,
        } as any}
      >
        <Form>
          <FormularioCertificacao />
        </Form>
      </PermissaoContext.Provider>,
    );

    expect(
      screen.getByTestId('editor'),
    ).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('não deve limpar erro quando não houver erros', () => {
    mockGetFieldError.mockReturnValue([]);

    renderComponent();

    fireEvent.click(
      screen.getByTestId('criterio'),
    );

    expect(
      mockSetFields,
    ).not.toHaveBeenCalled();
  });
});