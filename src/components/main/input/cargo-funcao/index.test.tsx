
/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SelectCargoFuncao from './index';
import { obterCargosFuncoes } from '../../../../core/services/cargo-funcao-service';

jest.mock('~/core/services/cargo-funcao-service');

const selectMock = jest.fn();

jest.mock('~/components/lib/inputs/select', () => (props: any) => {
  selectMock(props);
  return <div data-testid="select-cargo-funcao" />;
});

jest.mock('antd', () => ({
  Form: {
    Item: ({ children }: any) => <div>{children}</div>,
  },
}));

const obterCargosFuncoesMock =
  obterCargosFuncoes as jest.MockedFunction<typeof obterCargosFuncoes>;

describe('SelectCargoFuncao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o select', () => {
    obterCargosFuncoesMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);

    render(<SelectCargoFuncao />);

    expect(screen.getByTestId('select-cargo-funcao')).toBeInTheDocument();
  });

  it('deve carregar opções quando serviço retornar sucesso', async () => {
    obterCargosFuncoesMock.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, nome: 'Professor' },
        { id: 2, nome: 'Coordenador' },
      ],
    } as any);

    render(<SelectCargoFuncao />);

    await waitFor(() => {
      expect(selectMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: [
            { label: 'Professor', value: 1 },
            { label: 'Coordenador', value: 2 },
          ],
        }),
      );
    });
  });

  it('deve enviar lista vazia quando serviço retornar erro', async () => {
    obterCargosFuncoesMock.mockResolvedValue({
      sucesso: false,
      dados: [],
    } as any);

    render(<SelectCargoFuncao />);

    await waitFor(() => {
      expect(selectMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          options: [],
        }),
      );
    });
  });

  it('deve repassar selectProps', () => {
    obterCargosFuncoesMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);

    const onChange = jest.fn();

    render(
      <SelectCargoFuncao
        selectProps={{
          disabled: true,
          onChange,
        }}
      />,
    );

    expect(selectMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        onChange,
      }),
    );
  });

  it('deve aceitar formItemProps', () => {
    obterCargosFuncoesMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);

    render(
      <SelectCargoFuncao
        formItemProps={{
          name: 'teste',
          label: 'Meu Label',
        }}
      />,
    );

    expect(screen.getByTestId('select-cargo-funcao')).toBeInTheDocument();
  });
});