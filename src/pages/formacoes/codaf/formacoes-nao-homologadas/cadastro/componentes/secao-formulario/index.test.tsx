/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import { SecaoFormulario } from './index';

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

describe('SecaoFormulario - Formações Não Homologadas', () => {
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

  const renderComponent = (props: Partial<React.ComponentProps<typeof SecaoFormulario>> = {}) => {
    const defaultProps: React.ComponentProps<typeof SecaoFormulario> = {
      onChangeCodigoFormacao: jest.fn(),
      onBlurCodigoFormacao: jest.fn(),
      turmasFiltradas: [{ id: 1, descricao: 'Turma 1' }],
      turmaDisabled: false,
      tooltipAberto: false,
      exibirTooltipTurma: false,
      camposBloqueados: {
        numeroHomologacao: false,
        codigoFormacao: false,
        turma: false,
      },
      ...props,
    };

    return render(
      <Form>
        <SecaoFormulario {...defaultProps} />
      </Form>,
    );
  };

  it('não deve exibir ícone de tooltip quando exibirTooltipTurma for false', () => {
    renderComponent({ exibirTooltipTurma: false });

    expect(screen.queryByTestId('turma-tooltip-icon')).not.toBeInTheDocument();
  });

  it('deve exibir ícone de tooltip e mensagem quando exibirTooltipTurma e tooltipAberto forem true', () => {
    renderComponent({ exibirTooltipTurma: true, tooltipAberto: true });

    expect(screen.getByTestId('turma-tooltip-icon')).toBeInTheDocument();
    const tooltip = screen.getByTestId('turma-tooltip');
    expect(tooltip).toHaveAttribute(
      'data-title',
      'Não é possível selecionar uma turma já inserida em um CODAF',
    );
    expect(tooltip).toHaveAttribute('data-open', 'true');
  });
});
