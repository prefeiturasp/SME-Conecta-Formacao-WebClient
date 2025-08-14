import { useEffect, useState } from 'react';
import api from '~/core/services/api';
import queryString from 'query-string';

export interface FiltroInscricoesProps {
  codigoFormacao?: number | null;
  nomeFormacao?: string | null;
  numeroHomologacao?: number | null;
}

export interface TurmaFormacao {
  propostaTurmaId: number;
  nomeTurma: string;
  data: string;
  quantidadeVagas: number | null;
  quantidadeInscricoes: number | null;
  quantidadeConfirmada: number | null;
  quantidadeAguardandoAnalise: number | null;
  quantidadeEmEspera: number | null;
  quantidadeCancelada: number | null;
  quantidadeDisponivel: number | null;
  quantidadeExcedida: number | null;
  permissao: {
    podeRealizarSorteio: boolean;
  };
}

export interface InscricaoFormacaoComTurmas {
  id: number;
  codigoFormacao: number;
  nomeFormacao: string;
  turmas: TurmaFormacao[];
  tiposInscricoes?: number[];
}

export function useFormacoesSimples(filters: FiltroInscricoesProps = {}) {
  const [data, setData] = useState<InscricaoFormacaoComTurmas[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setErro(null);
      try {
        const resp = await api.get<any>('v1/Inscricao/formacao-turmas', {
          headers: {
            numeroPagina: 1,
            numeroRegistros: 999999,
          },
          params: filters,
          paramsSerializer: {
            serialize: (params) =>
              queryString.stringify(params, { skipNull: true, skipEmptyString: true }),
          },
        });

        setData(resp.data?.items || []);
      } catch (e: any) {
        setErro(
          e?.response?.data?.mensagens?.join(', ') || 'Erro ao carregar formações'
        );
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [filters.codigoFormacao, filters.nomeFormacao, filters.numeroHomologacao]);

  return { data, loading, erro };
}
