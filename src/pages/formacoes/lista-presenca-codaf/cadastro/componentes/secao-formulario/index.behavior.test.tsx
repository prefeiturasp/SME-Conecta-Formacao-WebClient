/** @jest-environment jsdom */

import React from 'react';
import { Form } from 'antd';
import { render, screen } from '@testing-library/react';
import { describe, expect, jest, test } from '@jest/globals';
import { SecaoFormulario } from './index';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

jest.mock('~/components/main/numero', () => ({
  __esModule: true,
  default: ({ formItemProps }: { formItemProps?: { label?: React.ReactNode } }) => (
    <div data-testid='input-numero'>{formItemProps?.label}</div>
  ),
}));

jest.mock('~/components/main/text/input-text', () => ({
  __esModule: true,
  default: ({ formItemProps }: { formItemProps?: { label?: React.ReactNode } }) => (
    <div data-testid='input-text'>{formItemProps?.label}</div>
  ),
}));

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@ant-design/icons', () => ({
  QuestionCircleOutlined: () => <span data-testid='turma-tooltip-icon' />,
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('SecaoFormulario behavior', () => {
  const opcoesFormacao: PropostaAutocompletarDTO[] = [
    {
      numeroHomologacao: 123,
      nomeFormacao: 'Formação teste',
      propostaId: 1,
    } as PropostaAutocompletarDTO,
  ];

  const turmasFiltradas: RetornoListagemDTO[] = [{ id: 10, descricao: 'Turma A' }];

  const renderComponent = (props?: Partial<React.ComponentProps<typeof SecaoFormulario>>) =>
    render(
      <Form>
        <SecaoFormulario
          opcoesFormacao={opcoesFormacao}
          onSearchFormacao={jest.fn()}
          onSelectFormacao={jest.fn().mockResolvedValue(undefined)}
          loadingAutocomplete={false}
          turmasFiltradas={turmasFiltradas}
          turmaDisabled={false}
          tooltipAberto={false}
          ehPerfilDF={false}
          ehPerfilEMFORPEF={false}
          camposBloqueados={{ numeroHomologacao: false, turma: false }}
          {...props}
        />
      </Form>,
    );

  test('mostra o ícone de tooltip por padrão', () => {
    renderComponent();

    expect(screen.getByText('Turma')).not.toBeNull();
    expect(screen.getByTestId('turma-tooltip-icon')).not.toBeNull();
  });

  test('não mostra o ícone de tooltip quando exibirTooltipTurma é false', () => {
    renderComponent({ exibirTooltipTurma: false });

    expect(screen.getByText('Turma')).not.toBeNull();
    expect(screen.queryByTestId('turma-tooltip-icon')).toBeNull();
  });
});
