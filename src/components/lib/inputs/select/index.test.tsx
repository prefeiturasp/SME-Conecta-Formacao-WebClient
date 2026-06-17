/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Select from './index';

const selectMock = jest.fn();

jest.mock('antd', () => {
  const Select = (props: any) => {
    selectMock(props);

    return <div data-testid="select" />;
  };

  const Empty = (props: any) => (
    <div
      data-testid="empty"
      {...props}
    />
  );

  Empty.PRESENTED_IMAGE_SIMPLE = 'simple-image';

  return {
    Select,
    Empty,
  };
});

describe('Select', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o Select', () => {
    render(<Select />);

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('deve habilitar allowClear', () => {
    render(<Select />);

    expect(selectMock.mock.calls[0][0].allowClear).toBe(true);
  });

  it('deve habilitar showSearch', () => {
    render(<Select />);

    expect(selectMock.mock.calls[0][0].showSearch).toBe(true);
  });

  it('deve repassar propriedades recebidas', () => {
    const onChange = jest.fn();

    render(
      <Select
        disabled
        mode="multiple"
        onChange={onChange}
      />
    );

    const props = selectMock.mock.calls[0][0];

    expect(props.disabled).toBe(true);
    expect(props.mode).toBe('multiple');
    expect(props.onChange).toBe(onChange);
  });

  it('deve configurar getPopupContainer', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    const parent = document.createElement('div');
    const child = document.createElement('span');

    parent.appendChild(child);

    expect(props.getPopupContainer(child)).toBe(parent);
  });

it('deve configurar notFoundContent', () => {
  render(<Select />);

  expect(selectMock.mock.calls[0][0].notFoundContent).toBeDefined();
});

  it('deve localizar pelo value', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    expect(
      props.filterOption('123', {
        value: '12345',
        label: 'Descrição',
      })
    ).toBe(true);
  });

  it('deve localizar pela descrição', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    expect(
      props.filterOption('descr', {
        value: '999',
        label: 'Descrição',
      })
    ).toBe(true);
  });

  it('não deve localizar quando não existir', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    expect(
      props.filterOption('abc', {
        value: '999',
        label: 'Teste',
      })
    ).toBe(false);
  });

  it('deve ignorar value e label indefinidos', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    expect(
      props.filterOption('abc', {})
    ).toBe(false);
  });

  it('deve ignorar diferenças entre maiúsculas e minúsculas', () => {
    render(<Select />);

    const props = selectMock.mock.calls[0][0];

    expect(
      props.filterOption('ABC', {
        value: 'abc123',
        label: 'Descrição',
      })
    ).toBe(true);

    expect(
      props.filterOption('DESCRI', {
        value: '1',
        label: 'descrição',
      })
    ).toBe(true);
  });
});