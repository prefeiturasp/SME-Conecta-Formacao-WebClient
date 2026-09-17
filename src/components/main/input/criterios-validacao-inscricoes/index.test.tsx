/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { MemoryRouter } from 'react-router-dom';
import SelectCriteriosValidacaoInscricoes from './index';
import { obterCriterioValidacaoInscricao } from '../../../../core/services/proposta-service';

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

jest.mock('~/core/services/proposta-service', () => ({
  obterCriterioValidacaoInscricao: jest.fn(),
}));

jest.mock('~/pages/cadastros/propostas/form/components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

const obterCriterioValidacaoInscricaoMock = obterCriterioValidacaoInscricao as jest.Mock;

const renderComponent = (initialValues = {}) => {
  return render(
    <MemoryRouter>
      <Form initialValues={initialValues}>
        <SelectCriteriosValidacaoInscricoes />
      </Form>
    </MemoryRouter>,
  );
};

describe('SelectCriteriosValidacaoInscricoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca as opções ao montar', async () => {
    obterCriterioValidacaoInscricaoMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterCriterioValidacaoInscricaoMock).toHaveBeenCalledWith(true);
    });
  });

  it('renderiza o campo corretamente', () => {
    const { container } = renderComponent();

    expect(
      container.querySelector('label[for="criteriosValidacaoInscricao"]'),
    ).toHaveTextContent('Critérios para validação das inscrições');
  });

  it('não exibe o campo Outros quando não há critério do tipo outros selecionado', async () => {
    obterCriterioValidacaoInscricaoMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, nome: 'Critério 1', unico: false, outros: false }],
    });

    const { queryByPlaceholderText } = renderComponent({ criteriosValidacaoInscricao: [1] });

    await waitFor(() => {
      expect(obterCriterioValidacaoInscricaoMock).toHaveBeenCalled();
    });

    expect(queryByPlaceholderText('Outros')).not.toBeInTheDocument();
  });

  it('exibe o campo Outros quando o critério selecionado é do tipo outros', async () => {
    obterCriterioValidacaoInscricaoMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 2, nome: 'Outros', unico: false, outros: true }],
    });

    const { findByPlaceholderText } = renderComponent({ criteriosValidacaoInscricao: [2] });

    expect(await findByPlaceholderText('Outros')).toBeInTheDocument();
  });

  it('não atualiza options quando a API falha', async () => {
    obterCriterioValidacaoInscricaoMock.mockResolvedValue({ sucesso: false, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterCriterioValidacaoInscricaoMock).toHaveBeenCalled();
    });
  });

  it('permite digitar no campo Outros', async () => {
    obterCriterioValidacaoInscricaoMock.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, nome: 'Critério 1', unico: false, outros: false },
        { id: 2, nome: 'Outros', unico: false, outros: true },
      ],
    });

    const { findByPlaceholderText } = renderComponent({
      criteriosValidacaoInscricao: [2],
    });

    const outrosInput = (await findByPlaceholderText('Outros')) as HTMLInputElement;
    fireEvent.change(outrosInput, { target: { value: 'texto qualquer' } });
    expect(outrosInput.value).toBe('texto qualquer');
  });
});
