/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectTodasTurmas from './index';
import { obterTurmasDaProposta } from '../../../../core/services/proposta-service';

jest.mock('~/core/services/proposta-service', () => ({
  obterTurmasDaProposta: jest.fn(),
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  const TreeSelectMock = ({
    treeData,
    onChange,
    value,
  }: {
    treeData: { value?: number; title?: React.ReactNode; label?: React.ReactNode }[];
    onChange: (value: number[]) => void;
    value: number[];
  }) => (
    <div>
      {treeData.map((node, index) =>
        node.value === undefined ? (
          <div key={`header-${index}`}>{node.title}</div>
        ) : (
          <label key={node.value}>
            {node.title ?? node.label}
            <input
              type='checkbox'
              checked={value?.includes(node.value)}
              onChange={() => {
                const checked = value?.includes(node.value as number);
                const newValue = checked
                  ? value.filter((v) => v !== node.value)
                  : [...(value ?? []), node.value as number];
                onChange(newValue);
              }}
            />
          </label>
        ),
      )}
    </div>
  );
  TreeSelectMock.SHOW_CHILD = actual.TreeSelect.SHOW_CHILD;
  return { ...actual, TreeSelect: TreeSelectMock };
});

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

const mockedObterTurmasDaProposta = obterTurmasDaProposta as jest.Mock;

const renderComponent = (onChange = jest.fn(), initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <SelectTodasTurmas idProposta={1} onChange={onChange} />
    </Form>,
  );
};

describe('SelectTodasTurmas', () => {
  beforeEach(() => {
    mockedObterTurmasDaProposta.mockReset();
  });

  it('busca as turmas ao montar', async () => {
    mockedObterTurmasDaProposta.mockResolvedValue({ sucesso: true, dados: [] });
    renderComponent();
    await waitFor(() => expect(mockedObterTurmasDaProposta).toHaveBeenCalledWith(1));
  });

  it('renderiza o rótulo "Turma"', () => {
    mockedObterTurmasDaProposta.mockResolvedValue({ sucesso: true, dados: [] });
    const { container } = renderComponent();
    expect(container.querySelector('label[for="turmas"]')).toHaveTextContent('Turma');
  });

  it('renderiza as turmas retornadas pelo serviço', async () => {
    mockedObterTurmasDaProposta.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'Turma A' }],
    });
    const { findByText } = renderComponent();
    expect(await findByText('Turma A')).toBeInTheDocument();
  });

  it('não renderiza turmas quando o serviço falha', async () => {
    mockedObterTurmasDaProposta.mockResolvedValue({ sucesso: false, dados: [] });
    const { container, queryByText } = renderComponent();
    await waitFor(() => expect(mockedObterTurmasDaProposta).toHaveBeenCalledTimes(1));
    expect(queryByText('Turma A')).not.toBeInTheDocument();
    expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });

  it('seleciona todas as turmas ao clicar em "Selecionar todas"', async () => {
    mockedObterTurmasDaProposta.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, descricao: 'Turma A' },
        { id: 2, descricao: 'Turma B' },
      ],
    });
    const onChange = jest.fn();
    const { findByText, getByText } = renderComponent(onChange);
    await findByText('Turma A');
    getByText('Selecionar todas').click();
    await waitFor(() => expect(getByText('Remover todas')).toBeInTheDocument());
    expect(onChange).toHaveBeenCalled();
  });

  it('remove todas as turmas ao clicar em "Remover todas"', async () => {
    mockedObterTurmasDaProposta.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, descricao: 'Turma A' }],
    });
    const onChange = jest.fn();
    const { findByText, getByText } = renderComponent(onChange, { turmas: [1] });
    await findByText('Turma A');
    expect(getByText('Remover todas')).toBeInTheDocument();
    getByText('Remover todas').click();
    await waitFor(() => expect(getByText('Selecionar todas')).toBeInTheDocument());
    expect(onChange).toHaveBeenCalled();
  });
});
