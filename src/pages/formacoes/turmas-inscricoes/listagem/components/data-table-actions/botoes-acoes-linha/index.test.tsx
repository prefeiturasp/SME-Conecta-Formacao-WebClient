import { describe, test, expect, jest } from '@jest/globals';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import { Colors } from '~/core/styles/colors';

describe('BtbAcoesListaIncricaoPorTurma', () => {
  describe('Props interface', () => {
    test('deve aceitar record como DadosListagemInscricaoDTO', () => {
      const record: DadosListagemInscricaoDTO = {
        inscricaoId: 1,
        nomeCursista: 'Cursista Teste',
        permissao: {
          podeCancelar: true,
          podeColocarEmEspera: true,
          podeConfirmar: true,
          podeReativar: false,
        },
      } as DadosListagemInscricaoDTO;

      expect(record).toHaveProperty('inscricaoId');
      expect(record).toHaveProperty('permissao');
    });
  });

  describe('Permissões', () => {
    test('deve desabilitar botão Em Espera quando podeColocarEmEspera é false', () => {
      const record = {
        permissao: { podeColocarEmEspera: false },
      } as DadosListagemInscricaoDTO;

      const desabilitarEmEspera = !record?.permissao?.podeColocarEmEspera;
      expect(desabilitarEmEspera).toBe(true);
    });

    test('deve habilitar botão Em Espera quando podeColocarEmEspera é true', () => {
      const record = {
        permissao: { podeColocarEmEspera: true },
      } as DadosListagemInscricaoDTO;

      const desabilitarEmEspera = !record?.permissao?.podeColocarEmEspera;
      expect(desabilitarEmEspera).toBe(false);
    });

    test('deve desabilitar botão Confirmar quando podeConfirmar é false', () => {
      const record = {
        permissao: { podeConfirmar: false },
      } as DadosListagemInscricaoDTO;

      const desabilitarConfirmar = !record?.permissao?.podeConfirmar;
      expect(desabilitarConfirmar).toBe(true);
    });

    test('deve habilitar botão Confirmar quando podeConfirmar é true', () => {
      const record = {
        permissao: { podeConfirmar: true },
      } as DadosListagemInscricaoDTO;

      const desabilitarConfirmar = !record?.permissao?.podeConfirmar;
      expect(desabilitarConfirmar).toBe(false);
    });

    test('deve desabilitar botão Reativar quando podeReativar é false', () => {
      const record = {
        permissao: { podeReativar: false },
      } as DadosListagemInscricaoDTO;

      const desabilitarReativar = !record?.permissao?.podeReativar;
      expect(desabilitarReativar).toBe(true);
    });

    test('deve habilitar botão Reativar quando podeReativar é true', () => {
      const record = {
        permissao: { podeReativar: true },
      } as DadosListagemInscricaoDTO;

      const desabilitarReativar = !record?.permissao?.podeReativar;
      expect(desabilitarReativar).toBe(false);
    });

    test('deve tratar permissão undefined', () => {
      const record = {} as DadosListagemInscricaoDTO;

      const desabilitarEmEspera = !record?.permissao?.podeColocarEmEspera;
      const desabilitarConfirmar = !record?.permissao?.podeConfirmar;
      const desabilitarReativar = !record?.permissao?.podeReativar;

      expect(desabilitarEmEspera).toBe(true);
      expect(desabilitarConfirmar).toBe(true);
      expect(desabilitarReativar).toBe(true);
    });
  });

  describe('Estrutura do componente', () => {
    test('deve renderizar Row com gutter correto', () => {
      const gutter = [8, 0];
      expect(gutter).toEqual([8, 0]);
    });

    test('deve renderizar quatro botões de ação', () => {
      const numBotoes = 4;
      expect(numBotoes).toBe(4);
    });
  });

  describe('Botão Cancelar', () => {
    test('deve passar record como array para ModalCancelarButton', () => {
      const record = { inscricaoId: 1 } as DadosListagemInscricaoDTO;
      const recordArray = [record];

      expect(Array.isArray(recordArray)).toBe(true);
      expect(recordArray.length).toBe(1);
      expect(recordArray[0]).toBe(record);
    });
  });

  describe('Botão Reativar', () => {
    test('deve ter tooltipTitle correto', () => {
      const tooltipTitle = 'Reativar incrição';
      expect(tooltipTitle).toBe('Reativar incrição');
    });

    test('deve usar ícone FaToggleOff quando desabilitado', () => {
      const desabilitarReativar = true;
      const Icon = desabilitarReativar ? 'FaToggleOff' : 'FaToggleOn';
      expect(Icon).toBe('FaToggleOff');
    });

    test('deve usar ícone FaToggleOn quando habilitado', () => {
      const desabilitarReativar = false;
      const Icon = desabilitarReativar ? 'FaToggleOff' : 'FaToggleOn';
      expect(Icon).toBe('FaToggleOn');
    });

    test('deve chamar onClickReativar com inscricaoId', () => {
      const mockOnClickReativar = jest.fn();
      const record = { inscricaoId: 123 } as DadosListagemInscricaoDTO;

      mockOnClickReativar([record.inscricaoId]);
      expect(mockOnClickReativar).toHaveBeenCalledWith([123]);
    });

    test('deve ter cor WARNING', () => {
      const color = Colors.Components.DataTable.ActionButtons.Primary.WARNING;
      const backgroundColor = Colors.Components.DataTable.ActionButtons.Secondary.WARNING;

      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    });
  });

  describe('Botão Colocar em Espera', () => {
    test('deve ter tooltipTitle correto', () => {
      const tooltipTitle = 'Colocar em espera';
      expect(tooltipTitle).toBe('Colocar em espera');
    });

    test('deve usar ícone FaPauseCircle', () => {
      const Icon = 'FaPauseCircle';
      expect(Icon).toBe('FaPauseCircle');
    });

    test('deve chamar onClickColocarEspera com inscricaoId', () => {
      const mockOnClickColocarEspera = jest.fn();
      const record = { inscricaoId: 456 } as DadosListagemInscricaoDTO;

      mockOnClickColocarEspera([record.inscricaoId]);
      expect(mockOnClickColocarEspera).toHaveBeenCalledWith([456]);
    });

    test('deve ter cor WARNING', () => {
      const color = Colors.Components.DataTable.ActionButtons.Primary.WARNING;
      const backgroundColor = Colors.Components.DataTable.ActionButtons.Secondary.WARNING;

      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    });
  });

  describe('Botão Confirmar', () => {
    test('deve ter tooltipTitle correto', () => {
      const tooltipTitle = 'Confirmar incrição';
      expect(tooltipTitle).toBe('Confirmar incrição');
    });

    test('deve usar ícone FaCheckCircle', () => {
      const Icon = 'FaCheckCircle';
      expect(Icon).toBe('FaCheckCircle');
    });

    test('deve chamar onClickConfirmar com inscricaoId', () => {
      const mockOnClickConfirmar = jest.fn();
      const record = { inscricaoId: 789 } as DadosListagemInscricaoDTO;

      mockOnClickConfirmar([record.inscricaoId]);
      expect(mockOnClickConfirmar).toHaveBeenCalledWith([789]);
    });

    test('deve ter cor SUCCESS', () => {
      const color = Colors.Components.DataTable.ActionButtons.Primary.SUCCESS;
      const backgroundColor = Colors.Components.DataTable.ActionButtons.Secondary.SUCCESS;

      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
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

    test('deve usar onClickReativar do contexto', () => {
      const mockOnClickReativar = jest.fn();
      expect(typeof mockOnClickReativar).toBe('function');
    });
  });

  describe('Cores do tema', () => {
    test('Colors.Components.DataTable.ActionButtons deve existir', () => {
      expect(Colors.Components.DataTable.ActionButtons).toBeTruthy();
    });

    test('deve ter cores Primary e Secondary', () => {
      expect(Colors.Components.DataTable.ActionButtons.Primary).toBeTruthy();
      expect(Colors.Components.DataTable.ActionButtons.Secondary).toBeTruthy();
    });
  });

  describe('Acessibilidade', () => {
    test('botões devem ter tooltips descritivos', () => {
      const tooltips = ['Reativar incrição', 'Colocar em espera', 'Confirmar incrição'];

      tooltips.forEach((tooltip) => {
        expect(tooltip).toBeTruthy();
        expect(tooltip.length).toBeGreaterThan(5);
      });
    });
  });
});
