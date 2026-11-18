/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import RadioTipoFormacao from './index';
import { obterTipoFormacao } from '~/core/services/proposta-service';
import { CF_RADIO_TIPO_FORMACAO } from '~/core/constants/ids/radio';
import { TipoFormacao } from '~/core/enum/tipo-formacao';

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
  obterTipoFormacao: jest.fn(),
}));

const obterTipoFormacaoMock = obterTipoFormacao as jest.Mock;

const renderComponent = () => {
  return render(
    <Form>
      <RadioTipoFormacao />
    </Form>,
  );
};

describe('RadioTipoFormacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar os tipos de formação ao montar o componente', async () => {
    obterTipoFormacaoMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterTipoFormacaoMock).toHaveBeenCalledTimes(1);
    });
  });

  it('deve renderizar o rótulo do campo corretamente', async () => {
    obterTipoFormacaoMock.mockResolvedValue({ sucesso: true, dados: [] });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(container.querySelector('label[for="tipoFormacao"]')).toHaveTextContent(
        'Tipo de formação',
      );
    });
  });

  it('deve renderizar as opções retornadas pela API incluindo o novo tipo Conferência', async () => {
    obterTipoFormacaoMock.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: TipoFormacao.Curso, descricao: 'Curso' },
        { id: TipoFormacao.Evento, descricao: 'Evento' },
        { id: TipoFormacao.Conferencia, descricao: 'Conferência' },
      ],
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Curso')).toBeInTheDocument();
      expect(getByText('Evento')).toBeInTheDocument();
      expect(getByText('Conferência')).toBeInTheDocument();
    });
  });

  it('deve renderizar o grupo de radio com o ID correto', async () => {
    obterTipoFormacaoMock.mockResolvedValue({ sucesso: true, dados: [] });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(container.querySelector(`#${CF_RADIO_TIPO_FORMACAO}`)).toBeInTheDocument();
    });
  });

  it('não deve definir opções quando a API retornar sucesso falso', async () => {
    obterTipoFormacaoMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterTipoFormacaoMock).toHaveBeenCalled();
    });

    expect(container.querySelectorAll('.ant-radio-wrapper')).toHaveLength(0);
  });
});
