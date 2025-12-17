import { SituacaoProposta, SituacaoPropostaTagDisplay } from './situacao-proposta';

describe('SituacaoProposta Enum', () => {
  test('deve ter todos os valores principais esperados', () => {
    expect(SituacaoProposta.Publicada).toBe(1);
    expect(SituacaoProposta.Rascunho).toBe(2);
    expect(SituacaoProposta.Cadastrada).toBe(3);
    expect(SituacaoProposta.Aprovada).toBe(9);
    expect(SituacaoProposta.Recusada).toBe(13);
  });

  test('deve ter todas as labels corretas no SituacaoPropostaTagDisplay', () => {
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Publicada]).toBe('Publicada');
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Rascunho]).toBe('Rascunho');
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Aprovada]).toBe('Aprovada');
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Recusada]).toBe('Recusada');
  });

  test('deve ter exatamente 15 situações de proposta', () => {
    const situacoes = Object.keys(SituacaoProposta).filter((key) => !Number.isNaN(Number(key)));
    expect(situacoes.length).toBe(15);
  });

  test('todas as situações devem ter uma label correspondente', () => {
    const situacoes = Object.keys(SituacaoProposta).filter((key) => !Number.isNaN(Number(key)));
    situacoes.forEach((key) => {
      expect(SituacaoPropostaTagDisplay[Number(key)]).toBeDefined();
      expect(SituacaoPropostaTagDisplay[Number(key)]).not.toBe('');
    });
  });

  test('deve ter situações de análise', () => {
    expect(SituacaoProposta.AguardandoAnaliseDf).toBe(4);
    expect(SituacaoProposta.AguardandoAnaliseGestao).toBe(5);
    expect(SituacaoProposta.AguardandoAnalisePeloParecerista).toBe(10);
  });

  test('labels de análise devem conter texto adequado', () => {
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnaliseDf]).toContain('Aguardando');
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.AguardandoAnalisePeloParecerista]).toContain(
      'Parecerista',
    );
  });

  test('deve ter situação Devolvida e Alterando', () => {
    expect(SituacaoProposta.Devolvida).toBe(7);
    expect(SituacaoProposta.Alterando).toBe(8);
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Devolvida]).toBe('Devolvida');
    expect(SituacaoPropostaTagDisplay[SituacaoProposta.Alterando]).toBe('Alterando');
  });

  test('labels devem ser strings não vazias', () => {
    const displays = Object.values(SituacaoPropostaTagDisplay);
    displays.forEach((display) => {
      expect(typeof display).toBe('string');
      expect(display.length).toBeGreaterThan(0);
    });
  });
});
