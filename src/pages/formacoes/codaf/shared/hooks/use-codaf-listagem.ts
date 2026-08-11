import { Form } from 'antd';
import dayjs from 'dayjs';
import { useState, useCallback, useEffect } from 'react';
import { notification } from '~/components/lib/notification';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';

export type BuscarDadosFn = (filtros: Record<string, any>) => Promise<{
  sucesso: boolean;
  dados?: { items: any[]; totalRegistros: number };
}>;

export interface UseCodafListagemOptions {
  buscarDados: BuscarDadosFn;
  /**
   * Nome do campo de data do formulário, se aplicável.
   * Será formatado como 'YYYY-MM-DD' antes de enviar ao serviço.
   */
  campoData?: string;
  /**
   * Nome do parâmetro de data a enviar para o serviço (ex: 'DataFinalizacao', 'DataEnvioDf').
   */
  parametroData?: string;
}

export const useCodafListagem = <TItem = any>(
  form: ReturnType<typeof Form.useForm>[0],
  registrosPorPagina: number,
  options: UseCodafListagemOptions,
) => {
  const [dados, setDados] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtroAplicado, setFiltroAplicado] = useState(false);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(
    null,
  );
  const [turmasAPI, setTurmasAPI] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);

  const buscarPagina = useCallback(
    async (pagina = 1) => {
      setLoading(true);
      try {
        const filtros: Record<string, any> = {
          NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
          CodigoFormacao: form.getFieldValue('codigoFormacao') || undefined,
          NumeroHomologacao: form.getFieldValue('numeroHomologacao')
            ? Number(form.getFieldValue('numeroHomologacao'))
            : undefined,
          PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
          AreaPromotoraId: form.getFieldValue('areaPromotoraId') || undefined,
          Status: form.getFieldValue('situacao'),
          NumeroPagina: pagina,
          NumeroRegistros: registrosPorPagina,
        };

        if (options.campoData && options.parametroData) {
          const dataVal = form.getFieldValue(options.campoData);
          filtros[options.parametroData] = dataVal
            ? dayjs(dataVal).format('YYYY-MM-DD')
            : undefined;
        }

        const response = await options.buscarDados(filtros);

        if (response.sucesso && response.dados) {
          setDados(response.dados.items || []);
          setTotalRegistros(response.dados.totalRegistros || 0);
          setPaginaAtual(pagina);
        } else {
          setDados([]);
          setTotalRegistros(0);
        }
      } catch {
        notification.error({ message: 'Erro', description: 'Erro ao buscar dados' });
        setDados([]);
        setTotalRegistros(0);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, registrosPorPagina, options.campoData, options.parametroData, options.buscarDados],
  );

  const onSearchFormacao = useCallback(async (searchText: string) => {
    if (!searchText) {
      setOpcoesFormacao([]);
      return;
    }
    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacao(searchText);
      if (response.sucesso && response.dados?.items) {
        setOpcoesFormacao(response.dados.items);
      } else {
        setOpcoesFormacao([]);
      }
    } catch {
      setOpcoesFormacao([]);
    } finally {
      setLoadingAutocomplete(false);
    }
  }, []);

  const onSelectFormacao = useCallback(
    async (_value: string, option: any) => {
      const proposta = opcoesFormacao.find((p) => p.numeroHomologacao === option.numeroHomologacao);
      if (!proposta) return;

      setPropostaSelecionada(proposta);
      form.setFieldsValue({ turmaId: undefined });

      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmasAPI(response.dados);
          setTurmaDisabled(false);
        } else {
          setTurmasAPI([]);
          setTurmaDisabled(true);
          notification.warning({
            message: 'Atenção',
            description: 'Nenhuma turma encontrada para esta formação',
          });
        }
      } catch {
        setTurmasAPI([]);
        setTurmaDisabled(true);
        notification.error({ message: 'Erro', description: 'Erro ao buscar turmas da formação' });
      }
    },
    [form, opcoesFormacao],
  );

  const onClickFiltrar = useCallback(() => {
    setFiltroAplicado(true);
    buscarPagina(1);
  }, [buscarPagina]);

  const onClickLimpar = useCallback(() => {
    form.resetFields();
    setDados([]);
    setTotalRegistros(0);
    setPaginaAtual(1);
    setFiltroAplicado(false);
    setPropostaSelecionada(null);
    setOpcoesFormacao([]);
    setTurmasAPI([]);
    setTurmaDisabled(true);
  }, [form]);

  const handleTableChange = useCallback(
    (pagination: any, setRegistrosPorPagina: (n: number) => void) => {
      if (pagination.pageSize !== registrosPorPagina) {
        setRegistrosPorPagina(pagination.pageSize);
        setPaginaAtual(1);
      } else {
        buscarPagina(pagination.current);
      }
    },
    [registrosPorPagina, buscarPagina],
  );

  // Recarrega ao mudar registros por página com filtro aplicado
  useEffect(() => {
    if (filtroAplicado) {
      buscarPagina(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosPorPagina]);

  return {
    dados,
    loading,
    setLoading,
    paginaAtual,
    totalRegistros,
    filtroAplicado,
    opcoesFormacao,
    loadingAutocomplete,
    propostaSelecionada,
    turmasAPI,
    turmaDisabled,
    buscarPagina,
    onSearchFormacao,
    onSelectFormacao,
    onClickFiltrar,
    onClickLimpar,
    handleTableChange,
  };
};
