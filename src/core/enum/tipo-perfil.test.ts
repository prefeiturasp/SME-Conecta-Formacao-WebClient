import { TipoPerfilEnum, TipoPerfilTagDisplay } from './tipo-perfil';

describe('TipoPerfilEnum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(TipoPerfilEnum.AdminDF).toBe(1);
    expect(TipoPerfilEnum.Cursista).toBe(2);
    expect(TipoPerfilEnum.DF).toBe(3);
    expect(TipoPerfilEnum.Parecerista).toBe(4);
  });

  test('deve ter todas as labels corretas no TipoPerfilTagDisplay', () => {
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF]).toBe('Admin DF');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]).toBe('Cursista');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.DF]).toBe('DF');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista]).toBe('Parecerista');
  });

  test('deve ter exatamente 4 tipos de perfil', () => {
    const perfis = Object.keys(TipoPerfilEnum).filter((key) => !Number.isNaN(Number(key)));
    expect(perfis.length).toBe(4);
  });

  test('todos os perfis devem ter uma label correspondente', () => {
    const perfis = Object.keys(TipoPerfilEnum).filter((key) => !Number.isNaN(Number(key)));
    perfis.forEach((key) => {
      expect(TipoPerfilTagDisplay[Number(key) as TipoPerfilEnum]).toBeDefined();
      expect(TipoPerfilTagDisplay[Number(key) as TipoPerfilEnum]).not.toBe('');
    });
  });

  test('labels devem ser strings não vazias', () => {
    expect(typeof TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF]).toBe('string');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.AdminDF].length).toBeGreaterThan(0);
    expect(typeof TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]).toBe('string');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista].length).toBeGreaterThan(0);
    expect(typeof TipoPerfilTagDisplay[TipoPerfilEnum.DF]).toBe('string');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.DF].length).toBeGreaterThan(0);
    expect(typeof TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista]).toBe('string');
    expect(TipoPerfilTagDisplay[TipoPerfilEnum.Parecerista].length).toBeGreaterThan(0);
  });

  test('deve mapear corretamente todos os enum values para suas labels', () => {
    const mappings = [
      { value: TipoPerfilEnum.AdminDF, label: 'Admin DF' },
      { value: TipoPerfilEnum.Cursista, label: 'Cursista' },
      { value: TipoPerfilEnum.DF, label: 'DF' },
      { value: TipoPerfilEnum.Parecerista, label: 'Parecerista' },
    ];

    mappings.forEach(({ value, label }) => {
      expect(TipoPerfilTagDisplay[value]).toBe(label);
    });
  });

  test('não deve ter labels undefined ou null', () => {
    Object.values(TipoPerfilEnum)
      .filter((value) => typeof value === 'number')
      .forEach((value) => {
        expect(TipoPerfilTagDisplay[value as TipoPerfilEnum]).not.toBeUndefined();
        expect(TipoPerfilTagDisplay[value as TipoPerfilEnum]).not.toBeNull();
      });
  });
});
