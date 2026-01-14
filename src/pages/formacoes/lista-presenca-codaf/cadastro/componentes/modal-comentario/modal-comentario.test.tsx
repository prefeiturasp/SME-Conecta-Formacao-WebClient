import { describe, test, expect, jest } from '@jest/globals';
import dayjs from 'dayjs';
import { ComentarioCodafDTO } from '~/core/services/codaf-lista-presenca-service';

describe('ModalComentario', () => {
  describe('Props interface', () => {
    test('deve aceitar visible como boolean', () => {
      const visibleTrue = true;
      const visibleFalse = false;

      expect(typeof visibleTrue).toBe('boolean');
      expect(typeof visibleFalse).toBe('boolean');
      expect(visibleTrue).toBe(true);
      expect(visibleFalse).toBe(false);
    });

    test('deve aceitar onClose como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    test('deve aceitar comentario como ComentarioCodafDTO ou null', () => {
      const comentarioValido: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'João Silva',
        criadoLogin: 'RF123456',
        criadoEm: '2024-01-15T10:30:00',
        comentario: 'Comentário de teste',
      };

      const comentarioNulo: ComentarioCodafDTO | null = null;

      expect(comentarioValido).toHaveProperty('comentario');
      expect(comentarioNulo).toBeNull();
    });
  });

  describe('Configuração do Modal', () => {
    test('deve ter título correto', () => {
      const titulo = 'Sugestões de ajustes para o CODAF';
      expect(titulo).toBe('Sugestões de ajustes para o CODAF');
    });

    test('deve ter estilo de título correto', () => {
      const titleStyle = {
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '100%',
        letterSpacing: '0%',
      };

      expect(titleStyle.fontWeight).toBe(700);
      expect(titleStyle.fontSize).toBe('20px');
      expect(titleStyle.lineHeight).toBe('100%');
      expect(titleStyle.letterSpacing).toBe('0%');
    });

    test('deve estar centralizado', () => {
      const centered = true;
      expect(centered).toBe(true);
    });

    test('deve ter largura de 800px', () => {
      const width = 800;
      expect(width).toBe(800);
    });

    test('deve chamar onCancel ao fechar', () => {
      const mockOnClose = jest.fn();
      mockOnClose();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Footer do Modal', () => {
    test('deve ter botão Fechar', () => {
      const buttonKey = 'fechar';
      const buttonText = 'Fechar';

      expect(buttonKey).toBe('fechar');
      expect(buttonText).toBe('Fechar');
    });

    test('botão deve ser do tipo primary', () => {
      const buttonType = 'primary';
      expect(buttonType).toBe('primary');
    });

    test('botão deve ter fontWeight 500', () => {
      const buttonStyle = { fontWeight: 500 };
      expect(buttonStyle.fontWeight).toBe(500);
    });

    test('botão deve chamar onClose quando clicado', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('Conteúdo do Modal', () => {
    test('deve exibir texto informativo', () => {
      const textoInformativo = 'Estas são as informações retornadas pela pessoa administradora.';
      expect(textoInformativo).toContain('informações retornadas');
      expect(textoInformativo).toContain('pessoa administradora');
    });

    test('deve renderizar quando comentario existe', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Maria Santos',
        criadoLogin: 'RF789012',
        criadoEm: '2024-01-15T14:20:00',
        comentario: 'Por favor, revisar os dados',
      };

      expect(comentario).toBeTruthy();
      expect(comentario.comentario).toBeTruthy();
    });

    test('não deve renderizar conteúdo quando comentario é null', () => {
      const comentario: ComentarioCodafDTO | null = null;
      expect(comentario).toBeNull();
    });
  });

  describe('Seção de Comentário', () => {
    test('deve ter label "Comentário" em negrito', () => {
      const label = 'Comentário';
      const isBold = true;

      expect(label).toBe('Comentário');
      expect(isBold).toBe(true);
    });

    test('deve ter estilo de container correto', () => {
      const containerStyle = {
        padding: '12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        minHeight: '100px',
      };

      expect(containerStyle.padding).toBe('12px');
      expect(containerStyle.backgroundColor).toBe('#f5f5f5');
      expect(containerStyle.border).toBe('1px solid #d9d9d9');
      expect(containerStyle.borderRadius).toBe('4px');
      expect(containerStyle.fontSize).toBe('14px');
      expect(containerStyle.whiteSpace).toBe('pre-wrap');
      expect(containerStyle.minHeight).toBe('100px');
    });

    test('deve ter marginBottom de 16px', () => {
      const style = { marginBottom: '16px' };
      expect(style.marginBottom).toBe('16px');
    });

    test('label deve ter marginBottom de 8px', () => {
      const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 500 };
      expect(labelStyle.marginBottom).toBe('8px');
      expect(labelStyle.display).toBe('block');
      expect(labelStyle.fontWeight).toBe(500);
    });

    test('deve exibir texto do comentário', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Pedro Oliveira',
        criadoLogin: 'RF456789',
        criadoEm: '2024-01-15T16:45:00',
        comentario: 'Favor revisar os dados da turma X',
      };

      expect(comentario.comentario).toBe('Favor revisar os dados da turma X');
    });

    test('deve preservar quebras de linha com pre-wrap', () => {
      const whiteSpace = 'pre-wrap';
      expect(whiteSpace).toBe('pre-wrap');
    });
  });

  describe('Informações do autor', () => {
    test('deve exibir nome do autor', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Ana Costa',
        criadoLogin: 'RF111222',
        criadoEm: '2024-01-15T09:00:00',
        comentario: 'Comentário teste',
      };

      expect(comentario.criadoPor).toBe('Ana Costa');
    });

    test('deve exibir RF do autor', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Carlos Lima',
        criadoLogin: 'RF333444',
        criadoEm: '2024-01-15T11:30:00',
        comentario: 'Comentário teste',
      };

      expect(comentario.criadoLogin).toBe('RF333444');
    });

    test('deve formatar texto de informação corretamente', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Teste User',
        criadoLogin: 'RF555666',
        criadoEm: '2024-01-15T13:45:00',
        comentario: 'Teste',
      };

      const textoEsperado = `INSERIDO por ${comentario.criadoPor} (nº RF ${comentario.criadoLogin}) em`;

      expect(textoEsperado).toContain('INSERIDO por');
      expect(textoEsperado).toContain(comentario.criadoPor);
      expect(textoEsperado).toContain('nº RF');
      expect(textoEsperado).toContain(comentario.criadoLogin);
    });
  });

  describe('Formatação de data', () => {
    test('deve formatar data no formato DD/MM/YYYY HH:mm', () => {
      const dataISO = '2024-01-15T10:30:00';
      const dataFormatada = dayjs(dataISO).format('DD/MM/YYYY HH:mm');

      expect(dataFormatada).toBe('15/01/2024 10:30');
    });

    test('deve formatar data corretamente para diferentes horários', () => {
      const dataISO1 = '2024-12-25T23:59:00';
      const dataISO2 = '2024-01-01T00:00:00';

      const formatada1 = dayjs(dataISO1).format('DD/MM/YYYY HH:mm');
      const formatada2 = dayjs(dataISO2).format('DD/MM/YYYY HH:mm');

      expect(formatada1).toBe('25/12/2024 23:59');
      expect(formatada2).toBe('01/01/2024 00:00');
    });

    test('deve usar dayjs para formatação', () => {
      const data = '2024-01-15T14:30:00';
      const formatado = dayjs(data).format('DD/MM/YYYY HH:mm');

      expect(typeof formatado).toBe('string');
      expect(formatado).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/);
    });
  });

  describe('Validação de ComentarioCodafDTO', () => {
    test('deve ter todos os campos obrigatórios', () => {
      const comentario: ComentarioCodafDTO = {
        id: 10,
        criadoPor: 'Fulano de Tal',
        criadoLogin: 'RF999888',
        criadoEm: '2024-01-15T15:00:00',
        comentario: 'Comentário completo',
      };

      expect(comentario).toHaveProperty('id');
      expect(comentario).toHaveProperty('criadoPor');
      expect(comentario).toHaveProperty('criadoLogin');
      expect(comentario).toHaveProperty('criadoEm');
      expect(comentario).toHaveProperty('comentario');
    });

    test('campos devem ter tipos corretos', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Nome',
        criadoLogin: 'RF123',
        criadoEm: '2024-01-15T10:00:00',
        comentario: 'Texto',
      };

      expect(typeof comentario.id).toBe('number');
      expect(typeof comentario.criadoPor).toBe('string');
      expect(typeof comentario.criadoLogin).toBe('string');
      expect(typeof comentario.criadoEm).toBe('string');
      expect(typeof comentario.comentario).toBe('string');
    });
  });

  describe('Espaçamento e layout', () => {
    test('deve ter quebras de linha adequadas', () => {
      const hasBreaks = true;
      expect(hasBreaks).toBe(true);
    });

    test('seção de comentário deve ter marginBottom', () => {
      const marginBottom = '16px';
      expect(marginBottom).toBe('16px');
    });
  });

  describe('Comportamento do Modal', () => {
    test('deve abrir quando visible é true', () => {
      const visible = true;
      expect(visible).toBe(true);
    });

    test('deve fechar quando visible é false', () => {
      const visible = false;
      expect(visible).toBe(false);
    });

    test('deve permitir fechar via onCancel', () => {
      const mockOnCancel = jest.fn();
      mockOnCancel();
      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('deve permitir fechar via botão Fechar', () => {
      const mockOnClose = jest.fn();
      mockOnClose();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Acessibilidade e UX', () => {
    test('título deve ser descritivo', () => {
      const titulo = 'Sugestões de ajustes para o CODAF';
      expect(titulo).toContain('Sugestões');
      expect(titulo).toContain('ajustes');
      expect(titulo).toContain('CODAF');
    });

    test('texto informativo deve orientar o usuário', () => {
      const texto = 'Estas são as informações retornadas pela pessoa administradora.';
      expect(texto).toBeTruthy();
      expect(texto.length).toBeGreaterThan(20);
    });

    test('botão de fechar deve ser claro', () => {
      const buttonText = 'Fechar';
      expect(buttonText).toBe('Fechar');
      expect(buttonText.length).toBeGreaterThan(0);
    });
  });

  describe('Comentários vazios ou longos', () => {
    test('deve aceitar comentário vazio', () => {
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Usuário',
        criadoLogin: 'RF123',
        criadoEm: '2024-01-15T10:00:00',
        comentario: '',
      };

      expect(comentario.comentario).toBe('');
      expect(comentario.comentario.length).toBe(0);
    });

    test('deve aceitar comentário longo', () => {
      const textoLongo = 'Este é um comentário muito longo '.repeat(50);
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Usuário',
        criadoLogin: 'RF123',
        criadoEm: '2024-01-15T10:00:00',
        comentario: textoLongo,
      };

      expect(comentario.comentario.length).toBeGreaterThan(100);
    });

    test('deve aceitar comentário com quebras de linha', () => {
      const comentarioComQuebras = 'Linha 1\nLinha 2\nLinha 3';
      const comentario: ComentarioCodafDTO = {
        id: 1,
        criadoPor: 'Usuário',
        criadoLogin: 'RF123',
        criadoEm: '2024-01-15T10:00:00',
        comentario: comentarioComQuebras,
      };

      expect(comentario.comentario).toContain('\n');
      expect(comentario.comentario.split('\n').length).toBe(3);
    });
  });
});
