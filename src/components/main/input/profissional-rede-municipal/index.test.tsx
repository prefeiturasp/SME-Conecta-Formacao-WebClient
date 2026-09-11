/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { Form } from 'antd';
import RadioSimNao from './index';

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

const renderComponent = (formItemProps = { name: 'profissionalRedeMunicipal' }, radioGroupProps = {}) => {
  return render(
    <Form>
      <RadioSimNao formItemProps={formItemProps} radioGroupProps={radioGroupProps} />
    </Form>,
  );
};

describe('RadioSimNao', () => {
  it('renderiza as opções Sim e Não', () => {
    const { getByText } = renderComponent();

    expect(getByText('Sim')).toBeInTheDocument();
    expect(getByText('Não')).toBeInTheDocument();
  });

  it('renderiza o rótulo informado via formItemProps', () => {
    const { container } = renderComponent({
      name: 'profissionalRedeMunicipal',
      label: 'Profissional da rede municipal'
    });

    expect(
      container.querySelector('label[for="profissionalRedeMunicipal"]'),
    ).toHaveTextContent('Profissional da rede municipal');
  });

  it('seleciona a opção Sim ao clicar', () => {
    const { getByLabelText } = renderComponent();

    const radioSim = getByLabelText('Sim') as HTMLInputElement;
    fireEvent.click(radioSim);

    expect(radioSim.checked).toBe(true);
  });

  it('repassa propriedades adicionais para o RadioGroup', () => {
    const { getByLabelText } = renderComponent(
      { name: 'profissionalRedeMunicipal' },
      { disabled: true },
    );

    expect((getByLabelText('Sim') as HTMLInputElement).disabled).toBe(true);
  });
});
