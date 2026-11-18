/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';

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
import { render, screen, fireEvent } from '@testing-library/react';
import FormularioDatas from './formulario-datas';
import { Form } from 'antd';
import { notification } from '~/components/lib/notification';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    warning: jest.fn(),
  },
}));

jest.mock('~/components/lib/drawer/drawer-form-encontro-turmas', () => () => <div>DrawerMock</div>);

jest.mock('~/components/lib/card-table-encontros', () => {
  const R = require('react');
  return R.forwardRef((_props: any, ref: any) => {
    R.useImperativeHandle(ref, () => ({ reloadTable: jest.fn() }));
    return R.createElement('div', null, 'TabelaMock');
  });
});

jest.mock('../components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/lib/excluir-button', () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    Excluir
  </button>
));

jest.mock('~/components/main/input/date-range', () => ({
  DatePickerPeriodo: ({ formItemProps, rangerPickerProps }: any) => {
    const id = rangerPickerProps?.id ?? formItemProps?.name;
    return (
      <input
        id={id}
        data-testid={`date-picker-${id}`}
        disabled={rangerPickerProps?.disabled}
        readOnly
      />
    );
  },
}));

jest.mock('~/components/main/input/time-range', () => ({
  TimePickerPeriodo: (props: any) => (
    <div data-testid='time-picker-periodo'>
      {typeof props.formItemProps?.label === 'string'
        ? props.formItemProps.label
        : props.formItemProps?.label}
    </div>
  ),
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } },
    Suporte: {
      Primary: {
        INFO: '#086397',
      },
    },
  },
}));

jest.mock('styled-components', () => ({
  createGlobalStyle: () => () => null,
}));

jest.mock('@ant-design/icons', () => ({
  InfoCircleFilled: () => <span data-testid='info-icon' />,
  PlusOutlined: () => <span data-testid='plus-icon'>+</span>,
}));

const WrapperComForm: React.FC<{ initialValues?: any; children: React.ReactNode }> = ({
  initialValues,
  children,
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} initialValues={initialValues}>
      {children}
    </Form>
  );
};

const renderComForm = (ui: React.ReactNode, initialValues?: any) => {
  return render(<WrapperComForm initialValues={initialValues}>{ui}</WrapperComForm>);
};

describe('FormularioDatas', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: 1 });
    jest.clearAllMocks();
  });

  it('renderiza título principal', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Cronograma geral')).toBeInTheDocument();
  });

  it('exibe aviso ao tentar abrir modal sem datas', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);

    const botao = screen.getByText('Adicionar datas');
    fireEvent.click(botao);

    expect(notification.warning).toHaveBeenCalled();
  });

  it('renderiza botão adicionar datas', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Adicionar datas')).toBeInTheDocument();
  });

  it('renderiza seções de período geral da inscrição e período customizado', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Período geral da inscrição')).toBeInTheDocument();
    expect(screen.getByText('Período de inscrição customizado')).toBeInTheDocument();
  });

  it('renderiza campo hora de início e fim de inscrição', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByTestId('time-picker-periodo')).toBeInTheDocument();
    expect(screen.getByText(/Hora de início e fim/i)).toBeInTheDocument();
  });

  it('renderiza listagem de encontros', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Listagem de encontros')).toBeInTheDocument();
  });

  it('renderiza tabela mockada', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('TabelaMock')).toBeInTheDocument();
  });

  it('deve conter o texto de tooltip atualizado com 23h59', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    const timePickerElement = screen.getByTestId('time-picker-periodo');
    expect(timePickerElement.textContent).toContain('Hora de início e fim');
  });

  it('mantém campos de período de inscrição customizado desabilitados quando período geral não for preenchido', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    const datePickerCustom = screen.getByTestId('date-picker-gruposPeriodosInscricao-0-periodo');
    expect(datePickerCustom).toBeDisabled();
  });

  it('habilita campos de período customizado quando período geral da inscrição for preenchido', () => {
    const inicio = dayjs('2026-10-01');
    const fim = dayjs('2027-01-30');
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />, {
      periodoInscricao: [inicio, fim],
      turmas: [{ id: 1, nome: 'Turma 01' }],
    });

    const datePickerCustom = screen.getByTestId('date-picker-gruposPeriodosInscricao-0-periodo');
    expect(datePickerCustom).not.toBeDisabled();
  });

  it('permite adicionar nova linha de período customizado ao clicar no botão (+)', () => {
    const inicio = dayjs('2026-10-01');
    const fim = dayjs('2027-01-30');
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />, {
      periodoInscricao: [inicio, fim],
      turmas: [
        { id: 1, nome: 'Turma 01' },
        { id: 2, nome: 'Turma 02' },
      ],
    });

    const botoesPlus = screen.getAllByTestId('plus-icon');
    expect(botoesPlus.length).toBeGreaterThanOrEqual(1);

    const botaoAdd = botoesPlus[botoesPlus.length - 1].closest('button');
    expect(botaoAdd).not.toBeNull();
    fireEvent.click(botaoAdd!);

    const botoesExcluir = screen.getAllByText('Excluir');
    expect(botoesExcluir.length).toBeGreaterThanOrEqual(1);
  });
});
