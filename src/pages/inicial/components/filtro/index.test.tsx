/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { FiltroPaginaInicial } from './index';
import { useAppSelector } from '../../../../core/hooks/use-redux';
import { obterAreaPromotoraLista } from '../../../../core/services/area-promotora-service';

jest.mock('../../../../core/hooks/use-redux');
jest.mock('../../../../core/services/area-promotora-service');

const setFieldValue = jest.fn();
const getFieldValue = jest.fn();
const resetFields = jest.fn();

const formMock = {
  getFieldValue,
  setFieldValue,
  resetFields,
};

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [formMock],
}));

jest.mock('antd', () => {
  const Col = ({ children }: any) => <div>{children}</div>;
  const Row = ({ children }: any) => <div>{children}</div>;
  const FormItem = ({ children }: any) => (
    <div>{typeof children === 'function' ? children() : children}</div>
  );
  const Form = ({ children }: any) => <div>{children}</div>;

  Form.Item = FormItem;

  return {
    Col,
    Row,
    Form,
  };
});

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: ({ title }: any) => <div>{title}</div>,
}));

jest.mock('~/components/main/input/area-promotora', () => () => (
  <div>AreaPromotora</div>
));

jest.mock('~/components/main/input/formato', () => () => (
  <div>Formato</div>
));

jest.mock('~/components/main/input/publico-alvo', () => () => (
  <div>Publico</div>
));

jest.mock('~/components/main/input/situacao-proposta', () => () => (
  <div>Situacao</div>
));

jest.mock('~/components/main/input/date-range', () => ({
  DatePickerPeriodo: () => <div>DatePicker</div>,
}));

jest.mock('~/components/main/text/input-text', () => () => (
  <div>InputTexto</div>
));

jest.mock('~/components/main/numero', () => () => (
  <div>InputNumero</div>
));

const listaCards = jest.fn(
  (_: { carregando: boolean; filters: any }) => <div>ListaCards</div>,
);

jest.mock('../lista-cards/inde', () => ({
  ListaCardsPropostas: (props: any) => listaCards(props),
}));

const mockedSelector = useAppSelector as jest.Mock;
const mockedArea = obterAreaPromotoraLista as jest.Mock;

describe('FiltroPaginaInicial', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedSelector.mockImplementation((selector) =>
      selector({
        perfil: {
          perfilSelecionado: {
            perfilNome: 'DRE',
          },
        },
      }),
    );

    getFieldValue.mockReturnValue(undefined);

    mockedArea.mockResolvedValue({
      sucesso: true,
      dados: [],
    });
  });

  it('deve renderizar corretamente', async () => {
    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(mockedArea).toHaveBeenCalled();
    });
  });

  it('deve preencher area promotora quando encontrar perfil', async () => {
    mockedArea.mockResolvedValue({
      sucesso: true,
      dados: [
        {
          id: 15,
          descricao: 'DRE',
        },
      ],
    });

    getFieldValue.mockImplementation((campo) => {
      if (campo === 'areaPromotoraId') return 15;
      return undefined;
    });

    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith(
        'areaPromotoraId',
        15,
      );
    });
  });

  it('não deve preencher área quando não encontrar perfil', async () => {
    mockedArea.mockResolvedValue({
      sucesso: true,
      dados: [
        {
          id: 20,
          descricao: 'SME',
        },
      ],
    });

    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(setFieldValue).not.toHaveBeenCalled();
    });
  });

  it('não deve preencher área quando serviço retornar sucesso false', async () => {
    mockedArea.mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(setFieldValue).not.toHaveBeenCalled();
    });
  });

  it('deve montar filtros quando período existir', async () => {
    getFieldValue.mockImplementation((campo) => {
      if (campo === 'periodoRealizacao')
        return [
          {
            format: () => '2025/01/01',
          },
          {
            format: () => '2025/01/30',
          },
        ];

      return null;
    });

    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(
        listaCards.mock.calls.some(
          ([props]) =>
            props.filters.periodoRealizacaoInicio === '2025/01/01' &&
            props.filters.periodoRealizacaoFim === '2025/01/30',
        ),
      ).toBe(true);
    });

    const props = listaCards.mock.calls.find(
      ([callProps]) =>
        callProps.filters.periodoRealizacaoInicio === '2025/01/01' &&
        callProps.filters.periodoRealizacaoFim === '2025/01/30',
    )?.[0];

    expect(props).toBeDefined();
    if (!props) return;

    expect(props.filters.periodoRealizacaoInicio).toBe(
      '2025/01/01',
    );

    expect(props.filters.periodoRealizacaoFim).toBe(
      '2025/01/30',
    );
  });

  it('deve montar filtros sem período', async () => {
    getFieldValue.mockReturnValue(undefined);

    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(listaCards).toHaveBeenCalled();
    });

    const props = listaCards.mock.calls[0][0];

    expect(props.filters.periodoRealizacaoInicio).toBeNull();
    expect(props.filters.periodoRealizacaoFim).toBeNull();
  });

  it('deve chamar resetFields quando perfil mudar', async () => {
    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(resetFields).toHaveBeenCalled();
    });
  });

  it('deve enviar carregando para ListaCards', async () => {
    render(<FiltroPaginaInicial />);

    await waitFor(() => {
      expect(listaCards).toHaveBeenCalled();
    });

    expect(listaCards.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        carregando: expect.any(Boolean),
        filters: expect.any(Object),
      }),
    );
  });
});