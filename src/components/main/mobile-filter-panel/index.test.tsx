/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileFilterPanel from './index';

describe('MobileFilterPanel', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('não deve renderizar nada quando open for false', () => {
    const { container } = render(
      <MobileFilterPanel open={false} onClose={jest.fn()}>
        <div>Conteúdo dos filtros</div>
      </MobileFilterPanel>,
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('mobile-filter-panel')).not.toBeInTheDocument();
  });

  it('deve renderizar o painel aberto com título padrão e conteúdo', () => {
    render(
      <MobileFilterPanel open={true} onClose={jest.fn()} onClear={jest.fn()} onApply={jest.fn()}>
        <div data-testid='filtro-teste'>Campos de filtro</div>
      </MobileFilterPanel>,
    );

    expect(screen.getByTestId('mobile-filter-panel')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-teste')).toBeInTheDocument();
    expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
    expect(screen.getByText('Buscar formações')).toBeInTheDocument();
  });

  it('deve renderizar com textos e título customizados', () => {
    render(
      <MobileFilterPanel
        open={true}
        onClose={jest.fn()}
        onClear={jest.fn()}
        onApply={jest.fn()}
        title='Filtrar Cursos'
        clearText='Limpar tudo'
        applyText='Aplicar filtros'
      >
        <div>Campos</div>
      </MobileFilterPanel>,
    );

    expect(screen.getByText('Filtrar Cursos')).toBeInTheDocument();
    expect(screen.getByText('Limpar tudo')).toBeInTheDocument();
    expect(screen.getByText('Aplicar filtros')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão fechar', () => {
    const onClose = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={onClose}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    const closeBtn = screen.getByTestId('mobile-filter-panel-close-btn');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay/backdrop', () => {
    const onClose = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={onClose}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    const overlay = screen.getByTestId('mobile-filter-panel-overlay');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClear ao clicar no botão limpar', () => {
    const onClear = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={jest.fn()} onClear={onClear}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    const clearBtn = screen.getByTestId('mobile-filter-panel-clear-btn');
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onApply ao clicar no botão aplicar', () => {
    const onApply = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={jest.fn()} onApply={onApply}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    const applyBtn = screen.getByTestId('mobile-filter-panel-apply-btn');
    fireEvent.click(applyBtn);
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('não deve renderizar os botões quando onClear e onApply não forem fornecidos', () => {
    render(
      <MobileFilterPanel open={true} onClose={jest.fn()}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    expect(screen.queryByTestId('mobile-filter-panel-clear-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-filter-panel-apply-btn')).not.toBeInTheDocument();
  });

  it('deve fechar ao pressionar a tecla Escape', () => {
    const onClose = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={onClose}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não deve fechar ao pressionar outra tecla diferente de Escape', () => {
    const onClose = jest.fn();
    render(
      <MobileFilterPanel open={true} onClose={onClose}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('deve travar o scroll do body quando aberto e liberar quando fechado ou desmontado', () => {
    const { rerender, unmount } = render(
      <MobileFilterPanel open={true} onClose={jest.fn()}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <MobileFilterPanel open={false} onClose={jest.fn()}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );
    expect(document.body.style.overflow).toBe('');

    rerender(
      <MobileFilterPanel open={true} onClose={jest.fn()}>
        <div>Conteúdo</div>
      </MobileFilterPanel>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
