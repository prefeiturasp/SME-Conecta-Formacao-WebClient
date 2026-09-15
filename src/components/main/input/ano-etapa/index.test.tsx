/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectAnoEtapa from './index';
import { obterAnoEtapa } from '../../../../core/services/ano-etapa-service';

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

jest.mock('~/core/services/ano-etapa-service', () => ({
  obterAnoEtapa: jest.fn(),
}));

const obterAnoEtapaMock = obterAnoEtapa as jest.Mock;

const renderComponent = (props = {}, initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <SelectAnoEtapa {...props} />
    </Form>,
  );
};

describe('SelectAnoEtapa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o campo corretamente', () => {
    const { container } = renderComponent();

    expect(container.querySelector('label[for="anosTurmas"]')).toHaveTextContent('Ano/Etapa');
  });

  it('não busca dados quando não há modalidade selecionada', async () => {
    renderComponent();

    await waitFor(() => {
      expect(obterAnoEtapaMock).not.toHaveBeenCalled();
    });
  });

  it('busca dados quando já existe modalidade nos valores iniciais', async () => {
    obterAnoEtapaMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({}, { modalidade: 1 });

    await waitFor(() => {
      expect(obterAnoEtapaMock).toHaveBeenCalledWith(0, 1, true);
    });
  });

  it('busca dados quando modalidade é um array não vazio', async () => {
    obterAnoEtapaMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({}, { modalidade: [1, 2] });

    await waitFor(() => {
      expect(obterAnoEtapaMock).toHaveBeenCalledWith(0, [1, 2], true);
    });
  });

  it('repassa exibirOpcaoTodos=false para o serviço', async () => {
    obterAnoEtapaMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({ exibirOpcaoTodos: false }, { modalidade: 1 });

    await waitFor(() => {
      expect(obterAnoEtapaMock).toHaveBeenCalledWith(0, 1, false);
    });
  });

  it('não atualiza options quando a API falha', async () => {
    obterAnoEtapaMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { container } = renderComponent({}, { modalidade: 1 });

    await waitFor(() => {
      expect(obterAnoEtapaMock).toHaveBeenCalled();
    });

    expect(container.querySelectorAll('.ant-select-selection-item')).toHaveLength(0);
  });

  it('desabilita o campo quando desativarCampo=true', () => {
    const { container } = renderComponent({ desativarCampo: true });

    expect(container.querySelector('.ant-select-disabled')).toBeInTheDocument();
  });
});
