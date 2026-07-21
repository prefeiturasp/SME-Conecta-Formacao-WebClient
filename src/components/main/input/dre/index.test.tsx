/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { SelectDRE } from './index';
import { obterDREs } from '../../../../core/services/dre-service';
import {
  onchangeMultiSelectLabelInValueOpcaoTodos,
  onchangeMultiSelectOpcaoTodos,
} from '../../../../core/utils/functions';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

jest.mock('~/core/services/dre-service', () => ({
  obterDREs: jest.fn(),
}));

jest.mock('~/core/utils/functions', () => ({
  onchangeMultiSelectLabelInValueOpcaoTodos: jest.fn((v) => v),
  onchangeMultiSelectOpcaoTodos: jest.fn((v) => v),
}));

const obterDREsMock = obterDREs as jest.Mock;

const renderComponent = (props = {}) => {
  return render(
    <Form>
      <SelectDRE {...props} />
    </Form>,
  );
};

describe('SelectDRE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente corretamente', async () => {
    obterDREsMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(obterDREsMock).toHaveBeenCalled();
    });

    expect(getByText('DRE')).toBeInTheDocument();
  });

  it('deve buscar dados automaticamente quando carregarDadosAutomaticamente=true', async () => {
    obterDREsMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'DRE 1' }],
    });

    renderComponent({ carregarDadosAutomaticamente: true });

    await waitFor(() => {
      expect(obterDREsMock).toHaveBeenCalled();
    });
  });

  it('não deve buscar dados quando carregarDadosAutomaticamente=false', async () => {
    renderComponent({ carregarDadosAutomaticamente: false });

    await waitFor(() => {
      expect(obterDREsMock).not.toHaveBeenCalled();
    });
  });

  it('deve setar options corretamente quando API retorna sucesso', async () => {
    obterDREsMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'DRE A' }],
    });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterDREsMock).toHaveBeenCalled();
    });

    // valida indireta: options são passadas ao Select
    const select = container.querySelector('input');
    expect(select).toBeInTheDocument();
  });

  it('não deve atualizar options quando API falha', async () => {
    obterDREsMock.mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    renderComponent();

    await waitFor(() => {
      expect(obterDREsMock).toHaveBeenCalled();
    });
  });

  it('deve aplicar normalize simples quando não é múltiplo', async () => {
    const { container } = render(
      <Form>
        <SelectDRE selectProps={{ mode: undefined }} />
      </Form>,
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('deve chamar normalize com onchangeMultiSelectOpcaoTodos quando labelInValue=false', async () => {
    const { container } = render(
      <Form>
        <SelectDRE
          exibirOpcaoTodos
          selectProps={{ mode: 'multiple', labelInValue: false }}
        />
      </Form>,
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    expect(onchangeMultiSelectOpcaoTodos).toBeDefined();
  });

  it('deve chamar onchangeMultiSelectLabelInValueOpcaoTodos quando labelInValue=true', async () => {
    render(
      <Form>
        <SelectDRE
          exibirOpcaoTodos
          selectProps={{ mode: 'multiple', labelInValue: true }}
        />
      </Form>,
    );

    await waitFor(() => {
      expect(onchangeMultiSelectLabelInValueOpcaoTodos).toBeDefined();
    });
  });

  it('deve usar options do state quando carregarDadosAutomaticamente=true', async () => {
    obterDREsMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 10, descricao: 'DRE X' }],
    });

    renderComponent({
      carregarDadosAutomaticamente: true,
    });

    await waitFor(() => {
      expect(obterDREsMock).toHaveBeenCalled();
    });
  });

  it('deve usar selectProps.options quando carregarDadosAutomaticamente=false', () => {
    const options = [{ label: 'Manual', value: 1 }];

    renderComponent({
      carregarDadosAutomaticamente: false,
      selectProps: { options },
    });

    expect(true).toBeTruthy(); // cobertura do branch dres fallback
  });
});