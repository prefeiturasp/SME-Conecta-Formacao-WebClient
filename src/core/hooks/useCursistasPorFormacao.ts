import { useEffect, useState } from 'react';
import api from '~/core/services/api';

export interface CursistaInscricaoDTO {
  inscricaoId: number;
  nomeCursista: string;
  registroFuncional: string;
  cpf: string;
  situacao: string;
  nomeTurma: string;
}

interface UseCursistasParams {
  idFormacao: number | null;
  cpf?: string;
  nomeCursista?: string;
  registroFuncional?: string;
  turmasId?: number;
  numeroPagina?: number;
  numeroRegistros?: number;
  ocultarCancelada?: boolean;
  ocultarTransferida?: boolean;
  refreshKey?: number;
}

export function useCursistasPorFormacao({
  idFormacao,
  cpf,
  nomeCursista,
  registroFuncional,
  turmasId,
  numeroPagina = 1,
  numeroRegistros = 10,
  ocultarCancelada = true,
  ocultarTransferida = true,
  refreshKey = 0,
}: UseCursistasParams) {
  const [data, setData] = useState<CursistaInscricaoDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idFormacao) return;

    setLoading(true);
    setError(null);

    const params: Record<string, any> = {};
    if (cpf) params.cpf = cpf;
    if (nomeCursista) params.nomeCursista = nomeCursista;
    if (registroFuncional) params.registroFuncional = registroFuncional;
    if (turmasId) params.turmasId = turmasId;
    if (ocultarCancelada !== undefined) params.ocultarCancelada = ocultarCancelada;
    if (ocultarTransferida !== undefined) params.ocultarTransferida = ocultarTransferida;

    api
      .get(`/v1/Inscricao/${idFormacao}`, {
        params,
        headers: {
          numeroPagina,
          numeroRegistros,
        },
      })
      .then((response) => {
        if (response?.data?.items) {
          const cursistas = response.data.items.map((item: any) => ({
            inscricaoId: item.inscricaoId,
            nomeCursista: item.nomeCursista,
            registroFuncional: item.registroFuncional,
            cpf: item.cpf,
            situacao: item.situacao,
            nomeTurma: item.nomeTurma,
          }));
          setData(cursistas);
          setTotal(response.data.totalRegistros || 0);
        }
      })
      .catch(() => {
        setError('Erro ao carregar cursistas');
      })
      .finally(() => setLoading(false));
  }, [
    idFormacao,
    cpf,
    nomeCursista,
    registroFuncional,
    turmasId,
    numeroPagina,
    numeroRegistros,
    ocultarCancelada,
    ocultarTransferida,
    refreshKey    
  ]);

  return { data, total, loading, error };
}
