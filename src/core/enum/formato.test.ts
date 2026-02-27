import { Formato, FormatoDisplay } from './formato';

describe('Formato Enum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(Formato.Presencial).toBe(1);
    expect(Formato.Distancia).toBe(2);
    expect(Formato.Hibrido).toBe(3);
  });

  test('deve ter todas as labels corretas no FormatoDisplay', () => {
    expect(FormatoDisplay[Formato.Presencial]).toBe('Presencial');
    expect(FormatoDisplay[Formato.Distancia]).toBe('Distância');
    expect(FormatoDisplay[Formato.Hibrido]).toBe('Híbrido');
  });

  test('deve ter exatamente 3 formatos', () => {
    const formatos = Object.keys(Formato).filter((key) => !Number.isNaN(Number(key)));
    expect(formatos.length).toBe(3);
  });

  test('todos os formatos devem ter uma label correspondente', () => {
    const formatos = Object.keys(Formato).filter((key) => !Number.isNaN(Number(key)));
    formatos.forEach((key) => {
      expect(FormatoDisplay[Number(key) as Formato]).toBeDefined();
      expect(FormatoDisplay[Number(key) as Formato]).not.toBe('');
    });
  });

  test('labels devem ser strings não vazias', () => {
    expect(typeof FormatoDisplay[Formato.Presencial]).toBe('string');
    expect(FormatoDisplay[Formato.Presencial].length).toBeGreaterThan(0);
    expect(typeof FormatoDisplay[Formato.Distancia]).toBe('string');
    expect(FormatoDisplay[Formato.Distancia].length).toBeGreaterThan(0);
  });
});
