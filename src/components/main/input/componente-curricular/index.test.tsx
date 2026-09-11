/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectComponenteCurricular from './index';
import { obterComponenteCurricular } from '../../../../core/services/componentes-curriculares-service';

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

jest.mock('~/core/services/componentes-curriculares-service', () => ({
  obterComponenteCurricular: jest.fn(),
}));

const obterComponenteCurricularMock = obterComponenteCurricular as jest.Mock;

const renderComponent = (props = {}, initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <Form.Item name='anosTurmas' hidden>
        <input />
      </Form.Item>
      <SelectComponenteCurricular {...props} />
    </Form>,
  );
};

describe('SelectComponenteCurricular', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o campo corretamente', () => {
    const { container } = renderComponent();

    expect(container.querySelector('label[for="componentesCurriculares"]')).toHaveTextContent(
      'Componente Curricular',
    );
  });

  it('não busca dados quando não há anosTurmas selecionados', async () => {
    renderComponent();

    await waitFor(() => {
      expect(obterComponenteCurricularMock).not.toHaveBeenCalled();
    });
  });

  it('busca dados quando já existem anosTurmas nos valores iniciais', async () => {
    obterComponenteCurricularMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({}, { anosTurmas: [1, 2] });

    await waitFor(() => {
      expect(obterComponenteCurricularMock).toHaveBeenCalledWith([1, 2], true);
    });
  });

  it('repassa exibirOpcaoTodos=false para o serviço', async () => {
    obterComponenteCurricularMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent({ exibirOpcaoTodos: false }, { anosTurmas: [1] });

    await waitFor(() => {
      expect(obterComponenteCurricularMock).toHaveBeenCalledWith([1], false);
    });
  });

  it('não atualiza options quando a API falha', async () => {
    obterComponenteCurricularMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { container } = renderComponent({}, { anosTurmas: [1] });

    await waitFor(() => {
      expect(obterComponenteCurricularMock).toHaveBeenCalled();
    });

    expect(container.querySelectorAll('.ant-select-selection-item')).toHaveLength(0);
  });

  it('desabilita o campo quando desativarCampo=true', () => {
    const { container } = renderComponent({ desativarCampo: true });

    expect(container.querySelector('.ant-select-disabled')).toBeInTheDocument();
  });
});
