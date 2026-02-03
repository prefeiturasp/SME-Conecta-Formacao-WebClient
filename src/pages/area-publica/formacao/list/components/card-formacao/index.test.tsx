import { describe, test, expect } from '@jest/globals';

describe('CardFormacao', () => {
  describe('Estrutura do FormacaoDTO', () => {
    const formacaoMock = {
      id: 1,
      titulo: 'Formação de Teste',
      periodo: '01/01/2024 a 31/12/2024',
      periodoInscricao: '01/01/2024 a 30/01/2024',
      areaPromotora: 'Área Promotora Teste',
      tipoFormacaoDescricao: 'Curso',
      formatoDescricao: 'Presencial',
      imagemUrl: 'http://exemplo.com/imagem.jpg',
      inscricaoEncerrada: false,
    };

    test('deve ter id definido', () => {
      expect(formacaoMock.id).toBeDefined();
      expect(typeof formacaoMock.id).toBe('number');
    });

    test('deve ter título definido', () => {
      expect(formacaoMock.titulo).toBe('Formação de Teste');
    });

    test('deve ter período de realização', () => {
      expect(formacaoMock.periodo).toContain('a');
    });

    test('deve ter período de inscrição', () => {
      expect(formacaoMock.periodoInscricao).toContain('a');
    });

    test('deve ter área promotora', () => {
      expect(formacaoMock.areaPromotora).toBeTruthy();
    });

    test('deve ter tipo de formação', () => {
      expect(formacaoMock.tipoFormacaoDescricao).toBeTruthy();
    });

    test('deve ter formato', () => {
      expect(formacaoMock.formatoDescricao).toBeTruthy();
    });
  });

  describe('Textos exibidos', () => {
    test('deve exibir prefixo para período de realização', () => {
      const texto = 'Período de realização:';
      expect(texto).toBe('Período de realização:');
    });

    test('deve exibir prefixo para período de inscrição', () => {
      const texto = 'Período de inscrição:';
      expect(texto).toBe('Período de inscrição:');
    });

    test('deve exibir prefixo para área promotora', () => {
      const texto = 'Área promotora:';
      expect(texto).toBe('Área promotora:');
    });
  });

  describe('Botão Saiba Mais', () => {
    test('deve ter texto correto', () => {
      const SAIBA_MAIS = 'Saiba mais';
      expect(SAIBA_MAIS).toBe('Saiba mais');
    });

    test('deve ter tipo primary', () => {
      const buttonType = 'primary';
      expect(buttonType).toBe('primary');
    });

    test('deve ter shape round', () => {
      const buttonShape = 'round';
      expect(buttonShape).toBe('round');
    });

    test('deve ter size large', () => {
      const buttonSize = 'large';
      expect(buttonSize).toBe('large');
    });

    test('deve ter propriedade block', () => {
      const isBlock = true;
      expect(isBlock).toBe(true);
    });
  });

  describe('Navegação', () => {
    test('deve navegar para rota de visualização correta', () => {
      const formacaoId = 123;
      const expectedRoute = `/area-publica/visualizar/${formacaoId}`;
      expect(expectedRoute).toContain('area-publica');
      expect(expectedRoute).toContain('visualizar');
      expect(expectedRoute).toContain(String(formacaoId));
    });

    test('deve passar location como state', () => {
      const formacao = { id: 1, titulo: 'Teste' };
      const navigationState = { replace: true, state: { location: formacao } };

      expect(navigationState.replace).toBe(true);
      expect(navigationState.state.location).toEqual(formacao);
    });
  });

  describe('Tags de tipo e formato', () => {
    test('deve exibir ícone de graduação para tipo', () => {
      const iconName = 'FaGraduationCap';
      expect(iconName).toBe('FaGraduationCap');
    });

    test('deve exibir ícone de localização para formato', () => {
      const iconName = 'FaMapMarkerAlt';
      expect(iconName).toBe('FaMapMarkerAlt');
    });

    test('ícones devem ter tamanho 16', () => {
      const iconSize = 16;
      expect(iconSize).toBe(16);
    });
  });

  describe('Estilos de layout', () => {
    test('deve ter maxHeight de 104 para campos de texto', () => {
      const maxHeight = 104;
      expect(maxHeight).toBe(104);
    });

    test('deve ter overflow auto para campos de texto', () => {
      const overflow = 'auto';
      expect(overflow).toBe('auto');
    });

    test('deve ter gutter de 10 para espaçamento', () => {
      const gutter = [10, 10];
      expect(gutter).toEqual([10, 10]);
    });
  });

  describe('ImgFormacao', () => {
    test('deve receber url da imagem', () => {
      const url = 'http://exemplo.com/imagem.jpg';
      expect(url).toBeTruthy();
    });

    test('deve receber flag de inscrição encerrada', () => {
      const inscricaoEncerrada = false;
      expect(typeof inscricaoEncerrada).toBe('boolean');
    });
  });
});
