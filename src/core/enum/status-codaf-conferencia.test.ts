import {
  SituacaoCodafConferenciaTagDisplay,
  StatusCodafConferencia,
} from './status-codaf-conferencia';

describe('StatusCodafConferencia', () => {
  it('deve possuir os valores esperados para os status', () => {
    expect(StatusCodafConferencia.INICIADO).toBe(1);
    expect(StatusCodafConferencia.AGUARDANDO_FINALIZACAO).toBe(2);
    expect(StatusCodafConferencia.FINALIZADO).toBe(3);
  });

  it('deve mapear os textos de exibicao corretamente', () => {
    expect(SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.INICIADO]).toBe('Iniciado');
    expect(SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.AGUARDANDO_FINALIZACAO]).toBe(
      'Aguardando Finalização',
    );
    expect(SituacaoCodafConferenciaTagDisplay[StatusCodafConferencia.FINALIZADO]).toBe(
      'Finalizado',
    );
  });
});
