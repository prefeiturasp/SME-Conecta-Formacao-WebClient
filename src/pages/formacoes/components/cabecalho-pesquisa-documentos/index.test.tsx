/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import CabecalhoPesquisaDocumentos from './index';
import { CF_BUTTON_VOLTAR } from '../../../../core/constants/ids/button/intex';
import { ROUTES } from '../../../../core/enum/routes-enum';

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

describe('CabecalhoPesquisaDocumentos', () => {
  const onDownload = jest.fn();
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = (props: Partial<React.ComponentProps<typeof CabecalhoPesquisaDocumentos>> = {}) =>
    render(
      <MemoryRouter>
        <CabecalhoPesquisaDocumentos
          actionLabel='Baixar documentos'
          emptySelectionMessage='Selecione ao menos um item'
          navigate={navigate}
          onDownload={onDownload}
          selectedCount={0}
          title='Pesquisa de documentos'
          {...props}
        />
      </MemoryRouter>,
    );

  it('exibe o título informado', () => {
    renderizar({ title: 'Pesquisa de documentos' });

    expect(screen.getByText('Pesquisa de documentos')).toBeInTheDocument();
  });

  it('exibe o texto do botão de ação', () => {
    renderizar({ actionLabel: 'Baixar documentos' });

    expect(screen.getByRole('button', { name: 'Baixar documentos' })).toBeInTheDocument();
  });

  it('desabilita o botão de ação quando nenhum item está selecionado', () => {
    renderizar({ selectedCount: 0 });

    expect(screen.getByRole('button', { name: 'Baixar documentos' })).toBeDisabled();
  });

  it('habilita o botão de ação quando há itens selecionados', () => {
    renderizar({ selectedCount: 2 });

    expect(screen.getByRole('button', { name: 'Baixar documentos' })).toBeEnabled();
  });

  it('chama onDownload ao clicar no botão de ação com itens selecionados', () => {
    renderizar({ selectedCount: 1 });

    fireEvent.click(screen.getByRole('button', { name: 'Baixar documentos' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('navega para a rota principal ao clicar no botão de voltar', () => {
    renderizar();

    fireEvent.click(document.getElementById(CF_BUTTON_VOLTAR) as HTMLElement);

    expect(navigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL, undefined);
  });
});
