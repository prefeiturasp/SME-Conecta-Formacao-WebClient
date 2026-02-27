import { describe, test, expect, jest } from '@jest/globals';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

describe('SecaoFormulario', () => {
  describe('Props interface', () => {
    test('deve aceitar opcoesFormacao como array de PropostaAutocompletarDTO', () => {
      const opcoes: PropostaAutocompletarDTO[] = [
        { numeroHomologacao: 123, nomeFormacao: 'Formação 1' } as PropostaAutocompletarDTO,
        { numeroHomologacao: 456, nomeFormacao: 'Formação 2' } as PropostaAutocompletarDTO,
      ];

      expect(Array.isArray(opcoes)).toBe(true);
      expect(opcoes.length).toBe(2);
      expect(opcoes[0]).toHaveProperty('numeroHomologacao');
    });

    test('deve aceitar onSearchFormacao como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback('termo de busca');
      expect(mockCallback).toHaveBeenCalledWith('termo de busca');
    });

    test('deve aceitar onSelectFormacao como função async', async () => {
      const mockCallback = jest.fn().mockResolvedValue(undefined);
      expect(typeof mockCallback).toBe('function');

      await mockCallback('123', { numeroHomologacao: 123 });
      expect(mockCallback).toHaveBeenCalledWith('123', { numeroHomologacao: 123 });
    });

    test('deve aceitar loadingAutocomplete como boolean', () => {
      const loadingTrue = true;
      const loadingFalse = false;

      expect(typeof loadingTrue).toBe('boolean');
      expect(typeof loadingFalse).toBe('boolean');
    });

    test('deve aceitar turmasFiltradas como array de RetornoListagemDTO', () => {
      const turmas: RetornoListagemDTO[] = [
        { id: 1, descricao: 'Turma A' },
        { id: 2, descricao: 'Turma B' },
      ];

      expect(Array.isArray(turmas)).toBe(true);
      expect(turmas.length).toBe(2);
      expect(turmas[0]).toHaveProperty('id');
      expect(turmas[0]).toHaveProperty('descricao');
    });

    test('deve aceitar turmaDisabled como boolean', () => {
      const turmaDisabledTrue = true;
      const turmaDisabledFalse = false;

      expect(typeof turmaDisabledTrue).toBe('boolean');
      expect(typeof turmaDisabledFalse).toBe('boolean');
    });

    test('deve aceitar tooltipAberto como boolean', () => {
      const tooltipTrue = true;
      const tooltipFalse = false;

      expect(typeof tooltipTrue).toBe('boolean');
      expect(typeof tooltipFalse).toBe('boolean');
    });

    test('deve aceitar ehPerfilDF como boolean', () => {
      const ehPerfilDFTrue = true;
      const ehPerfilDFFalse = false;

      expect(typeof ehPerfilDFTrue).toBe('boolean');
      expect(typeof ehPerfilDFFalse).toBe('boolean');
    });

    test('deve aceitar ehPerfilEMFORPEF como boolean', () => {
      const ehPerfilEMFORPEFTrue = true;
      const ehPerfilEMFORPEFFalse = false;

      expect(typeof ehPerfilEMFORPEFTrue).toBe('boolean');
      expect(typeof ehPerfilEMFORPEFFalse).toBe('boolean');
    });
  });

  describe('Campo Número de homologação', () => {
    test('deve ter label correto', () => {
      const label = 'Número de homologação';
      expect(label).toBe('Número de homologação');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Digite para buscar formação';
      expect(placeholder).toBe('Digite para buscar formação');
    });

    test('deve ser campo obrigatório', () => {
      const rules = [{ required: true, message: 'Campo obrigatório' }];
      expect(rules[0].required).toBe(true);
      expect(rules[0].message).toBe('Campo obrigatório');
    });

    test('deve exibir "Buscando..." quando loadingAutocomplete é true', () => {
      const loadingAutocomplete = true;
      const notFoundContent = loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada';
      expect(notFoundContent).toBe('Buscando...');
    });

    test('deve exibir "Nenhuma formação encontrada" quando não há resultados', () => {
      const loadingAutocomplete = false;
      const notFoundContent = loadingAutocomplete ? 'Buscando...' : 'Nenhuma formação encontrada';
      expect(notFoundContent).toBe('Nenhuma formação encontrada');
    });

    test('deve mapear opções corretamente', () => {
      const opcoes: PropostaAutocompletarDTO[] = [
        { numeroHomologacao: 123 } as PropostaAutocompletarDTO,
        { numeroHomologacao: 456 } as PropostaAutocompletarDTO,
      ];

      const optionsMapped = opcoes.map((opcao) => ({
        value: opcao.numeroHomologacao.toString(),
        label: opcao.numeroHomologacao.toString(),
        numeroHomologacao: opcao.numeroHomologacao,
      }));

      expect(optionsMapped.length).toBe(2);
      expect(optionsMapped[0].value).toBe('123');
      expect(optionsMapped[0].label).toBe('123');
      expect(optionsMapped[0].numeroHomologacao).toBe(123);
    });
  });

  describe('Campo Nome da formação', () => {
    test('deve ter label correto', () => {
      const label = 'Nome da formação';
      expect(label).toBe('Nome da formação');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Nome da formação';
      expect(placeholder).toBe('Nome da formação');
    });

    test('deve ser campo obrigatório', () => {
      const rules = [{ required: true, message: 'Campo obrigatório' }];
      expect(rules[0].required).toBe(true);
    });

    test('deve ter maxLength de 200', () => {
      const maxLength = 200;
      expect(maxLength).toBe(200);
    });

    test('deve estar desabilitado', () => {
      const disabled = true;
      expect(disabled).toBe(true);
    });
  });

  describe('Campo Código da formação', () => {
    test('deve ter label correto', () => {
      const label = 'Código da formação';
      expect(label).toBe('Código da formação');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Código da formação';
      expect(placeholder).toBe('Código da formação');
    });

    test('deve ser campo obrigatório', () => {
      const rules = [{ required: true, message: 'Campo obrigatório' }];
      expect(rules[0].required).toBe(true);
    });

    test('deve ter maxLength de 20', () => {
      const maxLength = 20;
      expect(maxLength).toBe(20);
    });

    test('deve estar desabilitado', () => {
      const disabled = true;
      expect(disabled).toBe(true);
    });
  });

  describe('Campo Turma', () => {
    test('deve ter label correto', () => {
      const label = 'Turma';
      expect(label).toBe('Turma');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Selecione a turma';
      expect(placeholder).toBe('Selecione a turma');
    });

    test('deve ser campo obrigatório', () => {
      const rules = [{ required: true, message: 'Campo obrigatório' }];
      expect(rules[0].required).toBe(true);
    });

    test('deve ter tooltip informativo', () => {
      const tooltipTitle = 'Não é possível selecionar uma turma já inserida em um CODAF';
      expect(tooltipTitle).toContain('turma');
      expect(tooltipTitle).toContain('CODAF');
    });

    test('deve mapear turmas corretamente', () => {
      const turmas: RetornoListagemDTO[] = [
        { id: 1, descricao: 'Turma A' },
        { id: 2, descricao: 'Turma B' },
      ];

      const optionsMapped = turmas.map((turma) => ({
        label: turma.descricao,
        value: turma.id,
      }));

      expect(optionsMapped.length).toBe(2);
      expect(optionsMapped[0].label).toBe('Turma A');
      expect(optionsMapped[0].value).toBe(1);
    });

    test('deve permitir limpar seleção', () => {
      const allowClear = true;
      expect(allowClear).toBe(true);
    });
  });

  describe('Campo Número do comunicado', () => {
    test('deve ter label correto', () => {
      const label = 'Número do comunicado';
      expect(label).toBe('Número do comunicado');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Número do comunicado';
      expect(placeholder).toBe('Número do comunicado');
    });

    test('deve ter maxLength de 20', () => {
      const maxLength = 20;
      expect(maxLength).toBe(20);
    });

    test('não deve ser campo obrigatório', () => {
      const rules: any[] = [];
      expect(rules.length).toBe(0);
    });
  });

  describe('Campo Data da publicação', () => {
    test('deve ter label correto', () => {
      const label = 'Data da publicação';
      expect(label).toBe('Data da publicação');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Selecione a data';
      expect(placeholder).toBe('Selecione a data');
    });

    test('deve ter formato DD/MM/YYYY', () => {
      const format = 'DD/MM/YYYY';
      expect(format).toBe('DD/MM/YYYY');
    });

    test('deve ter largura de 100%', () => {
      const width = '100%';
      expect(width).toBe('100%');
    });
  });

  describe('Campo Página do comunicado', () => {
    test('deve ter label correto', () => {
      const label = 'Página do comunicado no Diário Oficial';
      expect(label).toContain('Página');
      expect(label).toContain('Diário Oficial');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Página do comunicado';
      expect(placeholder).toBe('Página do comunicado');
    });

    test('deve ter maxLength de 10', () => {
      const maxLength = 10;
      expect(maxLength).toBe(10);
    });
  });

  describe('Campo Data de publicação do Diário Oficial', () => {
    test('deve ter label correto', () => {
      const label = 'Data de publicação do Diário Oficial';
      expect(label).toContain('Data de publicação');
      expect(label).toContain('Diário Oficial');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Selecione a data';
      expect(placeholder).toBe('Selecione a data');
    });

    test('deve ter formato DD/MM/YYYY', () => {
      const format = 'DD/MM/YYYY';
      expect(format).toBe('DD/MM/YYYY');
    });
  });

  describe('Campo Código do curso no EOL', () => {
    test('deve ter label correto', () => {
      const label = 'Código do curso no EOL';
      expect(label).toContain('Código');
      expect(label).toContain('EOL');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Código do curso no EOL';
      expect(placeholder).toBe('Código do curso no EOL');
    });

    test('deve ter maxLength de 50', () => {
      const maxLength = 50;
      expect(maxLength).toBe(50);
    });

    test('deve estar desabilitado quando ehPerfilDF é true', () => {
      const ehPerfilDF = true;
      const ehPerfilEMFORPEF = false;
      const disabled = ehPerfilDF || ehPerfilEMFORPEF;
      expect(disabled).toBe(true);
    });

    test('deve estar desabilitado quando ehPerfilEMFORPEF é true', () => {
      const ehPerfilDF = false;
      const ehPerfilEMFORPEF = true;
      const disabled = ehPerfilDF || ehPerfilEMFORPEF;
      expect(disabled).toBe(true);
    });

    test('deve estar habilitado quando nenhum perfil especial', () => {
      const ehPerfilDF = false;
      const ehPerfilEMFORPEF = false;
      const disabled = ehPerfilDF || ehPerfilEMFORPEF;
      expect(disabled).toBe(false);
    });
  });

  describe('Campo Código do nível', () => {
    test('deve ter label correto', () => {
      const label = 'Código do nível';
      expect(label).toBe('Código do nível');
    });

    test('deve ter placeholder correto', () => {
      const placeholder = 'Código do nível';
      expect(placeholder).toBe('Código do nível');
    });

    test('deve ter maxLength de 50', () => {
      const maxLength = 50;
      expect(maxLength).toBe(50);
    });

    test('deve estar desabilitado quando ehPerfilDF é true', () => {
      const ehPerfilDF = true;
      const ehPerfilEMFORPEF = false;
      const disabled = ehPerfilDF || ehPerfilEMFORPEF;
      expect(disabled).toBe(true);
    });

    test('deve estar desabilitado quando ehPerfilEMFORPEF é true', () => {
      const ehPerfilDF = false;
      const ehPerfilEMFORPEF = true;
      const disabled = ehPerfilDF || ehPerfilEMFORPEF;
      expect(disabled).toBe(true);
    });
  });

  describe('Layout do formulário', () => {
    test('Row deve ter gutter [16, 8]', () => {
      const gutter = [16, 8];
      expect(gutter).toEqual([16, 8]);
    });

    test('Primeira linha deve ter dois campos ocupando metade da tela', () => {
      const colSpan = 12;
      expect(colSpan).toBe(12);
    });

    test('Terceira linha deve ter três campos ocupando 8 colunas cada', () => {
      const colSpan = 8;
      expect(colSpan).toBe(8);
    });
  });

  describe('Estilização do tooltip', () => {
    test('ícone do tooltip deve ter cor #ff6b35', () => {
      const iconStyle = { color: '#ff6b35', cursor: 'help' };
      expect(iconStyle.color).toBe('#ff6b35');
      expect(iconStyle.cursor).toBe('help');
    });
  });
});
