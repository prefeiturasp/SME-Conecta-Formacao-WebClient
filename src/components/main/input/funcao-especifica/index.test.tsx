/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import SelectFuncaoEspecifica from './index';
import { obterFuncaoEspecifica } from '../../../../core/services/cargo-funcao-service';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

jest.mock('~/core/services/cargo-funcao-service', () => ({
  obterFuncaoEspecifica: jest.fn(),
}));

jest.mock('~/pages/cadastros/propostas/form/components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

const obterFuncaoEspecificaMock = obterFuncaoEspecifica as jest.Mock;

const existeValoresSelecionados = jest.fn();
const definiOutrosCamposComoRequerido = jest.fn();

const renderComponent = (initialValues = {}, props = {}) => {
  return render(
    <MemoryRouter>
      <Form initialValues={initialValues}>
        <SelectFuncaoEspecifica
          existeValoresSelecionados={existeValoresSelecionados}
          definiOutrosCamposComoRequerido={definiOutrosCamposComoRequerido}
          {...props}
        />
      </Form>
    </MemoryRouter>,
  );
};

describe('SelectFuncaoEspecifica', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca as opções ao montar', async () => {
    obterFuncaoEspecificaMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterFuncaoEspecificaMock).toHaveBeenCalledWith(true);
    });
  });

  it('renderiza o campo corretamente', () => {
    const { container } = renderComponent();

    expect(container.querySelector('label[for="funcoesEspecificas"]')).toHaveTextContent(
      'Função específica',
    );
  });

  it('não exibe o campo Outros quando não há função específica do tipo outros selecionada', async () => {
    obterFuncaoEspecificaMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, nome: 'Função 1', outros: false }],
    });

    const { queryByPlaceholderText } = renderComponent({ funcoesEspecificas: [1] });

    await waitFor(() => {
      expect(obterFuncaoEspecificaMock).toHaveBeenCalled();
    });

    expect(queryByPlaceholderText('Outros')).not.toBeInTheDocument();
  });

  it('exibe o campo Outros quando a função selecionada é do tipo outros', async () => {
    obterFuncaoEspecificaMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 2, nome: 'Outros', outros: true }],
    });

    const { findByPlaceholderText } = renderComponent({ funcoesEspecificas: [2] });

    expect(await findByPlaceholderText('Outros')).toBeInTheDocument();
  });

  it('não atualiza options quando a API falha', async () => {
    obterFuncaoEspecificaMock.mockResolvedValue({ sucesso: false, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterFuncaoEspecificaMock).toHaveBeenCalled();
    });
  });

  it('chama existeValoresSelecionados e definiOutrosCamposComoRequerido ao selecionar um valor', async () => {
    obterFuncaoEspecificaMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, nome: 'Função 1', outros: false }],
    });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterFuncaoEspecificaMock).toHaveBeenCalled();
    });

    const select = container.querySelector('.ant-select-selector') as HTMLElement;
    fireEvent.mouseDown(select);

    const option = await waitFor(() => document.querySelector('.ant-select-item-option'));
    fireEvent.click(option as HTMLElement);

    await waitFor(() => {
      expect(existeValoresSelecionados).toHaveBeenCalledWith(true);
      expect(definiOutrosCamposComoRequerido).toHaveBeenCalledWith(false);
    });
  });
});
