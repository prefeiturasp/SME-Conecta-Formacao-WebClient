import { Modalidade, ModalidadeDisplay } from './modalidade';

describe('Modalidade Enum', () => {
  test('deve ter todos os valores esperados', () => {
    expect(Modalidade.EducacaoInfantil).toBe(1);
    expect(Modalidade.EJA).toBe(3);
    expect(Modalidade.CIEJA).toBe(4);
    expect(Modalidade.Fundamental).toBe(5);
    expect(Modalidade.Medio).toBe(6);
    expect(Modalidade.CMCT).toBe(7);
    expect(Modalidade.MOVA).toBe(8);
    expect(Modalidade.ETEC).toBe(9);
    expect(Modalidade.CELP).toBe(10);
  });

  test('deve ter todas as labels corretas no ModalidadeDisplay', () => {
    expect(ModalidadeDisplay[Modalidade.EducacaoInfantil]).toBe('Educação Infantil');
    expect(ModalidadeDisplay[Modalidade.EJA]).toBe('Educação de Jovens e Adultos');
    expect(ModalidadeDisplay[Modalidade.Fundamental]).toBe('Ensino Fundamental');
    expect(ModalidadeDisplay[Modalidade.Medio]).toBe('Ensino Médio');
  });

  test('deve ter exatamente 9 modalidades', () => {
    const modalidades = Object.keys(Modalidade).filter((key) => !Number.isNaN(Number(key)));
    expect(modalidades.length).toBe(9);
  });

  test('todas as modalidades devem ter uma label correspondente', () => {
    const modalidades = Object.keys(Modalidade).filter((key) => !Number.isNaN(Number(key)));
    modalidades.forEach((key) => {
      expect(ModalidadeDisplay[Number(key) as Modalidade]).toBeDefined();
      expect(ModalidadeDisplay[Number(key) as Modalidade]).not.toBe('');
    });
  });

  test('labels devem ser strings não vazias', () => {
    const displays = Object.values(ModalidadeDisplay);
    displays.forEach((display) => {
      expect(typeof display).toBe('string');
      expect(display.length).toBeGreaterThan(0);
    });
  });

  test('deve incluir modalidades específicas', () => {
    expect(ModalidadeDisplay[Modalidade.CIEJA]).toBe('CIEJA');
    expect(ModalidadeDisplay[Modalidade.CMCT]).toBe('CMCT');
    expect(ModalidadeDisplay[Modalidade.MOVA]).toBe('MOVA');
    expect(ModalidadeDisplay[Modalidade.ETEC]).toBe('ETEC');
    expect(ModalidadeDisplay[Modalidade.CELP]).toBe('CELP');
  });
});
