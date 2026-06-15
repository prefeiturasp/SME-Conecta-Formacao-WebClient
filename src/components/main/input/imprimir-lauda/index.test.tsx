/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { RadioRelatorioLauda } from './index';
import { CF_RADIO_SIM_NAO } from '../../../../core/constants/ids/radio';

const radioMock = jest.fn();

jest.mock('../../radio', () => ({
  __esModule: true,
  default: (props: any) => {
    radioMock(props);

    return <div data-testid="radio" />;
  },
}));

describe('RadioRelatorioLauda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente Radio', () => {
    render(
      <RadioRelatorioLauda
        formItemProps={{
          name: 'relatorio',
        }}
      />
    );

    expect(screen.getByTestId('radio')).toBeInTheDocument();
  });

  it('deve repassar formItemProps', () => {
    const formItemProps = {
      name: 'relatorio',
      label: 'Relatório',
      required: true,
    };

    render(
      <RadioRelatorioLauda
        formItemProps={formItemProps}
      />
    );

   const props = radioMock.mock.calls[0][0];

expect(props.formItemProps).toEqual(formItemProps);
  });

  it('deve configurar o id padrão', () => {
    render(
      <RadioRelatorioLauda
        formItemProps={{}}
      />
    );

    const props = radioMock.mock.calls[0][0];

    expect(props.radioGroupProps.id).toBe(CF_RADIO_SIM_NAO);
  });

  it('deve configurar as opções padrão', () => {
    render(
      <RadioRelatorioLauda
        formItemProps={{}}
      />
    );

    const props = radioMock.mock.calls[0][0];

    expect(props.radioGroupProps.options).toEqual([
      {
        label: 'Lauda de publicação',
        value: true,
      },
      {
        label: 'Lauda completa',
        value: false,
      },
    ]);
  });

  it('deve mesclar radioGroupProps recebidas', () => {
    const onChange = jest.fn();

    render(
      <RadioRelatorioLauda
        formItemProps={{}}
        radioGroupProps={{
          disabled: true,
          onChange,
        }}
      />
    );

    const props = radioMock.mock.calls[0][0];

    expect(props.radioGroupProps.disabled).toBe(true);
    expect(props.radioGroupProps.onChange).toBe(onChange);
    expect(props.radioGroupProps.id).toBe(CF_RADIO_SIM_NAO);
  });

  it('deve sobrescrever options recebidas pelas opções padrão', () => {
    render(
      <RadioRelatorioLauda
        formItemProps={{}}
        radioGroupProps={{
          options: [
            {
              label: 'Teste',
              value: '1',
            },
          ],
        }}
      />
    );

    const props = radioMock.mock.calls[0][0];

    expect(props.radioGroupProps.options).toEqual([
      {
        label: 'Lauda de publicação',
        value: true,
      },
      {
        label: 'Lauda completa',
        value: false,
      },
    ]);
  });
});