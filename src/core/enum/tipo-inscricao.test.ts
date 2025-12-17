import { TipoInscricao } from './tipo-inscricao';

describe('TipoInscricao Enum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(TipoInscricao.Optativa).toBe(1);
    expect(TipoInscricao.Automatica).toBe(2);
    expect(TipoInscricao.AutomaticaJEIF).toBe(3);
    expect(TipoInscricao.Manual).toBe(4);
    expect(TipoInscricao.Externa).toBe(5);
  });

  test('deve ter exatamente 5 tipos de inscrição', () => {
    const tipos = Object.keys(TipoInscricao).filter((key) => !isNaN(Number(key)));
    expect(tipos.length).toBe(5);
  });

  test('valores devem ser únicos', () => {
    const valores = [
      TipoInscricao.Optativa,
      TipoInscricao.Automatica,
      TipoInscricao.AutomaticaJEIF,
      TipoInscricao.Manual,
      TipoInscricao.Externa,
    ];
    const valoresUnicos = new Set(valores);
    expect(valoresUnicos.size).toBe(valores.length);
  });

  test('todos os valores devem ser números positivos', () => {
    const valores = Object.values(TipoInscricao).filter((value) => typeof value === 'number');
    valores.forEach((valor) => {
      expect(typeof valor).toBe('number');
      expect(valor).toBeGreaterThan(0);
    });
  });

  test('deve ser possível verificar se um valor é um TipoInscricao válido', () => {
    expect(Object.values(TipoInscricao).includes(1)).toBe(true);
    expect(Object.values(TipoInscricao).includes(2)).toBe(true);
    expect(Object.values(TipoInscricao).includes(3)).toBe(true);
    expect(Object.values(TipoInscricao).includes(4)).toBe(true);
    expect(Object.values(TipoInscricao).includes(5)).toBe(true);
    expect(Object.values(TipoInscricao).includes(99)).toBe(false);
  });

  test('deve ter os nomes corretos para cada tipo', () => {
    expect(TipoInscricao[1]).toBe('Optativa');
    expect(TipoInscricao[2]).toBe('Automatica');
    expect(TipoInscricao[3]).toBe('AutomaticaJEIF');
    expect(TipoInscricao[4]).toBe('Manual');
    expect(TipoInscricao[5]).toBe('Externa');
  });
});
