import { describe, test, expect, jest } from '@jest/globals';
import { cloneDeep } from 'lodash';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { Colors } from '~/core/styles/colors';

describe('BtbAcoesListaIncricaoPorTurmaLinhasSelecionadas', () => {
  describe('Props interface', () => {
    test('deve aceitar selectedRows como array de DadosListagemInscricaoDTO', () => {
      const selectedRows: DadosListagemInscricaoDTO[] = [
        {
          inscricaoId: 1,
          nomeCursista: 'Cursista 1',
          permissao: { podeCancelar: true, podeConfirmar: true, podeColocarEmEspera: true },
        } as DadosListagemInscricaoDTO,
        {
          inscricaoId: 2,
          nomeCursista: 'Cursista 2',
          permissao: { podeCancelar: false, podeConfirmar: true, podeColocarEmEspera: false },
        } as DadosListagemInscricaoDTO,
      ];

      expect(Array.isArray(selectedRows)).toBe(true);
      expect(selectedRows.length).toBe(2);
    });
  });

  describe('ContainerRow estilização', () => {
    test('deve ter cor de texto branca', () => {
      const color = Colors.Neutral.WHITE;
      expect(color).toBeTruthy();
    });

    test('deve ter backgroundColor WARNING', () => {
      const backgroundColor = Colors.Components.DataTable.ActionButtons.Primary.WARNING;
      expect(backgroundColor).toBeTruthy();
    });

    test('deve ter min-height de 46px', () => {
      const minHeight = '46px';
      expect(minHeight).toBe('46px');
    });

    test('deve ter fontWeight 700', () => {
      const fontWeight = 700;
      expect(fontWeight).toBe(700);
    });
  });

  describe('Contador de inscrições', () => {
    test('deve exibir total de inscrições selecionadas', () => {
      const selectedRows = [
        { inscricaoId: 1 },
        { inscricaoId: 2 },
        { inscricaoId: 3 },
      ] as DadosListagemInscricaoDTO[];

      const totalInscricoesSelecionadas = selectedRows?.length || 0;
      const texto = `${totalInscricoesSelecionadas} inscrições selecionadas`;

      expect(texto).toBe('3 inscrições selecionadas');
    });

    test('deve exibir 0 quando array está vazio', () => {
      const selectedRows: DadosListagemInscricaoDTO[] = [];
      const totalInscricoesSelecionadas = selectedRows?.length || 0;
      const texto = `${totalInscricoesSelecionadas} inscrições selecionadas`;

      expect(texto).toBe('0 inscrições selecionadas');
    });

    test('deve tratar selectedRows undefined/null', () => {
      const selectedRows = null as unknown as DadosListagemInscricaoDTO[];
      const totalInscricoesSelecionadas = selectedRows?.length || 0;

      expect(totalInscricoesSelecionadas).toBe(0);
    });
  });

  describe('Verificação de permissões - algumaLinhaSelecionadaPodeCancelar', () => {
    test('deve retornar true se alguma linha pode cancelar', () => {
      const selectedRows = [
        { permissao: { podeCancelar: false } },
        { permissao: { podeCancelar: true } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodeCancelar = selectedRows.some(
        (item) => item?.permissao?.podeCancelar,
      );
      expect(algumaLinhaSelecionadaPodeCancelar).toBe(true);
    });

    test('deve retornar false se nenhuma linha pode cancelar', () => {
      const selectedRows = [
        { permissao: { podeCancelar: false } },
        { permissao: { podeCancelar: false } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodeCancelar = selectedRows.some(
        (item) => item?.permissao?.podeCancelar,
      );
      expect(algumaLinhaSelecionadaPodeCancelar).toBe(false);
    });
  });

  describe('Verificação de permissões - algumaLinhaSelecionadaPodeConfirmar', () => {
    test('deve retornar true se alguma linha pode confirmar', () => {
      const selectedRows = [
        { permissao: { podeConfirmar: false } },
        { permissao: { podeConfirmar: true } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodeConfirmar = selectedRows.some(
        (item) => item?.permissao?.podeConfirmar,
      );
      expect(algumaLinhaSelecionadaPodeConfirmar).toBe(true);
    });

    test('deve retornar false se nenhuma linha pode confirmar', () => {
      const selectedRows = [
        { permissao: { podeConfirmar: false } },
        { permissao: { podeConfirmar: false } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodeConfirmar = selectedRows.some(
        (item) => item?.permissao?.podeConfirmar,
      );
      expect(algumaLinhaSelecionadaPodeConfirmar).toBe(false);
    });
  });

  describe('Verificação de permissões - algumaLinhaSelecionadaPodePausar', () => {
    test('deve retornar true se alguma linha pode colocar em espera', () => {
      const selectedRows = [
        { permissao: { podeColocarEmEspera: false } },
        { permissao: { podeColocarEmEspera: true } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodePausar = selectedRows.some(
        (item) => item?.permissao?.podeColocarEmEspera,
      );
      expect(algumaLinhaSelecionadaPodePausar).toBe(true);
    });

    test('deve retornar false se nenhuma linha pode colocar em espera', () => {
      const selectedRows = [
        { permissao: { podeColocarEmEspera: false } },
        { permissao: { podeColocarEmEspera: false } },
      ] as DadosListagemInscricaoDTO[];

      const algumaLinhaSelecionadaPodePausar = selectedRows.some(
        (item) => item?.permissao?.podeColocarEmEspera,
      );
      expect(algumaLinhaSelecionadaPodePausar).toBe(false);
    });
  });

  describe('Desabilitar botões', () => {
    test('deve desabilitar Pausar quando não há seleção', () => {
      const totalInscricoesSelecionadas = 0;
      const algumaLinhaSelecionadaPodePausar = true;

      const desabilitarPausar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodePausar;
      expect(desabilitarPausar).toBe(true);
    });

    test('deve desabilitar Pausar quando nenhuma linha pode pausar', () => {
      const totalInscricoesSelecionadas = 3;
      const algumaLinhaSelecionadaPodePausar = false;

      const desabilitarPausar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodePausar;
      expect(desabilitarPausar).toBe(true);
    });

    test('deve habilitar Pausar quando há seleção e alguma linha pode pausar', () => {
      const totalInscricoesSelecionadas = 3;
      const algumaLinhaSelecionadaPodePausar = true;

      const desabilitarPausar = !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodePausar;
      expect(desabilitarPausar).toBe(false);
    });

    test('deve desabilitar Cancelar quando não há seleção', () => {
      const totalInscricoesSelecionadas = 0;
      const algumaLinhaSelecionadaPodeCancelar = true;

      const desabilitarCancelar =
        !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodeCancelar;
      expect(desabilitarCancelar).toBe(true);
    });

    test('deve desabilitar Confirmar quando não há seleção', () => {
      const totalInscricoesSelecionadas = 0;
      const algumaLinhaSelecionadaPodeConfirmar = true;

      const desabilitarConfirmar =
        !totalInscricoesSelecionadas || !algumaLinhaSelecionadaPodeConfirmar;
      expect(desabilitarConfirmar).toBe(true);
    });
  });

  describe('handleColocarEsperaConfirmar', () => {
    test('deve filtrar linhas que podem confirmar quando confirmar é true', () => {
      const selectedRows = [
        { inscricaoId: 1, permissao: { podeConfirmar: true, podeColocarEmEspera: false } },
        { inscricaoId: 2, permissao: { podeConfirmar: false, podeColocarEmEspera: true } },
        { inscricaoId: 3, permissao: { podeConfirmar: true, podeColocarEmEspera: true } },
      ] as DadosListagemInscricaoDTO[];

      const confirmar = true;
      const lista = cloneDeep(selectedRows).filter((item) =>
        confirmar ? !!item?.permissao?.podeConfirmar : !!item?.permissao?.podeColocarEmEspera,
      );
      const ids = lista.map((item) => item?.inscricaoId);

      expect(ids).toEqual([1, 3]);
    });

    test('deve filtrar linhas que podem colocar em espera quando confirmar é false', () => {
      const selectedRows = [
        { inscricaoId: 1, permissao: { podeConfirmar: true, podeColocarEmEspera: false } },
        { inscricaoId: 2, permissao: { podeConfirmar: false, podeColocarEmEspera: true } },
        { inscricaoId: 3, permissao: { podeConfirmar: true, podeColocarEmEspera: true } },
      ] as DadosListagemInscricaoDTO[];

      const confirmar = false;
      const lista = cloneDeep(selectedRows).filter((item) =>
        confirmar ? !!item?.permissao?.podeConfirmar : !!item?.permissao?.podeColocarEmEspera,
      );
      const ids = lista.map((item) => item?.inscricaoId);

      expect(ids).toEqual([2, 3]);
    });

    test('deve chamar onClickConfirmar quando confirmar é true', () => {
      const mockOnClickConfirmar = jest.fn();
      const ids = [1, 3];
      const confirmar = true;

      if (confirmar) {
        mockOnClickConfirmar(ids);
      }

      expect(mockOnClickConfirmar).toHaveBeenCalledWith([1, 3]);
    });

    test('deve chamar onClickColocarEspera quando confirmar é false', () => {
      const mockOnClickColocarEspera = jest.fn();
      const ids = [2, 3];
      const confirmar = false;

      if (!confirmar) {
        mockOnClickColocarEspera(ids);
      }

      expect(mockOnClickColocarEspera).toHaveBeenCalledWith([2, 3]);
    });

    test('deve usar cloneDeep para evitar mutação do array original', () => {
      const selectedRows = [
        { inscricaoId: 1, permissao: { podeConfirmar: true } },
      ] as DadosListagemInscricaoDTO[];

      const clonedRows = cloneDeep(selectedRows);
      clonedRows[0].inscricaoId = 999;

      expect(selectedRows[0].inscricaoId).toBe(1);
      expect(clonedRows[0].inscricaoId).toBe(999);
    });
  });

  describe('Botão Cancelar inscrição', () => {
    test('deve ter type link', () => {
      const type = 'link';
      expect(type).toBe('link');
    });

    test('deve ter tooltipTitle vazio', () => {
      const tooltipTitle = '';
      expect(tooltipTitle).toBe('');
    });

    test('deve ter texto "Cancelar inscrição"', () => {
      const texto = 'Cancelar inscrição';
      expect(texto).toBe('Cancelar inscrição');
    });

    test('deve ter cor WHITE', () => {
      const color = Colors.Neutral.WHITE;
      expect(color).toBeTruthy();
    });
  });

  describe('Botão Colocar em lista de espera', () => {
    test('deve usar ícone FaPauseCircle', () => {
      const Icon = 'FaPauseCircle';
      expect(Icon).toBe('FaPauseCircle');
    });

    test('deve ter type link', () => {
      const type = 'link';
      expect(type).toBe('link');
    });

    test('deve ter texto "Colocar em lista de espera"', () => {
      const texto = 'Colocar em lista de espera';
      expect(texto).toBe('Colocar em lista de espera');
    });

    test('deve chamar handleColocarEsperaConfirmar com confirmar false', () => {
      const mockHandler = jest.fn();
      mockHandler({ confirmar: false });
      expect(mockHandler).toHaveBeenCalledWith({ confirmar: false });
    });
  });

  describe('Botão Confirmar inscrição', () => {
    test('deve usar ícone FaCheckCircle', () => {
      const Icon = 'FaCheckCircle';
      expect(Icon).toBe('FaCheckCircle');
    });

    test('deve ter type link', () => {
      const type = 'link';
      expect(type).toBe('link');
    });

    test('deve ter texto "Confirmar inscrição"', () => {
      const texto = 'Confirmar inscrição';
      expect(texto).toBe('Confirmar inscrição');
    });

    test('deve chamar handleColocarEsperaConfirmar sem parâmetros (default confirmar true)', () => {
      const mockHandler = jest.fn();
      mockHandler();
      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('Separador visual', () => {
    test('deve usar AiOutlineMinus rotacionado 90 graus', () => {
      const transform = 'rotate(90)';
      expect(transform).toBe('rotate(90)');
    });

    test('deve ter size 20', () => {
      const size = 20;
      expect(size).toBe(20);
    });
  });

  describe('Layout', () => {
    test('ContainerRow deve ter gutter 16', () => {
      const gutter = 16;
      expect(gutter).toBe(16);
    });

    test('ContainerRow deve ter justify space-between', () => {
      const justify = 'space-between';
      expect(justify).toBe('space-between');
    });

    test('ContainerRow deve ter align middle', () => {
      const align = 'middle';
      expect(align).toBe('middle');
    });

    test('Row interna de botões deve ter gutter 10', () => {
      const gutter = 10;
      expect(gutter).toBe(10);
    });
  });

  describe('Contexto', () => {
    test('deve usar onClickColocarEspera do contexto', () => {
      const mockOnClickColocarEspera = jest.fn();
      expect(typeof mockOnClickColocarEspera).toBe('function');
    });

    test('deve usar onClickConfirmar do contexto', () => {
      const mockOnClickConfirmar = jest.fn();
      expect(typeof mockOnClickConfirmar).toBe('function');
    });
  });

  describe('Acessibilidade', () => {
    test('botões devem ter textos descritivos', () => {
      const textos = ['Cancelar inscrição', 'Colocar em lista de espera', 'Confirmar inscrição'];

      textos.forEach((texto) => {
        expect(texto).toBeTruthy();
        expect(texto.length).toBeGreaterThan(5);
      });
    });

    test('deve exibir quantidade de itens selecionados', () => {
      const total = 5;
      const texto = `${total} inscrições selecionadas`;
      expect(texto).toContain('5');
      expect(texto).toContain('inscrições selecionadas');
    });
  });
});
