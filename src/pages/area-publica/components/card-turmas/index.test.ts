import { describe, test, expect } from '@jest/globals';
import { gerarDatas } from './index';

describe('gerarDatas', () => {
  test('retorna array vazio quando o formato do período é inválido', () => {
    expect(gerarDatas('periodo-invalido', '08:00')).toEqual([]);
    expect(gerarDatas('', '08:00')).toEqual([]);
  });

  test('retorna uma única data quando início e fim são iguais', () => {
    const resultado = gerarDatas('10/03/2026 - 10/03/2026', '08:00');

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBe('10/03/2026 08:00');
  });

  test('retorna todas as datas do intervalo com o horário concatenado', () => {
    const resultado = gerarDatas('01/03/2026 - 03/03/2026', '14:30');

    expect(resultado).toHaveLength(3);
    expect(resultado[0]).toBe('01/03/2026 14:30');
    expect(resultado[1]).toBe('02/03/2026 14:30');
    expect(resultado[2]).toBe('03/03/2026 14:30');
  });

  test('lida corretamente com intervalo que cruza a virada do mês', () => {
    const resultado = gerarDatas('28/02/2026 - 02/03/2026', '09:00');

    expect(resultado).toHaveLength(3);
    expect(resultado[0]).toBe('28/02/2026 09:00');
    expect(resultado[1]).toBe('01/03/2026 09:00');
    expect(resultado[2]).toBe('02/03/2026 09:00');
  });
});
