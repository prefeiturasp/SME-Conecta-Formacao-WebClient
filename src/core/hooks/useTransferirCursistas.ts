import { useState } from 'react';
import api from '~/core/services/api';

interface TransferirCursistasDTO {
  idFormacaoOrigem: number;
  idTurmaOrigem: number;
  idFormacaoDestino: number;
  idTurmaDestino: number;
  inscricaoIds: number[];          // para query string
  registroFuncionais: string[];    // para body
}

export function useTransferirCursistas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const transferir = async (dados: TransferirCursistasDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // monta query string com inscriçãoId
      const queryString = dados.inscricaoIds
        .map(id => `id=${id}`)
        .join('&');

      // monta body com registroFuncional
      const body = {
        idFormacaoOrigem: dados.idFormacaoOrigem,
        idTurmaOrigem: dados.idTurmaOrigem,
        idFormacaoDestino: dados.idFormacaoDestino,
        idTurmaDestino: dados.idTurmaDestino,
        Cursistas: dados.registroFuncionais
      };

      const response = await api.post(
        `/v1/inscricao/transferir?${queryString}`,
        body
      );

      if (response?.data?.sucesso) {
        setSuccess(true);
      }

      return response.data;
    } catch (err) {
      setError('Erro ao transferir cursistas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { transferir, loading, error, success };
}
