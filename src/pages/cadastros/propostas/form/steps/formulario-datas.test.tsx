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

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    warning: jest.fn(),
  },
}));

jest.mock('~/components/lib/drawer/drawer-form-encontro-turmas', () => () => (
  <div>DrawerMock</div>
));

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
  <button onClick={props.onClick}>Excluir</button>
));

jest.mock('~/components/main/input/date-range', () => ({
  DatePickerPeriodo: () => <div />,
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: { SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } } },
}));

jest.mock('styled-components', () => ({
  createGlobalStyle: () => () => null,
}));

jest.mock('@ant-design/icons', () => ({
  InfoCircleFilled: () => <span />,
  PlusOutlined: () => <span />,
}));

const renderComForm = (ui: React.ReactNode) => {
  return render(<Form>{ui}</Form>);
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

  it('renderiza seção de inscrição', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Inscrição')).toBeInTheDocument();
  });

  it('renderiza listagem de encontros', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('Listagem de encontros')).toBeInTheDocument();
  });

  it('renderiza tabela mockada', () => {
    renderComForm(<FormularioDatas recarregarTurmas={false as any} />);
    expect(screen.getByText('TabelaMock')).toBeInTheDocument();
  });
});