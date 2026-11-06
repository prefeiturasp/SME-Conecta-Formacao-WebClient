import { SituacaoAprovacao, SituacaoAprovacaoTagDisplay } from './situacao-aprovacao';

describe('SituacaoAprovacao Enum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(SituacaoAprovacao.Aprovado).toBe(1);
    expect(SituacaoAprovacao.Reprovado).toBe(2);
    expect(SituacaoAprovacao.EmAndamento).toBe(3);
  });

  test('deve ter todas as labels corretas no SituacaoAprovacaoTagDisplay', () => {
    expect(SituacaoAprovacaoTagDisplay[SituacaoAprovacao.Aprovado]).toBe('Aprovado');
    expect(SituacaoAprovacaoTagDisplay[SituacaoAprovacao.Reprovado]).toBe('Reprovado');
    expect(SituacaoAprovacaoTagDisplay[SituacaoAprovacao.EmAndamento]).toBe('Em Andamento');
  });

  test('deve ter exatamente 3 situações', () => {
    const situacoes = Object.keys(SituacaoAprovacao).filter((key) => !Number.isNaN(Number(key)));
    expect(situacoes.length).toBe(3);
  });

  test('todas as situações devem ter uma label correspondente', () => {
    const situacoes = Object.keys(SituacaoAprovacao).filter((key) => !Number.isNaN(Number(key)));
    situacoes.forEach((key) => {
      expect(SituacaoAprovacaoTagDisplay[Number(key) as SituacaoAprovacao]).toBeDefined();
      expect(SituacaoAprovacaoTagDisplay[Number(key) as SituacaoAprovacao]).not.toBe('');
    });
  });
});
