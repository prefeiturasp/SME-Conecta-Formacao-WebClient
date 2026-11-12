/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import { CampoSelectTurmaCodaf } from './index';

jest.mock('@ant-design/icons', () => ({
  QuestionCircleOutlined: () => <span data-testid='turma-tooltip-icon' />,
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Tooltip: ({
      title,
      open,
      children,
    }: {
      title: React.ReactNode;
      open?: boolean;
      children: React.ReactNode;
    }) => (
      <div data-testid='turma-tooltip' data-title={String(title)} data-open={String(!!open)}>
        {children}
      </div>
    ),
  };
});

describe('CampoSelectTurmaCodaf', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
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
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof CampoSelectTurmaCodaf>> = {}) => {
    const defaultProps: React.ComponentProps<typeof CampoSelectTurmaCodaf> = {
      turmas: [{ id: 1, descricao: 'Turma A' }],
      desabilitado: false,
      exibirAvisoCodafExistente: false,
      tooltipAberto: false,
      ...props,
    };

    return render(
      <Form>
        <CampoSelectTurmaCodaf {...defaultProps} />
      </Form>,
    );
  };

  it('não deve exibir o ícone de aviso quando exibirAvisoCodafExistente for false', () => {
    renderComponent({ exibirAvisoCodafExistente: false });

    expect(screen.queryByTestId('turma-tooltip-icon')).not.toBeInTheDocument();
  });

  it('deve exibir o ícone e tooltip com texto explicativo quando solicitado', () => {
    renderComponent({ exibirAvisoCodafExistente: true, tooltipAberto: true });

    expect(screen.getByTestId('turma-tooltip-icon')).toBeInTheDocument();
    const tooltip = screen.getByTestId('turma-tooltip');
    expect(tooltip).toHaveAttribute(
      'data-title',
      'Não é possível selecionar uma turma já inserida em um CODAF',
    );
    expect(tooltip).toHaveAttribute('data-open', 'true');
  });
});
