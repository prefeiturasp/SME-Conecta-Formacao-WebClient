/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import RadioInput from './index';

describe('RadioInput', () => {
  const options = [
    {
      label: 'Masculino',
      value: 'M',
    },
    {
      label: 'Feminino',
      value: 'F',
    },
    {
      label: 'Outro',
      value: 'O',
    },
  ];

  it('deve renderizar todas as opções', () => {
    render(<RadioInput options={options} />);

    expect(screen.getByText('Masculino')).toBeInTheDocument();
    expect(screen.getByText('Feminino')).toBeInTheDocument();
    expect(screen.getByText('Outro')).toBeInTheDocument();
  });

  it('deve marcar a opção informada em value', () => {
    render(
      <RadioInput
        options={options}
        value="F"
      />
    );

    expect(screen.getByRole('radio', { name: 'Feminino' })).toBeChecked();

    expect(screen.getByRole('radio', { name: 'Masculino' })).not.toBeChecked();

    expect(screen.getByRole('radio', { name: 'Outro' })).not.toBeChecked();
  });

  it('deve chamar onChange ao selecionar outra opção', () => {
    const onChange = jest.fn();

    render(
      <RadioInput
        options={options}
        onChange={onChange}
      />
    );

    fireEvent.click(
      screen.getByRole('radio', {
        name: 'Masculino',
      })
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('M');
  });

  it('não deve lançar erro quando onChange não for informado', () => {
    render(<RadioInput options={options} />);

    expect(() => {
      fireEvent.click(
        screen.getByRole('radio', {
          name: 'Outro',
        })
      );
    }).not.toThrow();
  });

  it('deve alterar a seleção quando value mudar', () => {
    const { rerender } = render(
      <RadioInput
        options={options}
        value="M"
      />
    );

    expect(screen.getByRole('radio', { name: 'Masculino' })).toBeChecked();

    rerender(
      <RadioInput
        options={options}
        value="O"
      />
    );

    expect(screen.getByRole('radio', { name: 'Outro' })).toBeChecked();

    expect(screen.getByRole('radio', { name: 'Masculino' })).not.toBeChecked();
  });

  it('deve renderizar sem opções', () => {
    render(<RadioInput options={[]} />);

    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });
});