/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import RadioFormacaoHomologada from './index';
import { obterFormacaoHomologada } from '../../../../core/services/proposta-service';

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
  obterFormacaoHomologada: jest.fn(),
}));

jest.mock('antd/es/tooltip', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Tooltip };
});

const obterFormacaoHomologadaMock = obterFormacaoHomologada as jest.Mock;

const renderComponent = (props = {}) => {
  return render(
    <Form>
      <RadioFormacaoHomologada {...props} />
    </Form>,
  );
};

describe('RadioFormacaoHomologada', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca as opções ao montar', async () => {
    obterFormacaoHomologadaMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterFormacaoHomologadaMock).toHaveBeenCalled();
    });
  });

  it('renderiza o rótulo padrão', () => {
    const { container } = renderComponent();

    expect(container.querySelector('label[for="formacaoHomologada"]')).toHaveTextContent(
      'Formação homologada',
    );
  });

  it('renderiza o rótulo e nome customizados', () => {
    const { container } = renderComponent({ name: 'outroCampo', label: 'Outro rótulo' });

    expect(container.querySelector('label[for="outroCampo"]')).toHaveTextContent('Outro rótulo');
  });

  it('renderiza as opções retornadas pelo serviço', async () => {
    obterFormacaoHomologadaMock.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, descricao: 'Sim' },
        { id: 2, descricao: 'Não' },
      ],
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Sim')).toBeInTheDocument();
      expect(getByText('Não')).toBeInTheDocument();
    });
  });

  it('não atualiza options quando a API falha', async () => {
    obterFormacaoHomologadaMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterFormacaoHomologadaMock).toHaveBeenCalled();
    });

    expect(container.querySelectorAll('.ant-radio-button-wrapper')).toHaveLength(0);
  });
});
