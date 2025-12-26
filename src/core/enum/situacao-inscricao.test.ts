import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from './situacao-inscricao';

describe('SituacaoInscricao Enum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(SituacaoInscricao.Confirmada).toBe(1);
    expect(SituacaoInscricao.Enviada).toBe(2);
    expect(SituacaoInscricao.EmAnalise).toBe(3);
    expect(SituacaoInscricao.Cancelada).toBe(4);
    expect(SituacaoInscricao.EmEspera).toBe(5);
    expect(SituacaoInscricao.Transferida).toBe(6);
  });

  test('deve ter todas as labels corretas no SituacaoInscricaoTagDisplay', () => {
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Confirmada]).toBe('Confirmada');
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Enviada]).toBe('Enviada');
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.EmAnalise]).toBe('Aguardando Análise');
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Cancelada]).toBe('Cancelada');
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.EmEspera]).toBe('Em Espera');
    expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Transferida]).toBe('Transferida');
  });

  test('deve ter exatamente 6 situações', () => {
    const situacoes = Object.keys(SituacaoInscricao).filter((key) => !Number.isNaN(Number(key)));
    expect(situacoes.length).toBe(6);
  });

  test('todas as situações devem ter uma label correspondente', () => {
    const situacoes = Object.keys(SituacaoInscricao).filter((key) => !Number.isNaN(Number(key)));
    situacoes.forEach((key) => {
      expect(SituacaoInscricaoTagDisplay[Number(key) as SituacaoInscricao]).toBeDefined();
      expect(SituacaoInscricaoTagDisplay[Number(key) as SituacaoInscricao]).not.toBe('');
    });
  });
});
