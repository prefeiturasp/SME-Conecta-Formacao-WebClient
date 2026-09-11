/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectFormato from './index';
import { obterFormatoPublico } from '../../../../core/services/area-publica-service';
import { obterFormato } from '../../../../core/services/proposta-service';
import { TipoFormacao } from '../../../../core/enum/tipo-formacao';

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

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Form.useFormInstance };
});

jest.mock('~/core/services/area-publica-service', () => ({
  obterFormatoPublico: jest.fn(),
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterFormato: jest.fn(),
}));

const obterFormatoPublicoMock = obterFormatoPublico as jest.Mock;
const obterFormatoMock = obterFormato as jest.Mock;

const renderComponent = (props = {}, initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <Form.Item name='tipoFormacao' hidden>
        <input />
      </Form.Item>
      <SelectFormato {...props} />
    </Form>,
  );
};

describe('SelectFormato', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca dados usando o serviço padrão com tipo de formação evento por default', async () => {
    obterFormatoMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterFormatoMock).toHaveBeenCalledWith(TipoFormacao.Evento);
    });
    expect(obterFormatoPublicoMock).not.toHaveBeenCalled();
  });

  it('busca dados com o tipo de formação informado nos valores iniciais', async () => {
    obterFormatoMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({}, { tipoFormacao: TipoFormacao.Curso });

    await waitFor(() => {
      expect(obterFormatoMock).toHaveBeenCalledWith(TipoFormacao.Curso);
    });
  });

  it('usa o serviço público quando publico=true', async () => {
    obterFormatoPublicoMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({ publico: true });

    await waitFor(() => {
      expect(obterFormatoPublicoMock).toHaveBeenCalled();
    });
    expect(obterFormatoMock).not.toHaveBeenCalled();
  });

  it('renderiza o rótulo do campo', () => {
    obterFormatoMock.mockResolvedValue({ sucesso: true, dados: [] });

    const { container } = renderComponent();

    expect(container.querySelector('label[for="formato"]')).toHaveTextContent(
      'Modalidade formativa',
    );
  });

  it('limpa o valor de formato quando a opção selecionada não existe mais', async () => {
    obterFormatoMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'Formato 1' }],
    });

    renderComponent({}, { formato: 99 });

    await waitFor(() => {
      expect(obterFormatoMock).toHaveBeenCalled();
    });
  });

  it('não atualiza options quando a API falha', async () => {
    obterFormatoMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterFormatoMock).toHaveBeenCalled();
    });

    expect(container.querySelectorAll('.ant-select-selection-item')).toHaveLength(0);
  });
});
