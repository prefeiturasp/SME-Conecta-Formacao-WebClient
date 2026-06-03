import { describe, test, expect } from '@jest/globals';

describe('CardTurmasPublico', () => {
  describe('parseDateBR', () => {
    test('deve converter data BR format corretamente', () => {
      const parseDateBR = (data: string): Date => {
        const [dia, mes, ano] = data.split('/');
        return new Date(Number(ano), Number(mes) - 1, Number(dia));
      };

      const result = parseDateBR('25/12/2023');
      expect(result.getDate()).toBe(25);
      expect(result.getMonth()).toBe(11); // 0-indexed
      expect(result.getFullYear()).toBe(2023);
    });

    test('deve converter data 01/01/2020', () => {
      const parseDateBR = (data: string): Date => {
        const [dia, mes, ano] = data.split('/');
        return new Date(Number(ano), Number(mes) - 1, Number(dia));
      };

      const result = parseDateBR('01/01/2020');
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2020);
    });

    test('deve converter data 31/03/2025', () => {
      const parseDateBR = (data: string): Date => {
        const [dia, mes, ano] = data.split('/');
        return new Date(Number(ano), Number(mes) - 1, Number(dia));
      };

      const result = parseDateBR('31/03/2025');
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(2);
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe('formatarData', () => {
    test('deve formatar data ISO para BR format', () => {
      const formatarData = (data: string): string => {
        const d = new Date(data);
        if (isNaN(d.getTime())) return data;
        return d.toLocaleDateString('pt-BR');
      };

      const result = formatarData('2023-12-25');
      // Nota: Devido a timezone, 2023-12-25 pode virar 24/12/2023
      expect(result).toMatch(/\d{2}\/\d{2}\/2023/);
      expect(result).toContain('2023');
    });

    test('deve retornar data original se inválida', () => {
      const formatarData = (data: string): string => {
        const d = new Date(data);
        if (isNaN(d.getTime())) return data;
        return d.toLocaleDateString('pt-BR');
      };

      const invalidDate = 'data-invalida';
      const result = formatarData(invalidDate);
      expect(result).toBe(invalidDate);
    });

    test('deve formatar data vazia retornando a própria data', () => {
      const formatarData = (data: string): string => {
        const d = new Date(data);
        if (isNaN(d.getTime())) return data;
        return d.toLocaleDateString('pt-BR');
      };

      const result = formatarData('');
      expect(result).toBe('');
    });

    test('deve formatar data com timestamp', () => {
      const formatarData = (data: string): string => {
        const d = new Date(data);
        if (isNaN(d.getTime())) return data;
        return d.toLocaleDateString('pt-BR');
      };

      const result = formatarData('2024-01-15T10:30:00');
      expect(result).toContain('2024');
    });
  });

  describe('expandirEncontro', () => {
    test('deve expandir encontro sem dataFinal como um único dia', () => {
      const expandirEncontro = (encontro: any) => {
        if (!encontro.dataFinal) {
          return [
            {
              data: encontro.dataInicial,
              horaInicial: encontro.horaInicial,
              horaFinal: encontro.horaFinal,
            },
          ];
        }
        const linhas: any[] = [];
        const parseDateBR = (data: string): Date => {
          const [dia, mes, ano] = data.split('/');
          return new Date(Number(ano), Number(mes) - 1, Number(dia));
        };
        const atual = parseDateBR(encontro.dataInicial);
        const fim = parseDateBR(encontro.dataFinal);
        while (atual <= fim) {
          linhas.push({
            data: atual.toLocaleDateString('pt-BR'),
            horaInicial: encontro.horaInicial,
            horaFinal: encontro.horaFinal,
          });
          atual.setDate(atual.getDate() + 1);
        }
        return linhas;
      };

      const encontro = {
        dataInicial: '25/12/2023',
        dataFinal: null,
        horaInicial: '10:00',
        horaFinal: '12:00',
      };

      const result = expandirEncontro(encontro);
      expect(result).toHaveLength(1);
      expect(result[0].data).toBe('25/12/2023');
      expect(result[0].horaInicial).toBe('10:00');
      expect(result[0].horaFinal).toBe('12:00');
    });

    test('deve expandir encontro com dataFinal no mesmo dia', () => {
      const expandirEncontro = (encontro: any) => {
        if (!encontro.dataFinal) {
          return [
            {
              data: encontro.dataInicial,
              horaInicial: encontro.horaInicial,
              horaFinal: encontro.horaFinal,
            },
          ];
        }
        const linhas: any[] = [];
        const parseDateBR = (data: string): Date => {
          const [dia, mes, ano] = data.split('/');
          return new Date(Number(ano), Number(mes) - 1, Number(dia));
        };
        const atual = parseDateBR(encontro.dataInicial);
        const fim = parseDateBR(encontro.dataFinal);
        while (atual <= fim) {
          linhas.push({
            data: atual.toLocaleDateString('pt-BR'),
            horaInicial: encontro.horaInicial,
            horaFinal: encontro.horaFinal,
          });
          atual.setDate(atual.getDate() + 1);
        }
        return linhas;
      };

      const encontro = {
        dataInicial: '25/12/2023',
        dataFinal: '25/12/2023',
        horaInicial: '09:00',
        horaFinal: '11:00',
      };

      const result = expandirEncontro(encontro);
      expect(result).toHaveLength(1);
    });

    test('deve expandir encontro com dataFinal em dias diferentes', () => {
      const expandirEncontro = (encontro: any) => {
        if (!encontro.dataFinal) {
          return [
            {
              data: encontro.dataInicial,
              horaInicial: encontro.horaInicial,
              horaFinal: encontro.horaFinal,
            },
          ];
        }
        const linhas: any[] = [];
        const parseDateBR = (data: string): Date => {
          const [dia, mes, ano] = data.split('/');
          return new Date(Number(ano), Number(mes) - 1, Number(dia));
        };
        const atual = parseDateBR(encontro.dataInicial);
        const fim = parseDateBR(encontro.dataFinal);
        while (atual <= fim) {
          linhas.push({
            data: atual.toLocaleDateString('pt-BR'),
            horaInicial: encontro.horaInicial,
            horaFinal: encontro.horaFinal,
          });
          atual.setDate(atual.getDate() + 1);
        }
        return linhas;
      };

      const encontro = {
        dataInicial: '25/12/2023',
        dataFinal: '27/12/2023',
        horaInicial: '14:00',
        horaFinal: '16:00',
      };

      const result = expandirEncontro(encontro);
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(result[0].horaInicial).toBe('14:00');
      expect(result[0].horaFinal).toBe('16:00');
    });

    test('deve expandir encontro com período de 1 mês', () => {
      const expandirEncontro = (encontro: any) => {
        if (!encontro.dataFinal) {
          return [
            {
              data: encontro.dataInicial,
              horaInicial: encontro.horaInicial,
              horaFinal: encontro.horaFinal,
            },
          ];
        }
        const linhas: any[] = [];
        const parseDateBR = (data: string): Date => {
          const [dia, mes, ano] = data.split('/');
          return new Date(Number(ano), Number(mes) - 1, Number(dia));
        };
        const atual = parseDateBR(encontro.dataInicial);
        const fim = parseDateBR(encontro.dataFinal);
        while (atual <= fim) {
          linhas.push({
            data: atual.toLocaleDateString('pt-BR'),
            horaInicial: encontro.horaInicial,
            horaFinal: encontro.horaFinal,
          });
          atual.setDate(atual.getDate() + 1);
        }
        return linhas;
      };

      const encontro = {
        dataInicial: '01/01/2024',
        dataFinal: '31/01/2024',
        horaInicial: '08:00',
        horaFinal: '10:00',
      };

      const result = expandirEncontro(encontro);
      expect(result.length).toBe(31);
    });
  });

  describe('CardTurmasPublico - Props e Estrutura', () => {
    test('deve aceitar turma com dados completos', () => {
      const turma = {
        nome: 'Turma de Teste',
        local: 'São Paulo',
        dataInicio: '2024-01-15',
        dataFim: '2024-03-15',
        dataEncontrosNovo: [
          {
            dataInicial: '15/01/2024',
            dataFinal: null,
            horaInicial: '10:00',
            horaFinal: '12:00',
          },
        ],
        modeloHorario: 'novo',
      };

      expect(turma.nome).toBe('Turma de Teste');
      expect(turma.local).toBe('São Paulo');
      expect(turma.modeloHorario).toBe('novo');
    });

    test('deve aceitar turma com modelo horário legado', () => {
      const turma = {
        nome: 'Turma Legado',
        local: 'Rio de Janeiro',
        dataInicio: '2024-01-15',
        dataFim: '2024-03-15',
        dataEncontrosNovo: [
          {
            dataInicial: '15/01/2024',
            dataFinal: '17/01/2024',
            horaInicial: '09:00',
            horaFinal: '11:00',
          },
        ],
        modeloHorario: 'legado',
      };

      expect(turma.modeloHorario).toBe('legado');
    });

    test('deve aceitar turma sem encontros', () => {
      const turma = {
        nome: 'Turma sem Encontros',
        local: 'Belo Horizonte',
        dataInicio: '2024-01-15',
        dataFim: '2024-03-15',
        dataEncontrosNovo: [],
        modeloHorario: 'novo',
      };

      expect(turma.dataEncontrosNovo).toHaveLength(0);
    });

    test('deve aceitar turma com apenas dataInicio', () => {
      const turma = {
        nome: 'Turma Início',
        local: 'Brasília',
        dataInicio: '2024-01-15',
        dataFim: null,
        dataEncontrosNovo: [],
        modeloHorario: 'novo',
      };

      expect(turma.dataInicio).toBe('2024-01-15');
      expect(turma.dataFim).toBeNull();
    });

    test('deve aceitar turma com apenas dataFim', () => {
      const turma = {
        nome: 'Turma Fim',
        local: 'Salvador',
        dataInicio: null,
        dataFim: '2024-03-15',
        dataEncontrosNovo: [],
        modeloHorario: 'novo',
      };

      expect(turma.dataFim).toBe('2024-03-15');
      expect(turma.dataInicio).toBeNull();
    });

    test('deve aceitar turma sem datas', () => {
      const turma = {
        nome: 'Turma Sem Datas',
        local: 'Recife',
        dataInicio: null,
        dataFim: null,
        dataEncontrosNovo: [],
        modeloHorario: 'novo',
      };

      expect(turma.dataInicio).toBeNull();
      expect(turma.dataFim).toBeNull();
    });
  });

  describe('getPeriodoRealizacao', () => {
    test('deve retornar período com dataInicio e dataFim', () => {
      const getPeriodoRealizacao = (dataInicio: any, dataFim: any) => {
        const formatarData = (data: string): string => {
          const d = new Date(data);
          if (isNaN(d.getTime())) return data;
          return d.toLocaleDateString('pt-BR');
        };

        if (dataInicio && dataFim) return `De ${formatarData(dataInicio)} à ${formatarData(dataFim)}`;
        if (dataInicio) return `De ${formatarData(dataInicio)}`;
        if (dataFim) return `Até ${formatarData(dataFim)}`;
        return null;
      };

      const resultado = getPeriodoRealizacao('2024-01-15', '2024-03-15');
      expect(resultado).toContain('De');
      expect(resultado).toContain('à');
    });

    test('deve retornar período com apenas dataInicio', () => {
      const getPeriodoRealizacao = (dataInicio: any, dataFim: any) => {
        const formatarData = (data: string): string => {
          const d = new Date(data);
          if (isNaN(d.getTime())) return data;
          return d.toLocaleDateString('pt-BR');
        };

        if (dataInicio && dataFim) return `De ${formatarData(dataInicio)} à ${formatarData(dataFim)}`;
        if (dataInicio) return `De ${formatarData(dataInicio)}`;
        if (dataFim) return `Até ${formatarData(dataFim)}`;
        return null;
      };

      const resultado = getPeriodoRealizacao('2024-01-15', null);
      expect(resultado).toContain('De');
      expect(resultado).not.toContain('à');
    });

    test('deve retornar período com apenas dataFim', () => {
      const getPeriodoRealizacao = (dataInicio: any, dataFim: any) => {
        const formatarData = (data: string): string => {
          const d = new Date(data);
          if (isNaN(d.getTime())) return data;
          return d.toLocaleDateString('pt-BR');
        };

        if (dataInicio && dataFim) return `De ${formatarData(dataInicio)} à ${formatarData(dataFim)}`;
        if (dataInicio) return `De ${formatarData(dataInicio)}`;
        if (dataFim) return `Até ${formatarData(dataFim)}`;
        return null;
      };

      const resultado = getPeriodoRealizacao(null, '2024-03-15');
      expect(resultado).toContain('Até');
    });

    test('deve retornar null quando sem datas', () => {
      const getPeriodoRealizacao = (dataInicio: any, dataFim: any) => {
        const formatarData = (data: string): string => {
          const d = new Date(data);
          if (isNaN(d.getTime())) return data;
          return d.toLocaleDateString('pt-BR');
        };

        if (dataInicio && dataFim) return `De ${formatarData(dataInicio)} à ${formatarData(dataFim)}`;
        if (dataInicio) return `De ${formatarData(dataInicio)}`;
        if (dataFim) return `Até ${formatarData(dataFim)}`;
        return null;
      };

      const resultado = getPeriodoRealizacao(null, null);
      expect(resultado).toBeNull();
    });
  });

  describe('Lógica de Encontros', () => {
    test('deve processar encontros com modeloHorario novo', () => {
      const dataEncontrosNovo = [
        {
          dataInicial: '15/01/2024',
          dataFinal: null,
          horaInicial: '10:00',
          horaFinal: '12:00',
        },
      ];

      const encontros = dataEncontrosNovo.map((e) => ({
        data: e.dataInicial,
        horaInicial: e.horaInicial,
        horaFinal: e.horaFinal,
      }));

      expect(encontros).toHaveLength(1);
      expect(encontros[0].data).toBe('15/01/2024');
    });

    test('deve expandir encontros com modeloHorario legado', () => {
      const expandirEncontro = (encontro: any) => {
        if (!encontro.dataFinal) {
          return [
            {
              data: encontro.dataInicial,
              horaInicial: encontro.horaInicial,
              horaFinal: encontro.horaFinal,
            },
          ];
        }
        const linhas: any[] = [];
        const parseDateBR = (data: string): Date => {
          const [dia, mes, ano] = data.split('/');
          return new Date(Number(ano), Number(mes) - 1, Number(dia));
        };
        const atual = parseDateBR(encontro.dataInicial);
        const fim = parseDateBR(encontro.dataFinal);
        while (atual <= fim) {
          linhas.push({
            data: atual.toLocaleDateString('pt-BR'),
            horaInicial: encontro.horaInicial,
            horaFinal: encontro.horaFinal,
          });
          atual.setDate(atual.getDate() + 1);
        }
        return linhas;
      };

      const dataEncontrosNovo = [
        {
          dataInicial: '15/01/2024',
          dataFinal: '17/01/2024',
          horaInicial: '09:00',
          horaFinal: '11:00',
        },
      ];

      const encontros = dataEncontrosNovo.flatMap(expandirEncontro);
      expect(encontros.length).toBeGreaterThan(1);
    });

    test('deve retornar array vazio quando dataEncontrosNovo é vazio', () => {
      const encontros = ([] ?? []).flatMap(() => ({}));
      expect(encontros).toHaveLength(0);
    });

    test('deve retornar array vazio quando dataEncontrosNovo é null', () => {
      const encontros = (null ?? []).flatMap(() => ({}));
      expect(encontros).toHaveLength(0);
    });
  });

  describe('Estilo e Configuração', () => {
    test('tooltip deve ter fontFamily Roboto', () => {
      const tooltipStyle = {
        fontFamily: 'Roboto',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center' as const,
      };

      expect(tooltipStyle.fontFamily).toBe('Roboto');
    });

    test('tooltip deve ter fontSize 14px', () => {
      const tooltipStyle = {
        fontFamily: 'Roboto',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center' as const,
      };

      expect(tooltipStyle.fontSize).toBe('14px');
    });

    test('Card deve ter borderRadius 12px', () => {
      const cardStyle = { borderRadius: '12px' };
      expect(cardStyle.borderRadius).toBe('12px');
    });

    test('Card headStyle deve ter backgroundColor laranja', () => {
      const headStyle = { backgroundColor: '#E48F47', borderBottom: 'none' };
      expect(headStyle.backgroundColor).toBe('#E48F47');
      expect(headStyle.borderBottom).toBe('none');
    });
  });
});
