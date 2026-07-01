/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { Form } from 'antd';
import { render, screen } from '@testing-library/react';
import { getTooltipFormInfoCircleFilled } from '../../../../../../components/main/tooltip';
import SelectTipoEmissor from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock(
  '~/components/main/tooltip',
  () => ({
    getTooltipFormInfoCircleFilled: jest.fn(() => (
      <span data-testid="tooltip" />
    )),
  }),
);

jest.mock(
  '~/components/lib/inputs/select',
  () => (props: any) => (
    <div
      data-testid="select"
      data-disabled={props.disabled}
      data-placeholder={props.placeholder}
      data-id={props.id}
      data-options={JSON.stringify(props.options)}
    />
  ),
);

jest.mock('~/components/main/tooltip', () => ({
  getTooltipFormInfoCircleFilled: jest.fn(() => 'tooltip'),
}));

const renderComponent = (props = {}) =>
  render(
    <Form>
      <SelectTipoEmissor {...props} />
    </Form>,
  );

describe('SelectTipoEmissor', () => {
  const getLabel = () =>
    screen.getByText(/Tipo do emissor/i);

 it('deve renderizar corretamente', () => {
  renderComponent();

  expect(getLabel()).toBeInTheDocument();

  expect(
    screen.getByTestId('select'),
  ).toBeInTheDocument();

  expect(getTooltipFormInfoCircleFilled).toHaveBeenCalled();
});

  it('deve deixar o campo obrigatório', () => {
    renderComponent({
      campoRequerido: true,
    });

    expect(
      getLabel(),
    ).toHaveClass('ant-form-item-required');
  });

  it('deve desabilitar o select', () => {
    renderComponent({
      desativarCampo: true,
    });

    expect(
      screen.getByTestId('select'),
    ).toHaveAttribute(
      'data-disabled',
      'true',
    );
  });

  it('deve possuir placeholder', () => {
    renderComponent();

    expect(
      screen.getByTestId('select'),
    ).toHaveAttribute(
      'data-placeholder',
      'Selecione',
    );
  });

  it('deve possuir id do componente', () => {
    renderComponent();

    const select = screen.getByTestId('select');

    expect(select).toHaveAttribute('data-id');
    expect(select.getAttribute('data-id')).not.toBe('');
  });

  it('deve gerar as opções do enum', () => {
    renderComponent();

    const options = JSON.parse(
      screen
        .getByTestId('select')
        .getAttribute('data-options')!,
    );

    // basic checks: options should be an array with items having label and value
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt: any) => {
      expect(opt).toHaveProperty('label');
      expect(opt).toHaveProperty('value');
    });
  });

  it('não deve desabilitar por padrão', () => {
    renderComponent();

    expect(
      screen.getByTestId('select'),
    ).toHaveAttribute(
      'data-disabled',
      'false',
    );
  });

  it('não deve tornar obrigatório por padrão', () => {
    renderComponent();

    expect(
      getLabel(),
    ).not.toHaveClass(
      'ant-form-item-required',
    );
  });
});