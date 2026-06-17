import { describe, test, expect } from '@jest/globals';
import { DeltaInscritosDTO } from '~/core/services/codaf-lista-presenca-service';

describe('CadastroListaPresencaCodaf - Regras de Negócio e Máquina de Estados', () => {

  describe('Conversores de Dados (Atividade Obrigatória)', () => {
    // Simulando as funções utilitárias puras do topo do arquivo
    const atividadeObrigatorioParaLetra = (valor: boolean | null | undefined): 'S' | 'N' | null => {
      if (valor === null || valor === undefined) return null;
      return valor ? 'S' : 'N';
    };

    const letraParaAtividadeObrigatorio = (atividade: string | null): boolean | null => {
      if (atividade === 'S') return true;
      if (atividade === 'N') return false;
      return null;
    };

    test('atividadeObrigatorioParaLetra: deve converter booleano para "S" ou "N"', () => {
      expect(atividadeObrigatorioParaLetra(true)).toBe('S');
      expect(atividadeObrigatorioParaLetra(false)).toBe('N');
      expect(atividadeObrigatorioParaLetra(null)).toBeNull();
      expect(atividadeObrigatorioParaLetra(undefined)).toBeNull();
    });

    test('letraParaAtividadeObrigatorio: deve converter "S" ou "N" para booleano', () => {
      expect(letraParaAtividadeObrigatorio('S')).toBe(true);
      expect(letraParaAtividadeObrigatorio('N')).toBe(false);
      expect(letraParaAtividadeObrigatorio(null)).toBeNull();
      expect(letraParaAtividadeObrigatorio('X')).toBeNull();
    });
  });

  describe('Lógica de Snapshot do Delta (Prevenção de Condição de Corrida)', () => {
    // Simulando a função interna deltasSaoIguais
    const deltasSaoIguais = (d1: DeltaInscritosDTO | null, d2: DeltaInscritosDTO | null) => {
      if (!d1 && !d2) return true;
      if (!d1 || !d2) return false;

      const idsNovos1 = [...d1.inscritosNovos.map((i) => i.id)].sort();
      const idsNovos2 = [...d2.inscritosNovos.map((i) => i.id)].sort();
      if (JSON.stringify(idsNovos1) !== JSON.stringify(idsNovos2)) return false;

      const idsRemovidos1 = [...d1.inscritosRemovidos.map((i) => i.id)].sort();
      const idsRemovidos2 = [...d2.inscritosRemovidos.map((i) => i.id)].sort();
      if (JSON.stringify(idsRemovidos1) !== JSON.stringify(idsRemovidos2)) return false;

      return true;
    };

    const mockDelta = (idsNovos: number[], idsRemovidos: number[]): DeltaInscritosDTO => ({
      houveAlteracao: true,
      totalNovos: idsNovos.length,
      totalRemovidos: idsRemovidos.length,
      inscritosNovos: idsNovos.map(id => ({ id, nome: 'A', documento: '1', percentualFrequencia: 100, conceitoFinal: 'S', atividadeObrigatorio: true, aprovado: true })),
      inscritosRemovidos: idsRemovidos.map(id => ({ id, nome: 'A', documento: '1' })),
    });

    test('deve retornar true se ambos os deltas forem nulos', () => {
      expect(deltasSaoIguais(null, null)).toBe(true);
    });

    test('deve retornar false se apenas um delta for nulo', () => {
      expect(deltasSaoIguais(mockDelta([1], []), null)).toBe(false);
      expect(deltasSaoIguais(null, mockDelta([1], []))).toBe(false);
    });

    test('deve retornar true para deltas com exatamente os mesmos IDs (mesmo em ordens diferentes)', () => {
      const d1 = mockDelta([1, 2], [3]);
      const d2 = mockDelta([2, 1], [3]); // Ordem invertida nos novos
      expect(deltasSaoIguais(d1, d2)).toBe(true);
    });

    test('deve retornar false se houver um ID novo diferente (Condição de Corrida detectada)', () => {
      const d1 = mockDelta([1, 2], []);
      const d2 = mockDelta([1, 2, 3], []); // Usuário 3 foi adicionado remotamente
      expect(deltasSaoIguais(d1, d2)).toBe(false);
    });

    test('deve retornar false se houver um ID removido diferente', () => {
      const d1 = mockDelta([], [10]);
      const d2 = mockDelta([], [10, 11]);
      expect(deltasSaoIguais(d1, d2)).toBe(false);
    });
  });

  describe('Máquina de Estados: Permissões, Visibilidade e Bloqueios', () => {
    // Fábrica para simular o comportamento exato do objeto `bloqueios` do seu componente
    const simularEstadoUI = (
      perfilNome: 'DF' | 'EMFORPEF' | 'Admin DF' | 'Cursista',
      status: number | null,
      modoEdicao: boolean,
      mostrarDivergencia: boolean,
      formValido: boolean
    ) => {
      const perfil = {
        df: perfilNome === 'DF',
        emforpef: perfilNome === 'EMFORPEF',
        admin: perfilNome === 'Admin DF',
        cursista: perfilNome === 'Cursista',
      };
      
      const ehAreaPromotora = !perfil.cursista && !perfil.admin;

      const situacao = {
        iniciado: status === 1,
        aguardandoDF: status === 2,
        devolvidoDF: status === 3,
        finalizado: status === 4,
      };

      const bloqueioDivergenciaSalvar = modoEdicao && (situacao.iniciado || situacao.aguardandoDF) && mostrarDivergencia;
      const bloqueioDivergenciaEnviarDF = modoEdicao && mostrarDivergencia;

      return {
        salvar: {
          visivel: (!situacao.aguardandoDF || (situacao.aguardandoDF && perfil.admin)) && !situacao.finalizado,
          bloqueado: situacao.finalizado || bloqueioDivergenciaSalvar,
        },
        enviarDF: {
          visivel: (situacao.iniciado || status === null || situacao.devolvidoDF) && ehAreaPromotora,
          bloqueado: situacao.finalizado || !!bloqueioDivergenciaEnviarDF,
        },
        devolver: {
          visivel: situacao.aguardandoDF && perfil.admin,
          bloqueado: !formValido || situacao.finalizado,
        }
      };
    };

    describe('Regras do Botão "Salvar"', () => {
      test('Deve ficar VISÍVEL para Área Promotora se status for Iniciado (1)', () => {
        const ui = simularEstadoUI('EMFORPEF', 1, true, false, true);
        expect(ui.salvar.visivel).toBe(true);
      });

      test('NÃO deve ficar visível para Área Promotora se status for Aguardando DF (2)', () => {
        const ui = simularEstadoUI('EMFORPEF', 2, true, false, true);
        expect(ui.salvar.visivel).toBe(false);
      });

      test('Deve ficar VISÍVEL para Admin se status for Aguardando DF (2)', () => {
        const ui = simularEstadoUI('Admin DF', 2, true, false, true);
        expect(ui.salvar.visivel).toBe(true);
      });

      test('Deve ficar BLOQUEADO se a turma estiver Finalizada (4)', () => {
        const ui = simularEstadoUI('DF', 4, true, false, true);
        expect(ui.salvar.visivel).toBe(false); // Já não fica visível
        expect(ui.salvar.bloqueado).toBe(true);
      });

      test('Deve ficar BLOQUEADO se houver divergência ativa em edição', () => {
        const ui = simularEstadoUI('EMFORPEF', 1, true, true, true);
        expect(ui.salvar.bloqueado).toBe(true);
      });
    });

    describe('Regras do Botão "Enviar para DF"', () => {
      test('Deve ficar VISÍVEL para Área Promotora se status for Iniciado (1)', () => {
        const ui = simularEstadoUI('EMFORPEF', 1, true, false, true);
        expect(ui.enviarDF.visivel).toBe(true);
      });

      test('Deve ficar VISÍVEL para Área Promotora se status for Devolvido (3)', () => {
        const ui = simularEstadoUI('EMFORPEF', 3, true, false, true);
        expect(ui.enviarDF.visivel).toBe(true);
      });

      test('NÃO deve ficar visível para Admin DF (Ação exclusiva de área promotora)', () => {
        const ui = simularEstadoUI('Admin DF', 1, true, false, true);
        expect(ui.enviarDF.visivel).toBe(false);
      });

      test('Deve ficar BLOQUEADO se houver divergência ativa', () => {
        const ui = simularEstadoUI('EMFORPEF', 1, true, true, true); // mostrarDivergencia = true
        expect(ui.enviarDF.bloqueado).toBe(true);
      });
    });

    describe('Regras do Botão "Devolver" (Correção)', () => {
      test('Deve ficar VISÍVEL e HABILITADO apenas para Admin se status for Aguardando DF (2) com formulário válido', () => {
        const ui = simularEstadoUI('Admin DF', 2, true, false, true);
        expect(ui.devolver.visivel).toBe(true);
        expect(ui.devolver.bloqueado).toBe(false);
      });

      test('Deve ficar BLOQUEADO se formulário estiver inválido', () => {
        const ui = simularEstadoUI('Admin DF', 2, true, false, false); // formValido = false
        expect(ui.devolver.visivel).toBe(true);
        expect(ui.devolver.bloqueado).toBe(true);
      });

      test('NÃO deve ficar visível para Área Promotora', () => {
        const ui = simularEstadoUI('EMFORPEF', 2, true, false, true);
        expect(ui.devolver.visivel).toBe(false);
      });
    });

  });
});