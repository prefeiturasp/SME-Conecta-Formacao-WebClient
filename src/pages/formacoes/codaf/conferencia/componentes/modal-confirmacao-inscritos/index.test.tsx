/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ModalConfirmacaoInscritosConferencia } from './index';

describe('ModalConfirmacaoInscritosConferencia', () => {
  it('deve exibir titulo, texto e botoes quando visivel e disparar callbacks', () => {
    const onClose = jest.fn();
    const onClickInscricoes = jest.fn();
    const onClickContinuar = jest.fn();

    render(
      <ModalConfirmacaoInscritosConferencia
        visivel={true}
        onClose={onClose}
        onClickInscricoes={onClickInscricoes}
        onClickContinuar={onClickContinuar}
      />,
    );

    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Antes de iniciar o registro CODAF, verifique se todos os cursistas estão inscritos na formação/i,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ir para tela de inscrições'));
    expect(onClickInscricoes).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Continuar registros'));
    expect(onClickContinuar).toHaveBeenCalledTimes(1);
  });
});
