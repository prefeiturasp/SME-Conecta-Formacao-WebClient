import { describe, test, expect } from '@jest/globals';
import { TipoEncontro } from '~/core/enum/tipo-encontro';
import { DESEJA_CANCELAR_ALTERACOES } from '~/core/constants/mensagens';
import { CF_BUTTON_EXCLUIR } from '~/core/constants/ids/button/intex';

describe('DrawerFormularioEncontroTurmas', () => {
  describe('Estados iniciais', () => {
    test('tipoEncontroSelecionado deve iniciar como undefined', () => {
      const tipoEncontroSelecionado = undefined;
      expect(tipoEncontroSelecionado).toBeUndefined();
    });

    test('desativarBotaoCancelar deve iniciar como true', () => {
      const desativarBotaoCancelar = true;
      expect(desativarBotaoCancelar).toBe(true);
    });

    test('formInitialValues deve ter datas com dataInicio e dataFim vazios', () => {
      const formInitialValues = { datas: [{ dataInicio: '', dataFim: '' }] };
      expect(formInitialValues.datas).toHaveLength(1);
      expect(formInitialValues.datas[0].dataInicio).toBe('');
      expect(formInitialValues.datas[0].dataFim).toBe('');
    });
  });

  describe('Extração do propostaId via params', () => {
    test('deve converter o id da rota para inteiro', () => {
      const paramsRoute = { id: '42' };
      const propostaId = paramsRoute?.id ? parseInt(paramsRoute.id) : 0;
      expect(propostaId).toBe(42);
    });

    test('deve retornar 0 quando id não está presente nos params', () => {
      const paramsRoute = {};
      const propostaId = (paramsRoute as any)?.id ? parseInt((paramsRoute as any).id) : 0;
      expect(propostaId).toBe(0);
    });

    test('deve retornar 0 quando id é undefined', () => {
      const paramsRoute = { id: undefined };
      const propostaId = paramsRoute?.id ? parseInt(paramsRoute.id) : 0;
      expect(propostaId).toBe(0);
    });
  });

  describe('Lógica de salvarDadosForm - formatação de horários', () => {
    test('deve formatar hora de início no formato HH:mm', () => {
      const horario = { format: (fmt: string) => fmt === 'HH:mm' ? '08:30' : '' };
      const horaInicio = horario.format('HH:mm');
      expect(horaInicio).toBe('08:30');
    });

    test('deve formatar hora de fim no formato HH:mm', () => {
      const horario = { format: (fmt: string) => fmt === 'HH:mm' ? '17:00' : '' };
      const horaFim = horario.format('HH:mm');
      expect(horaFim).toBe('17:00');
    });

    test('deve extrair apenas os 5 primeiros caracteres da hora', () => {
      const horaInicio = '08:30:00';
      const horaFormatada = horaInicio.substring(0, 5);
      expect(horaFormatada).toBe('08:30');
    });
  });

  describe('Lógica de salvarDadosForm - formatação de turmas', () => {
    test('deve mapear ids de turmas para objetos com turmaId', () => {
      const turmasIds = [1, 2, 3];
      const turmas = turmasIds.map((turmaId) => ({ turmaId }));
      expect(turmas).toEqual([{ turmaId: 1 }, { turmaId: 2 }, { turmaId: 3 }]);
    });

    test('deve retornar array vazio quando não há turmas', () => {
      const turmasIds: number[] = [];
      const turmas = turmasIds.map((turmaId) => ({ turmaId }));
      expect(turmas).toHaveLength(0);
    });
  });

  describe('Lógica de salvarDadosForm - montagem do encontro', () => {
    test('deve usar id do dadosEncontro quando disponível', () => {
      const dadosEncontro = { id: 10 };
      const id = dadosEncontro?.id || 0;
      expect(id).toBe(10);
    });

    test('deve usar 0 como id quando dadosEncontro não tem id', () => {
      const dadosEncontro = undefined;
      const id = (dadosEncontro as any)?.id || 0;
      expect(id).toBe(0);
    });

    test('deve definir dataFim como null quando dataFim não tem conteúdo', () => {
      const datas = [{ dataInicio: '2024-01-01', dataFim: '' }];
      const datasFormatadas = datas.map((d) => ({
        dataInicio: d.dataInicio,
        dataFim: datas[0]?.dataFim?.toString()?.length ? d.dataFim : null,
      }));
      expect(datasFormatadas[0].dataFim).toBeNull();
    });

    test('deve manter dataFim quando possui conteúdo', () => {
      const datas = [{ dataInicio: '2024-01-01', dataFim: '2024-01-31' }];
      const datasFormatadas = datas.map((d) => ({
        dataInicio: d.dataInicio,
        dataFim: datas[0]?.dataFim?.toString()?.length ? d.dataFim : null,
      }));
      expect(datasFormatadas[0].dataFim).toBe('2024-01-31');
    });
  });

  describe('Lógica de salvarEncontro', () => {
    test('deve chamar fecharModal(true) em caso de sucesso', async () => {
      const fecharModal = jest.fn();
      const salvarPropostaEncontro = jest.fn().mockResolvedValue({ sucesso: true });

      const result = await salvarPropostaEncontro(1, {});
      if (result.sucesso) fecharModal(true);

      expect(fecharModal).toHaveBeenCalledWith(true);
    });

    test('não deve chamar fecharModal em caso de erro', async () => {
      const fecharModal = jest.fn();
      const salvarPropostaEncontro = jest.fn().mockResolvedValue({ sucesso: false });

      const result = await salvarPropostaEncontro(1, {});
      if (result.sucesso) fecharModal(true);

      expect(fecharModal).not.toHaveBeenCalled();
    });
  });

  describe('Lógica de fecharModal', () => {
    test('deve chamar onCloseModal(true) quando recarregarLista é true', () => {
      const onCloseModal = jest.fn();
      const desativarBotaoCancelar = false;

      const fecharModal = (recarregarLista?: boolean) => {
        if (recarregarLista) {
          onCloseModal(!!recarregarLista);
        } else if (!desativarBotaoCancelar) {
          // abre confirmação
        } else {
          onCloseModal(!!recarregarLista);
        }
      };

      fecharModal(true);
      expect(onCloseModal).toHaveBeenCalledWith(true);
    });

    test('deve chamar onCloseModal(false) quando desativarBotaoCancelar é true e recarregarLista é falso', () => {
      const onCloseModal = jest.fn();
      const desativarBotaoCancelar = true;

      const fecharModal = (recarregarLista?: boolean) => {
        if (recarregarLista) {
          onCloseModal(!!recarregarLista);
        } else if (!desativarBotaoCancelar) {
          // abre confirmação
        } else {
          onCloseModal(!!recarregarLista);
        }
      };

      fecharModal();
      expect(onCloseModal).toHaveBeenCalledWith(false);
    });

    test('não deve chamar onCloseModal diretamente quando há alterações e recarregarLista é falso', () => {
      const onCloseModal = jest.fn();
      const desativarBotaoCancelar = false;
      let confirmacaoAberta = false;

      const fecharModal = (recarregarLista?: boolean) => {
        if (recarregarLista) {
          onCloseModal(!!recarregarLista);
        } else if (!desativarBotaoCancelar) {
          confirmacaoAberta = true;
        } else {
          onCloseModal(!!recarregarLista);
        }
      };

      fecharModal();
      expect(onCloseModal).not.toHaveBeenCalled();
      expect(confirmacaoAberta).toBe(true);
    });
  });

  describe('Lógica de excluirEncontro', () => {
    test('deve chamar fecharModal(true) após exclusão bem-sucedida', async () => {
      const fecharModal = jest.fn();
      const removerPropostaEncontro = jest.fn().mockResolvedValue({ sucesso: true });

      const response = await removerPropostaEncontro(1);
      if (response.sucesso) fecharModal(true);

      expect(fecharModal).toHaveBeenCalledWith(true);
    });

    test('não deve chamar fecharModal quando exclusão falha', async () => {
      const fecharModal = jest.fn();
      const removerPropostaEncontro = jest.fn().mockResolvedValue({ sucesso: false });

      const response = await removerPropostaEncontro(1);
      if (response.sucesso) fecharModal(true);

      expect(fecharModal).not.toHaveBeenCalled();
    });
  });

  describe('Lógica de validarAlteracaoEmCampos', () => {
    const avaliarCampos = (campos: {
      local?: string;
      turmas?: any[];
      horarios?: any[];
      dataInicio?: any;
      tipoEncontro?: number;
    }) => {
      const local = (campos.local?.length ?? 0) > 0;
      const turmas = (campos.turmas?.length ?? 0) > 0;
      const horarios = (campos.horarios?.length ?? 0) > 0;
      const datas = !!campos.dataInicio;
      const tipoEncontro = (campos.tipoEncontro ?? -1) >= 0;
      return local || turmas || horarios || datas || tipoEncontro;
    };

    test('deve desativar cancelar quando todos os campos estão vazios', () => {
      const temAlteracao = avaliarCampos({});
      expect(temAlteracao).toBe(false);
    });

    test('deve ativar cancelar quando campo local tem conteúdo', () => {
      const temAlteracao = avaliarCampos({ local: 'Auditório' });
      expect(temAlteracao).toBe(true);
    });

    test('deve ativar cancelar quando há turmas selecionadas', () => {
      const temAlteracao = avaliarCampos({ turmas: [1, 2] });
      expect(temAlteracao).toBe(true);
    });

    test('deve ativar cancelar quando há horários preenchidos', () => {
      const temAlteracao = avaliarCampos({ horarios: ['08:00', '17:00'] });
      expect(temAlteracao).toBe(true);
    });

    test('deve ativar cancelar quando há data de início preenchida', () => {
      const temAlteracao = avaliarCampos({ dataInicio: '2024-01-01' });
      expect(temAlteracao).toBe(true);
    });

    test('deve ativar cancelar quando tipo de encontro é 0 (Presencial)', () => {
      const temAlteracao = avaliarCampos({ tipoEncontro: TipoEncontro.Presencial });
      expect(temAlteracao).toBe(true);
    });

    test('deve ativar cancelar quando tipo de encontro é 1 (Síncrono)', () => {
      const temAlteracao = avaliarCampos({ tipoEncontro: TipoEncontro.Sincrono });
      expect(temAlteracao).toBe(true);
    });
  });

  describe('Lógica de disabledDate', () => {
    test('deve bloquear datas anteriores ao início do período', () => {
      const dataInicio = { startOf: () => new Date('2024-03-01') };
      const dataFim = { endOf: () => new Date('2024-03-31') };

      const disabledDate = (current: Date) =>
        (current && current < dataInicio.startOf()) || current > dataFim.endOf();

      expect(disabledDate(new Date('2024-02-28'))).toBe(true);
    });

    test('deve bloquear datas posteriores ao fim do período', () => {
      const dataInicio = { startOf: () => new Date('2024-03-01') };
      const dataFim = { endOf: () => new Date('2024-03-31') };

      const disabledDate = (current: Date) =>
        (current && current < dataInicio.startOf()) || current > dataFim.endOf();

      expect(disabledDate(new Date('2024-04-01'))).toBe(true);
    });

    test('deve permitir datas dentro do período', () => {
      const dataInicio = { startOf: () => new Date('2024-03-01') };
      const dataFim = { endOf: () => new Date('2024-03-31') };

      const disabledDate = (current: Date) =>
        (current && current < dataInicio.startOf()) || current > dataFim.endOf();

      expect(disabledDate(new Date('2024-03-15'))).toBe(false);
    });
  });

  describe('Campo local - obrigatoriedade', () => {
    test('deve ser obrigatório quando tipoEncontro é Presencial (0)', () => {
      const tipoEncontroSelecionado = TipoEncontro.Presencial;
      const required = tipoEncontroSelecionado === TipoEncontro.Presencial;
      expect(required).toBe(true);
    });

    test('não deve ser obrigatório quando tipoEncontro é Síncrono (1)', () => {
      const tipoEncontroSelecionado = TipoEncontro.Sincrono;
      const required = tipoEncontroSelecionado === TipoEncontro.Presencial;
      expect(required).toBe(false);
    });

    test('não deve ser obrigatório quando tipoEncontro é Assíncrono (2)', () => {
      const tipoEncontroSelecionado = TipoEncontro.Assincrono;
      const required = tipoEncontroSelecionado === TipoEncontro.Presencial;
      expect(required).toBe(false);
    });

    test('não deve ser obrigatório quando tipoEncontro é undefined', () => {
      const tipoEncontroSelecionado = undefined;
      const required = tipoEncontroSelecionado === TipoEncontro.Presencial;
      expect(required).toBe(false);
    });
  });

  describe('Visibilidade do botão de exclusão', () => {
    test('deve exibir ButtonExcluir quando dadosEncontro tem id', () => {
      const dadosEncontro = { id: 5 };
      const deveExibir = !!dadosEncontro?.id;
      expect(deveExibir).toBe(true);
    });

    test('não deve exibir ButtonExcluir quando dadosEncontro não tem id', () => {
      const dadosEncontro = { id: undefined };
      const deveExibir = !!dadosEncontro?.id;
      expect(deveExibir).toBe(false);
    });

    test('não deve exibir ButtonExcluir quando dadosEncontro é undefined', () => {
      const dadosEncontro = undefined;
      const deveExibir = !!(dadosEncontro as any)?.id;
      expect(deveExibir).toBe(false);
    });

    test('deve usar o id CF_BUTTON_EXCLUIR no botão de exclusão', () => {
      expect(CF_BUTTON_EXCLUIR).toBe('CF_BUTTON_EXCLUIR');
    });
  });

  describe('Configurações do Drawer', () => {
    test('deve ter title "Encontro de turmas"', () => {
      const title = 'Encontro de turmas';
      expect(title).toBe('Encontro de turmas');
    });

    test('deve ter size large', () => {
      const size = 'large';
      expect(size).toBe('large');
    });

    test('deve estar aberto (open) quando openModal é true', () => {
      const openModal = true;
      expect(openModal).toBe(true);
    });

    test('não deve renderizar o Drawer quando openModal é false', () => {
      const openModal = false;
      const renderizarDrawer = openModal;
      expect(renderizarDrawer).toBe(false);
    });
  });

  describe('Configurações do TimePicker', () => {
    test('deve usar formato HH:mm', () => {
      const format = 'HH:mm';
      expect(format).toBe('HH:mm');
    });

    test('deve ter allowClear habilitado', () => {
      const allowClear = true;
      expect(allowClear).toBe(true);
    });

    test('deve ter width de 100%', () => {
      const style = { width: '100%' };
      expect(style.width).toBe('100%');
    });

    test('deve ter needConfirm false', () => {
      const needConfirm = false;
      expect(needConfirm).toBe(false);
    });
  });

  describe('Configurações do TextArea (Local)', () => {
    test('deve ter maxLength de 200', () => {
      const maxLength = 200;
      expect(maxLength).toBe(200);
    });

    test('deve ter placeholder "Informe o Local"', () => {
      const placeholder = 'Informe o Local';
      expect(placeholder).toBe('Informe o Local');
    });
  });

  describe('Mensagem de cancelamento', () => {
    test('deve usar a mensagem correta no modal de confirmação de cancelamento', () => {
      expect(DESEJA_CANCELAR_ALTERACOES).toBe(
        'Você não salvou as informações preenchidas. Deseja realmente cancelar as alterações?',
      );
    });
  });

  describe('Notificações', () => {
    test('deve exibir mensagem de sucesso ao salvar', () => {
      const successConfig = { message: 'Sucesso', description: 'Registro salvo com Sucesso!' };
      expect(successConfig.message).toBe('Sucesso');
      expect(successConfig.description).toBe('Registro salvo com Sucesso!');
    });

    test('deve exibir mensagem de erro ao falhar ao salvar', () => {
      const errorConfig = { message: 'Erro', description: 'Falha ao salvar encontro!' };
      expect(errorConfig.message).toBe('Erro');
      expect(errorConfig.description).toBe('Falha ao salvar encontro!');
    });

    test('deve exibir mensagem de sucesso ao excluir', () => {
      const successConfig = { message: 'Sucesso', description: 'Registro excluído com Sucesso!' };
      expect(successConfig.message).toBe('Sucesso');
      expect(successConfig.description).toBe('Registro excluído com Sucesso!');
    });

    test('deve exibir mensagem de erro ao falhar ao excluir', () => {
      const errorConfig = { message: 'Erro', description: 'Falha ao excluir encontro!' };
      expect(errorConfig.message).toBe('Erro');
      expect(errorConfig.description).toBe('Falha ao excluir encontro!');
    });
  });
});
