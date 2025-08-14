import { useState, useEffect, useRef } from 'react';
import api from '~/core/services/api';

interface TransferirCursistasDTO {
  idFormacaoOrigem: number;
  idTurmaOrigem: number;
  idFormacaoDestino: number;
  idTurmaDestino: number;
  cursistas: {
    rf: string | number;
    idInscricao: string | number;
  }[];
}

export function useTransferirCursistas() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const transferir = async (dados: TransferirCursistasDTO) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post(`/v1/inscricao/transferir`, dados);

      if (response?.data?.mensagem) {
        setMessage(response.data.mensagem);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setMessage(null);
        }, 9000);
      }

      return response.data;
    } catch (err) {
      setMessage('Algumas transferências não puderam ser concluídas. Verifique os itens.');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
      }, 9000);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { transferir, loading, message };
}
